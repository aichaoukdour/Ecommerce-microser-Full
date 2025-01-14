package com.example.paymentservice.external.client;

import java.util.Base64;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import feign.RequestInterceptor;

@Configuration
public class BasicAuthConfiguration {
    @Bean
    public RequestInterceptor requestInterceptor() {
        return requestTemplate -> {
            requestTemplate.header("Authorization", "Basic " + Base64.getEncoder().encodeToString("cart-service:cart-secret".getBytes()));
        };
    }
}
