package com.moviebooking.service;

import com.moviebooking.dto.response.PaymentResponse;
import jakarta.servlet.http.HttpServletRequest;

public interface PaymentService {

    String createVNPayPayment(Long bookingId, HttpServletRequest request);

    PaymentResponse handleVNPayCallback(HttpServletRequest request);

    PaymentResponse getPaymentStatus(Long bookingId);

    PaymentResponse payDirectly(Long bookingId);
}
