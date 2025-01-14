package com.example.paymentservice.service;



import com.example.paymentservice.payload.PaymentRequest;
import com.example.paymentservice.payload.PaymentResponse;

public interface PaymentService {
    long doPayment(PaymentRequest paymentRequest);
    PaymentResponse getPaymentDetailsByOrderId(long orderId);
}
