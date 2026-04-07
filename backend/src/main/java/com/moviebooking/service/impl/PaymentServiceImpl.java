package com.moviebooking.service.impl;

import com.moviebooking.config.VNPayConfig;
import com.moviebooking.dto.response.PaymentResponse;
import com.moviebooking.entity.Booking;
import com.moviebooking.entity.Payment;
import com.moviebooking.enums.BookingStatus;
import com.moviebooking.enums.PaymentMethod;
import com.moviebooking.enums.PaymentStatus;
import com.moviebooking.exception.BadRequestException;
import com.moviebooking.exception.ResourceNotFoundException;
import com.moviebooking.repository.BookingRepository;
import com.moviebooking.repository.PaymentRepository;
import com.moviebooking.service.PaymentService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
@RequiredArgsConstructor
@Transactional
public class PaymentServiceImpl implements PaymentService {

    private final VNPayConfig vnPayConfig;
    private final BookingRepository bookingRepository;
    private final PaymentRepository paymentRepository;

    @Override
    public String createVNPayPayment(Long bookingId, HttpServletRequest request) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking", "id", bookingId));

        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new BadRequestException("Chỉ có thể thanh toán cho đơn đặt vé đang chờ");
        }

        long amount = (long) (booking.getTotalAmount() * 100);
        String txnRef = booking.getBookingCode() + "_" + System.currentTimeMillis();

        Map<String, String> params = new TreeMap<>();
        params.put("vnp_Version", "2.1.0");
        params.put("vnp_Command", "pay");
        params.put("vnp_TmnCode", vnPayConfig.getTmnCode());
        params.put("vnp_Amount", String.valueOf(amount));
        params.put("vnp_CurrCode", "VND");
        params.put("vnp_TxnRef", txnRef);
        params.put("vnp_OrderInfo", "Thanh toan ve xem phim - " + booking.getBookingCode());
        params.put("vnp_OrderType", "billpayment");
        params.put("vnp_Locale", "vn");
        params.put("vnp_ReturnUrl", vnPayConfig.getReturnUrl());
        params.put("vnp_IpAddr", getClientIp(request));
        params.put("vnp_CreateDate", LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss")));

        StringBuilder query = new StringBuilder();
        StringBuilder hashData = new StringBuilder();

        for (Map.Entry<String, String> entry : params.entrySet()) {
            if (hashData.length() > 0) {
                hashData.append('&');
                query.append('&');
            }
            hashData.append(entry.getKey()).append('=').append(URLEncoder.encode(entry.getValue(), StandardCharsets.US_ASCII));
            query.append(entry.getKey()).append('=').append(URLEncoder.encode(entry.getValue(), StandardCharsets.US_ASCII));
        }

        String secureHash = hmacSHA512(vnPayConfig.getHashSecret(), hashData.toString());
        query.append("&vnp_SecureHash=").append(secureHash);

        // Create pending payment
        Payment payment = Payment.builder()
                .booking(booking)
                .amount(booking.getTotalAmount())
                .paymentMethod(PaymentMethod.VNPAY)
                .status(PaymentStatus.PENDING)
                .transactionId(txnRef)
                .build();
        paymentRepository.save(payment);

        return vnPayConfig.getVnpUrl() + "?" + query;
    }

    @Override
    public PaymentResponse handleVNPayCallback(HttpServletRequest request) {
        Map<String, String> fields = new HashMap<>();
        Enumeration<String> paramNames = request.getParameterNames();
        while (paramNames.hasMoreElements()) {
            String paramName = paramNames.nextElement();
            String paramValue = request.getParameter(paramName);
            if (paramValue != null && !paramValue.isEmpty()) {
                fields.put(paramName, paramValue);
            }
        }

        String vnpSecureHash = fields.remove("vnp_SecureHash");
        fields.remove("vnp_SecureHashType");

        // Sort and build hash data
        StringBuilder hashData = new StringBuilder();
        new TreeMap<>(fields).forEach((key, value) -> {
            if (hashData.length() > 0) hashData.append('&');
            hashData.append(key).append('=').append(URLEncoder.encode(value, StandardCharsets.US_ASCII));
        });

        String calculatedHash = hmacSHA512(vnPayConfig.getHashSecret(), hashData.toString());

        String txnRef = fields.get("vnp_TxnRef");
        Payment payment = paymentRepository.findByTransactionId(txnRef)
                .orElseThrow(() -> new ResourceNotFoundException("Payment", "transactionId", txnRef));

        if (calculatedHash.equals(vnpSecureHash)) {
            String responseCode = fields.get("vnp_ResponseCode");
            payment.setVnpayResponseCode(responseCode);

            if ("00".equals(responseCode)) {
                payment.setStatus(PaymentStatus.SUCCESS);
                payment.setPaymentTime(LocalDateTime.now());
                payment.getBooking().setStatus(BookingStatus.CONFIRMED);
            } else {
                payment.setStatus(PaymentStatus.FAILED);
                payment.getBooking().setStatus(BookingStatus.EXPIRED);
            }
        } else {
            payment.setStatus(PaymentStatus.FAILED);
        }

        paymentRepository.save(payment);
        bookingRepository.save(payment.getBooking());

        return toResponse(payment);
    }

    @Override
    @Transactional(readOnly = true)
    public PaymentResponse getPaymentStatus(Long bookingId) {
        Payment payment = paymentRepository.findByBookingId(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment", "bookingId", bookingId));
        return toResponse(payment);
    }

    @Override
    public PaymentResponse payDirectly(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking", "id", bookingId));

        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new BadRequestException("Chỉ có thể thanh toán cho đơn đặt vé đang chờ");
        }

        // Create or update payment
        Payment payment = paymentRepository.findByBookingId(bookingId).orElse(
                Payment.builder()
                        .booking(booking)
                        .amount(booking.getTotalAmount())
                        .paymentMethod(PaymentMethod.CASH)
                        .transactionId("CASH_" + booking.getBookingCode())
                        .build()
        );

        payment.setStatus(PaymentStatus.SUCCESS);
        payment.setPaymentTime(LocalDateTime.now());
        paymentRepository.save(payment);

        booking.setStatus(BookingStatus.CONFIRMED);
        bookingRepository.save(booking);

        return toResponse(payment);
    }

    private PaymentResponse toResponse(Payment payment) {
        return PaymentResponse.builder()
                .id(payment.getId())
                .amount(payment.getAmount())
                .paymentMethod(payment.getPaymentMethod())
                .status(payment.getStatus())
                .transactionId(payment.getTransactionId())
                .paymentTime(payment.getPaymentTime())
                .build();
    }

    private String hmacSHA512(String key, String data) {
        try {
            Mac hmac512 = Mac.getInstance("HmacSHA512");
            SecretKeySpec secretKey = new SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), "HmacSHA512");
            hmac512.init(secretKey);
            byte[] result = hmac512.doFinal(data.getBytes(StandardCharsets.UTF_8));
            StringBuilder sb = new StringBuilder(2 * result.length);
            for (byte b : result) {
                sb.append(String.format("%02x", b & 0xff));
            }
            return sb.toString();
        } catch (Exception e) {
            throw new RuntimeException("Error generating HMAC SHA512", e);
        }
    }

    private String getClientIp(HttpServletRequest request) {
        String ip = request.getHeader("X-Forwarded-For");
        if (ip == null || ip.isEmpty()) {
            ip = request.getRemoteAddr();
        }
        return ip;
    }
}
