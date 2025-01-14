package com.example.paymentservice.external.client;

import com.example.paymentservice.payload.OrderRequest;

import jakarta.persistence.criteria.Order;

import com.example.paymentservice.external.client.OrderResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;

@FeignClient(name = "order-service", url = "http://localhost:8082")
public interface OrderClient {

    @PostMapping("/orders")
    ResponseEntity<com.example.paymentservice.payload.OrderResponse> createOrder(@RequestBody OrderRequest orderRequest);
}



