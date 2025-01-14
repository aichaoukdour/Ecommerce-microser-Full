package com.example.paymentservice.service;


import com.example.paymentservice.exception.PaymentServiceCustomException;
import com.example.paymentservice.entities.TransactionDetails;
import com.example.paymentservice.payload.PaymentRequest;
import com.example.paymentservice.payload.PaymentResponse;
import com.example.paymentservice.repositories.TransactionDetailsRepository;
import com.example.paymentservice.utils.PaymentMode;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;

@Service
@Log4j2
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {

    private final TransactionDetailsRepository transactionDetailsRepository;
    private final RestTemplate restTemplate; // Utiliser RestTemplate pour appeler le service des commandes.

    @Override
    public long doPayment(PaymentRequest paymentRequest) {
        log.info("PaymentServiceImpl | doPayment is called");
        log.info("PaymentServiceImpl | doPayment | Recording Payment Details: {}", paymentRequest);

        TransactionDetails transactionDetails = new TransactionDetails();
        transactionDetails.setPaymentDate(Instant.now());
        transactionDetails.setPaymentMode(paymentRequest.getPaymentMode().name());
        transactionDetails.setPaymentStatus("SUCCESS");
        transactionDetails.setOrderId(paymentRequest.getOrderId());
        transactionDetails.setTotalPrice(paymentRequest.getTotalPrice());

        transactionDetails = transactionDetailsRepository.save(transactionDetails);
        log.info("Transaction Completed with Id: {}", transactionDetails.getId());

        // Appeler l'Order Service pour mettre à jour le statut de la commande
        updateOrderStatus(paymentRequest.getOrderId(), "PAID");

        return transactionDetails.getId();
    }

    // Méthode pour appeler le Order Service pour mettre à jour le statut de la commande
    private void updateOrderStatus(long orderId, String status) {
        String orderServiceUrl = "http://localhost:8082/orders/{orderId}/status"; // URL du service des commandes

        // Créer un objet pour envoyer le statut de la commande
        Map<String, Object> request = new HashMap<>();
        request.put("status", status);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(org.springframework.http.MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(request, headers);

        // Effectuer l'appel REST pour mettre à jour le statut de la commande
        ResponseEntity<Void> response = restTemplate.exchange(orderServiceUrl, HttpMethod.PUT, entity, Void.class, orderId);

        if (response.getStatusCode().is2xxSuccessful()) {
            log.info("Order status updated successfully for orderId: {}", orderId);
        } else {
            log.error("Failed to update order status for orderId: {}", orderId);
        }
    }

    @Override
    public PaymentResponse getPaymentDetailsByOrderId(long orderId) {
        log.info("PaymentServiceImpl | getPaymentDetailsByOrderId is called");
        log.info("PaymentServiceImpl | getPaymentDetailsByOrderId | Getting payment details for the Order Id: {}", orderId);

        TransactionDetails transactionDetails = transactionDetailsRepository.findByOrderId(orderId)
                .orElseThrow(() -> new PaymentServiceCustomException(
                        "TransactionDetails with given id not found", "TRANSACTION_NOT_FOUND"));

        PaymentResponse paymentResponse = PaymentResponse.builder()
                .paymentId(transactionDetails.getId())
                .paymentMode(PaymentMode.valueOf(transactionDetails.getPaymentMode()))
                .paymentDate(transactionDetails.getPaymentDate())
                .orderId(transactionDetails.getOrderId())
                .status(transactionDetails.getPaymentStatus())
                .totalPrice(transactionDetails.getTotalPrice())
                .build();

        log.info("PaymentServiceImpl | getPaymentDetailsByOrderId | paymentResponse: {}", paymentResponse.toString());
        return paymentResponse;
    }
}
