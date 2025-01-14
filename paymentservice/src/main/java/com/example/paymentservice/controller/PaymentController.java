package com.example.paymentservice.controller;

import com.example.paymentservice.payload.PaymentRequest;
import com.example.paymentservice.payload.PaymentResponse;
import com.example.paymentservice.service.PaymentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payment")
@RequiredArgsConstructor
@Log4j2
public class PaymentController {
    private final PaymentService paymentService;

    @PostMapping
    public ResponseEntity<Long> doPayment(@RequestBody PaymentRequest paymentRequest) {
        log.info("PaymentController | doPayment is called");
        log.info("PaymentController | doPayment | paymentRequest: " + paymentRequest);

        try {
            Long paymentId = paymentService.doPayment(paymentRequest);
            return new ResponseEntity<>(paymentId, HttpStatus.CREATED);  // Retourner l'ID du paiement créé
        } catch (Exception e) {
            log.error("PaymentController | doPayment | Error: " + e.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);  // En cas d'erreur
        }
    }

    @GetMapping("/order/{orderId}")
    public ResponseEntity<PaymentResponse> getPaymentDetailsByOrderId(@PathVariable long orderId) {
        log.info("PaymentController | getPaymentDetailsByOrderId is called for orderId: " + orderId);

        try {
            PaymentResponse paymentResponse = paymentService.getPaymentDetailsByOrderId(orderId);
            return new ResponseEntity<>(paymentResponse, HttpStatus.OK);
        } catch (Exception e) {
            log.error("PaymentController | getPaymentDetailsByOrderId | Error: " + e.getMessage());
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);  // En cas de paiement non trouvé
        }
    }
}
