package com.microservice.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.microservice.paloads.OrderStatusUpdateRequest;
import com.microservice.paloads.request.OrderRequest;
import com.microservice.paloads.response.OrderResponse;
import com.microservice.services.OrderService;

import java.util.List;

import org.hibernate.ObjectNotFoundException;
import org.hibernate.query.Order;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import exception.OrderNotFoundException;

@RestController
@RequestMapping("/orders")
public class OrderController {

    private static final Logger logger = LoggerFactory.getLogger(OrderController.class);
    @Autowired
    private OrderService orderService;
  

    @Autowired
    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    public ResponseEntity<OrderResponse> createOrder(@RequestBody String rawJson) {
        logger.info("Raw JSON received: {}", rawJson);

        // Convertir le JSON brut en objet OrderRequest
        ObjectMapper objectMapper = new ObjectMapper();
        OrderRequest orderRequest;
        try {
            orderRequest = objectMapper.readValue(rawJson, OrderRequest.class);
        } catch (Exception e) {
            logger.error("Deserialization error: ", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }

        logger.info("OrderRequest: {}", orderRequest);

        // Sauvegarder la commande dans la base de données
        OrderResponse order = orderService.createOrder(orderRequest);

        // Créer une réponse de succès
        OrderResponse orderResponse = new OrderResponse();
        orderResponse.setOrderId(order.getOrderId()); 
        orderResponse.setTotalPrice(order.getTotalPrice());
        orderResponse.setUsername(order.getUsername());
        orderResponse.setStatus(order.getStatus());
        orderResponse.setPaymentMode(order.getPaymentMode());
        // Assurez-vous que `getId()` existe dans votre entité Order

        return ResponseEntity.status(HttpStatus.CREATED).body(orderResponse);
    }

    @PutMapping("/{orderId}/status")
    public ResponseEntity<Void> updateOrderStatus(
            @PathVariable Long orderId, 
            @RequestBody OrderStatusUpdateRequest statusUpdateRequest) {

        try {
            // Appel au service pour mettre à jour le statut de la commande
            orderService.updateOrderStatus(orderId, statusUpdateRequest.getStatus());
            return new ResponseEntity<>(HttpStatus.OK);  // Retourne un OK si tout s'est bien passé
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);  // Retourne NOT_FOUND si l'ID de commande est invalide
        }
    }


    @PutMapping("/{orderId}/cancel")
public ResponseEntity<String> cancelOrder(@PathVariable Long orderId) {
    try {
        orderService.cancelOrder(orderId);
        return ResponseEntity.ok("Order canceled successfully.");
    } catch (OrderNotFoundException e) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Order not found.");
    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to cancel the order.");
    }
}


    @GetMapping("/user/{username}/orders")
public ResponseEntity<List<OrderResponse>> getOrdersByUsername(@PathVariable String username) {
    try {
        List<OrderResponse> orders = orderService.getOrdersByUsername(username);
        return new ResponseEntity<>(orders, HttpStatus.OK);
    } catch (Exception e) {
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
}



@GetMapping
public ResponseEntity<List<OrderResponse>> getAllOrders() {
    try {
        // Appeler le service pour obtenir toutes les commandes
        List<OrderResponse> orders = orderService.getAllOrders();

        // Vérifier si des commandes existent
        if (orders.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT); // Retourne 204 si aucune commande n'existe
        }

        return new ResponseEntity<>(orders, HttpStatus.OK); // Retourne 200 avec la liste des commandes
    } catch (Exception e) {
        // Gérer les erreurs éventuelles
        logger.error("Error fetching all orders: ", e);
        return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR); // Retourne 500 en cas d'erreur serveur
    }
}


@DeleteMapping("/{orderId}")
public ResponseEntity<Void> deleteOrder(@PathVariable Long orderId) {
    orderService.deleteOrder(orderId);
    return ResponseEntity.noContent().build(); // Retourne un statut 204 (No Content)
}


}
