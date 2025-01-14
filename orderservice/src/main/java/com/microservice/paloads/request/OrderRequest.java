package com.microservice.paloads.request;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;
@Data
public class OrderRequest {
    private String username; // Le nom d'utilisateur qui passe la commande
    private List<OrderItemRequest> orderItems; // Liste des articles dans la commande
    private String paymentMode; // Mode de paiement (ex: "Card", "Cash")

    private Double totalPrice;
public OrderRequest(String username, List<OrderItemRequest> orderItems, String paymentMode, Double totalPrice) {
    this.username = username;
    this.orderItems = orderItems;
    this.paymentMode = paymentMode;
    this.totalPrice = totalPrice;
}
public OrderRequest() {
    // Constructeur par défaut requis pour la désérialisation
}

   
}


