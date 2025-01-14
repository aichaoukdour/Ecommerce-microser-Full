package com.microservice.services;

import com.microservice.entities.Order;
import com.microservice.entities.OrderItem;
import com.microservice.paloads.request.OrderRequest;
import com.microservice.paloads.response.OrderItemResponse;
import com.microservice.paloads.response.OrderResponse;
import com.microservice.repositories.OrderRepository;
import com.microservice.repositories.OrderItemRepository;
import exception.OrderNotFoundException;
import jakarta.transaction.Transactional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderService {

    private static final Logger logger = LoggerFactory.getLogger(OrderService.class);

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;

    @Autowired
    public OrderService(OrderRepository orderRepository, OrderItemRepository orderItemRepository) {
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
    }

    /**
     * Créer une nouvelle commande à partir de la requête de commande reçue.
     * @param orderRequest La requête contenant les détails de la commande.
     * @return La réponse contenant les informations de la commande créée.
     */
    public OrderResponse createOrder(OrderRequest orderRequest) {
        // Loguer la requête reçue
        logger.info("Requête OrderRequest reçue : {}", orderRequest);

        // Créer la commande
        Order order = new Order();
        order.setUsername(orderRequest.getUsername());
        order.setPaymentMode(orderRequest.getPaymentMode());
        order.setTotalPrice(orderRequest.getTotalPrice());
        order.setOrderDate(LocalDateTime.now());
        order.setStatus("PENDING");

        // Sauvegarder la commande dans la base de données
        Order savedOrder = orderRepository.save(order);

        // Créer les éléments de la commande (OrderItems)
        List<OrderItem> orderItems = orderRequest.getOrderItems().stream()
                .map(itemRequest -> {
                    OrderItem orderItem = new OrderItem();
                    orderItem.setOrder(savedOrder);
                    orderItem.setProductName(itemRequest.getProductName());
                    orderItem.setQuantity(itemRequest.getQuantity());
                    orderItem.setPrice(itemRequest.getPrice());
                    orderItem.setImagePath(itemRequest.getImagePath()); // Set the image path
                    return orderItem;
                })
                .collect(Collectors.toList());

        // Sauvegarder les éléments de commande dans la base de données
        orderItemRepository.saveAll(orderItems);

        // Convertir les OrderItems en OrderItemResponse pour la réponse
        List<OrderItemResponse> orderItemResponses = orderItems.stream().map(item -> {
            OrderItemResponse response = new OrderItemResponse();
            response.setProductId(item.getId());
            response.setProductName(item.getProductName());
            response.setQuantity(item.getQuantity());
            response.setPrice(item.getPrice());
            response.setTotal(item.getPrice() * item.getQuantity()); // Calculate total price
            response.setImagePath(item.getImagePath()); // Include the image path in the response
            return response;
        }).collect(Collectors.toList());

        // Créer et retourner la réponse
        OrderResponse orderResponse = new OrderResponse();
        orderResponse.setOrderId(savedOrder.getId());
        orderResponse.setUsername(savedOrder.getUsername());
        orderResponse.setTotalPrice(savedOrder.getTotalPrice());
        orderResponse.setOrderDate(savedOrder.getOrderDate());
        orderResponse.setStatus(savedOrder.getStatus());
        orderResponse.setPaymentMode(savedOrder.getPaymentMode());
        orderResponse.setOrderItems(orderItemResponses); // Ajout des OrderItems à la réponse

        // Log de la réponse
        logger.info("OrderResponse créée : {}", orderResponse);

        return orderResponse;
    }

    // Méthode pour mettre à jour le statut de la commande
    public void updateOrderStatus(Long orderId, String status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Commande introuvable avec ID : " + orderId));
        order.setStatus(status); // Met à jour le statut
        orderRepository.save(order); // Sauvegarde l'ordre avec le nouveau statut
    }

    // Méthode pour obtenir les commandes par nom d'utilisateur
    public List<OrderResponse> getOrdersByUsername(String username) {
        List<Order> orders = orderRepository.findByUsername(username);

        // Convertir la liste d'ordres en liste de réponses
        return orders.stream().map(order -> {
            OrderResponse response = new OrderResponse();
            response.setOrderId(order.getId());
            response.setTotalPrice(order.getTotalPrice());
            response.setOrderDate(order.getOrderDate());
            response.setStatus(order.getStatus());
            response.setPaymentMode(order.getPaymentMode());

            // Récupérer et ajouter les OrderItems à la réponse
            List<OrderItem> orderItems = orderItemRepository.findByOrderId(order.getId());
            List<OrderItemResponse> orderItemResponses = orderItems.stream().map(item -> {
                OrderItemResponse itemResponse = new OrderItemResponse();
                itemResponse.setProductId(item.getId());
                itemResponse.setProductName(item.getProductName());
                itemResponse.setQuantity(item.getQuantity());
                itemResponse.setPrice(item.getPrice());
                itemResponse.setTotal(item.getPrice() * item.getQuantity()); // Calculate total price
                itemResponse.setImagePath(item.getImagePath()); // Include the image path in the response
                return itemResponse;
            }).collect(Collectors.toList());
            response.setOrderItems(orderItemResponses);

            // Log the response for debugging
            logger.info("OrderResponse créée pour utilisateur {} : {}", username, response);

            return response;
        }).collect(Collectors.toList());
    }

    // Méthode pour annuler une commande
    public void cancelOrder(Long orderId) throws OrderNotFoundException {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new OrderNotFoundException("Order not found."));
        order.setStatus("CANCELED");
        orderRepository.save(order);
    }

    // Méthode pour obtenir toutes les commandes
    public List<OrderResponse> getAllOrders() {
        // Récupérer toutes les commandes depuis la base de données
        List<Order> orders = orderRepository.findAll();

        // Convertir les entités Order en objets OrderResponse
        return orders.stream()
                .map(order -> {
                    OrderResponse response = new OrderResponse();
                    response.setOrderId(order.getId());
                    response.setUsername(order.getUsername());
                    response.setTotalPrice(order.getTotalPrice());
                    response.setStatus(order.getStatus());
                    response.setPaymentMode(order.getPaymentMode());

                    // Convertir les OrderItems en OrderItemResponse
                    List<OrderItemResponse> orderItemResponses = order.getOrderItems().stream()
                            .map(item -> {
                                OrderItemResponse itemResponse = new OrderItemResponse();
                                itemResponse.setProductId(item.getId());
                                itemResponse.setProductName(item.getProductName());
                                itemResponse.setQuantity(item.getQuantity());
                                itemResponse.setPrice(item.getPrice());
                                itemResponse.setTotal(item.getPrice() * item.getQuantity()); // Calculate total price
                                itemResponse.setImagePath(item.getImagePath()); // Include the image path in the response
                                return itemResponse;
                            })
                            .collect(Collectors.toList());

                    response.setOrderItems(orderItemResponses); // Inclure les détails des items de commande
                    return response;
                })
                .collect(Collectors.toList());
    }

    
    /**
 * Supprimer une commande et tous ses éléments associés.
 * @param orderId L'ID de la commande à supprimer.
 * @throws OrderNotFoundException Si la commande avec l'ID spécifié n'existe pas.
 */
@Transactional
public void deleteOrder(Long orderId) throws OrderNotFoundException {
    // Vérifier si la commande existe
    Order order = orderRepository.findById(orderId)
            .orElseThrow(() -> new OrderNotFoundException("Commande introuvable avec ID : " + orderId));

    // Supprimer les OrderItems associés à la commande
    orderItemRepository.deleteByOrderId(orderId);

    // Supprimer la commande
    orderRepository.delete(order);

    // Loguer la suppression
    logger.info("Commande avec ID {} et ses éléments associés ont été supprimés.", orderId);
}


}
