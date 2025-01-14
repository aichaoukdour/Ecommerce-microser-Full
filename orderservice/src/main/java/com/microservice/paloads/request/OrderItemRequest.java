package com.microservice.paloads.request;

import lombok.Data;


@Data
public class OrderItemRequest {
    private Long productId;   // ID du produit
    private String productName; // Nom du produit
    private Integer quantity; // Quantité de l'article
    private Double price;     // Prix de l'article
    private String imagePath; // Add this field
    public OrderItemRequest() {
        // Constructeur par défaut requis
    }

    public OrderItemRequest(Long productId, String productName, Integer quantity, Double price, String imagePath) {
        this.productId = productId;
        this.productName = productName;
        this.quantity = quantity;
        this.price = price;
        this.imagePath = imagePath;
    }

    
}



