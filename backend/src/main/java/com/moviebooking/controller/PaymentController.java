package com.moviebooking.controller;

import com.moviebooking.dto.response.ApiResponse;
import com.moviebooking.dto.response.PaymentResponse;
import com.moviebooking.service.PaymentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payment")
@RequiredArgsConstructor
@Tag(name = "Payment", description = "API thanh toán VNPay")
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/vnpay/{bookingId}")
    @Operation(summary = "Tạo URL thanh toán VNPay")
    public ResponseEntity<ApiResponse<String>> createPayment(
            @PathVariable Long bookingId,
            HttpServletRequest request) {
        String paymentUrl = paymentService.createVNPayPayment(bookingId, request);
        return ResponseEntity.ok(ApiResponse.success("Tạo thanh toán thành công", paymentUrl));
    }

    @GetMapping("/vnpay-callback")
    @Operation(summary = "VNPay callback (tự động gọi từ VNPay)")
    public ResponseEntity<ApiResponse<PaymentResponse>> vnpayCallback(HttpServletRequest request) {
        return ResponseEntity.ok(ApiResponse.success(paymentService.handleVNPayCallback(request)));
    }

    @GetMapping("/status/{bookingId}")
    @Operation(summary = "Kiểm tra trạng thái thanh toán")
    public ResponseEntity<ApiResponse<PaymentResponse>> getStatus(@PathVariable Long bookingId) {
        return ResponseEntity.ok(ApiResponse.success(paymentService.getPaymentStatus(bookingId)));
    }

    @PostMapping("/direct/{bookingId}")
    @Operation(summary = "Thanh toán trực tiếp (tiền mặt/test)")
    public ResponseEntity<ApiResponse<PaymentResponse>> payDirectly(@PathVariable Long bookingId) {
        return ResponseEntity.ok(ApiResponse.success("Thanh toán thành công", paymentService.payDirectly(bookingId)));
    }
}
