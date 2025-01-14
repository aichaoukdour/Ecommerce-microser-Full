package com.microservice.paloads.response;

import jakarta.persistence.Column;

public 

class OrderItemResponse {
    private Long productId;    // ID du produit
    private String productName; // Nom du produit
    private int quantity;       // Quantité commandée
    private double price;       // Prix unitaire
    private double total;       // Prix total pour cet article (quantité * prix)
    private String imagePath; // New field for storing image path

   

    // Getters et Setters
    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public double getTotal() {
        return total;
    }

    public void setTotal(double total) {
        this.total = total;
    }

    public String getImagePath() {
        return imagePath;
    }

    public void setImagePath(String imagePath) {
        this.imagePath = imagePath;
    }
}

