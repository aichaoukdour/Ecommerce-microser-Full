package com.example.paymentservice.payload;

import jakarta.persistence.Column;
import lombok.Data;

@Data
public class OrderItemRequest {
    private Long productId; // ID du produit
    private String productName; // Nom du produit
    private int quantity; // Quantité commandée
    private double price; // Prix unitaire
    private String imagePath; // New field for storing image path

    public OrderItemRequest(Long productId, String productName, int quantity, double price, String imagePath) {
        this.productId = productId;
        this.productName = productName;
        this.quantity = quantity;
        this.price = price;
        this.imagePath = imagePath;
    }

    
}
