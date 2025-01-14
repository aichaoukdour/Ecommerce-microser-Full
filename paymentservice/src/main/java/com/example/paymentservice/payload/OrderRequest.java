package com.example.paymentservice.payload;

import java.time.LocalDateTime;
import java.util.List;

import com.example.paymentservice.entities.CartItem;

import lombok.Data;
@Data
public class OrderRequest {
    private String username;
    private String paymentMode;
    private double totalPrice;
   
    private List<OrderItemRequest> orderItems;

    public OrderRequest(String username, String paymentMode, double totalPrice, List<OrderItemRequest> orderItems) {
        this.username = username;
        this.paymentMode = paymentMode;
        this.totalPrice = totalPrice;
        this.orderItems = orderItems;
    }

    public OrderRequest() {
    }
    
    
}
