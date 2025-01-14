package com.microservice.paloads.response;

import java.time.LocalDateTime;
import java.util.List;

import com.microservice.entities.Order;
import com.microservice.entities.OrderItem;

public class OrderResponse {
    private Long orderId;
    private String paymentMode;
    private String status;
    private LocalDateTime orderDate; // orderDate en String
    private Double totalPrice;
    private List<OrderItemResponse> orderItems;  // Liste des éléments de la commande
    private String username;  // Utilisateur associé à la commande

    // Constructeur principal
    public OrderResponse(Long orderId, String paymentMode, String status, LocalDateTime orderDate, Double totalPrice,
            List<OrderItemResponse> orderItems, String username) {
        this.orderId = orderId;
        this.status = status;
        this.orderDate = orderDate;
        this.totalPrice = totalPrice;
        this.orderItems = orderItems;
        this.username = username;
        this.paymentMode=paymentMode;
    }

    // Constructeur sans arguments
    public OrderResponse() {}

    // Getters et Setters
    public Long getOrderId() {
        return orderId;
    }

    public void setOrderId(Long orderId) {
        this.orderId = orderId;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getOrderDate() {
        return orderDate;
    }

    public void setOrderDate(LocalDateTime orderDate) {
        this.orderDate = orderDate;
    }

    public Double getTotalPrice() {
        return totalPrice;
    }

    public void setTotalPrice(Double totalPrice) {
        this.totalPrice = totalPrice;
    }

    public List<OrderItemResponse> getOrderItems() {
        return orderItems;
    }

    public void setOrderItems(List<OrderItemResponse> orderItemResponses) {
        this.orderItems = orderItemResponses;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPaymentMode() {
        return paymentMode;
    }

    public void setPaymentMode(String paymentMode) {
        this.paymentMode = paymentMode;
    }
    

    @Override
    public String toString() {
        return "OrderResponse{" +
                "orderId=" + orderId +
                ", status='" + status + '\'' +
                ", orderDate='" + orderDate + '\'' +
                ", totalPrice=" + totalPrice +
                ", orderItems=" + orderItems +
                ", username='" + username + '\'' +
                '}';
    }

   
}