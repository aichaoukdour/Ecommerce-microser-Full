package com.microservice.paloads;



import lombok.Data;

@Data
public class OrderStatusUpdateRequest {
    private String status ="PAID";  // Le nouveau statut de la commande (ex: "PAID", "SHIPPED")
}
