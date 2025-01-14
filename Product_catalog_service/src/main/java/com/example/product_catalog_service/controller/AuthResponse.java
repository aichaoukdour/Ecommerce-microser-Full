package com.example.product_catalog_service.controller;

import org.springframework.web.bind.annotation.CrossOrigin;

@CrossOrigin(origins = "http://localhost:3000") // Adjust as needed
public class AuthResponse {
    private boolean success;
    private String message;

    public AuthResponse(boolean success, String message) {
        this.success = success;
        this.message = message;
    }

    // Getters
    public boolean isSuccess() {
        return success;
    }

    public String getMessage() {
        return message;
    }
}
