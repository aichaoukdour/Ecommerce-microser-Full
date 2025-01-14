package com.example.paymentservice.payload;

import java.time.LocalDateTime;
import java.util.List;

import org.antlr.v4.runtime.misc.NotNull;

import lombok.Data;
@Data
public class OrderResponse {
    private Long orderId; // ID unique de la commande
    private String username; // Nom de l'utilisateur
      
    private LocalDateTime orderDate; // Date et heure de la commande
    private String status; // Statut de la commande (ex: "Pending", "Paid")
    private double totalPrice; // Prix total de la commande
    private List<OrderItemResponse> orderItems; // Liste des articles commandés
    private String paymentMode; // Mode de paiement utilisé (ex: "Card", "Cash")


    
    public OrderResponse(Long orderId, String username, LocalDateTime orderDate, String status, double totalPrice,
            List<OrderItemResponse> orderItems, String paymentMode) {
        this.orderId = orderId;
        this.username = username;
        this.orderDate = (orderDate != null) ? orderDate : LocalDateTime.now(); // Si orderDate est null, utiliser la date actuelle
        this.status = status;
        this.totalPrice = totalPrice;
        this.orderItems = orderItems;
        this.paymentMode = paymentMode;
    }

    // Getters et Setters
    public Long getOrderId() {
        return orderId;
    }

    public void setOrderId(Long orderId) {
        this.orderId = orderId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public LocalDateTime getOrderDate() {
        return orderDate;
    }

    public void setOrderDate(LocalDateTime orderDate) {
        this.orderDate = orderDate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public double getTotalPrice() {
        return totalPrice;
    }

    public void setTotalPrice(double totalPrice) {
        this.totalPrice = totalPrice;
    }

    public List<OrderItemResponse> getOrderItems() {
        return orderItems;
    }

    public void setOrderItems(List<OrderItemResponse> orderItems) {
        this.orderItems = orderItems;
    }

    public String getPaymentMode() {
        return paymentMode;
    }

    public void setPaymentMode(String paymentMode) {
        this.paymentMode = paymentMode;
    }
}

class OrderItemResponse {
    private Long productId;    // ID du produit
    private String productName; // Nom du produit
    private int quantity;       // Quantité commandée
    private double price;       // Prix unitaire
    private double total;       // Prix total pour cet article (quantité * prix)

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
}

