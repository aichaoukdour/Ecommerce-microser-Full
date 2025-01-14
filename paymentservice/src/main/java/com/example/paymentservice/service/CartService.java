package com.example.paymentservice.service;

import com.example.paymentservice.entities.Cart;
import com.example.paymentservice.entities.CartItem;
import com.example.paymentservice.external.client.OrderClient;
import com.example.paymentservice.payload.*;
import com.example.paymentservice.repositories.CartItemRepository;
import com.example.paymentservice.repositories.CartRepository;

import org.hibernate.cache.spi.support.AbstractReadWriteAccess.Item;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CartService {
    private static final Logger logger = LoggerFactory.getLogger(CartService.class);

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private OrderClient orderClient; // Injecter le Feign Client pour OrderService

    @Transactional
    public Cart addToCart(String username, Long productId, String productName, int quantity, double price, String imagePath) {
        logger.info("Adding to cart - User: {}, Product ID: {}, Quantity: {}", username, productId, quantity);

        // Retrieve or create a cart for the user
        Cart cart = cartRepository.findByUsername(username);
        if (cart == null) {
            cart = new Cart();
            cart.setUsername(username);
            cart = cartRepository.save(cart);
            logger.debug("New cart created for user: {}", username);
        }

        // Check and update existing cart item
        CartItem existingItem = cartItemRepository.findByCartIdAndProductId(cart.getId(), productId);
        if (existingItem != null) {
            existingItem.setQuantity(existingItem.getQuantity() + quantity);
            cartItemRepository.save(existingItem);
            logger.debug("Updated cart item quantity - Product ID: {}, New Quantity: {}", productId, existingItem.getQuantity());
        } else {
            // Create a new cart item if not found
            CartItem cartItem = new CartItem();
            cartItem.setProductId(productId);
            cartItem.setProductName(productName);
            cartItem.setQuantity(quantity);
            cartItem.setPrice(price);
            cartItem.setImagePath(imagePath != null && !imagePath.isEmpty() ? imagePath : "path/to/default-image.png");
            cart.addCartItem(cartItem);
            logger.debug("New cart item added - Product ID: {}, Quantity: {}", productId, quantity);
        }

        cartRepository.save(cart); // Save cart with updates
        logger.info("Cart updated successfully for user: {}", username);

        return cart;
    }

    public List<CartItem> getCartItems(String username) {
        logger.info("Fetching cart items for user: {}", username);
        Cart cart = cartRepository.findByUsername(username);
        return (cart != null) ? cart.getCartItems() : List.of(); // Return empty list if cart not found
    }

    public Cart getCartByUsername(String username) {
        logger.info("Fetching cart for user: {}", username);
        Cart cart = cartRepository.findByUsername(username);
        if (cart == null) {
            logger.warn("No cart found for user: {}", username);
        }
        return cart;
    }

    @Transactional
    public Cart updateCartItemQuantity(String username, Long productId, int quantity) {
        logger.info("Updating quantity for Product ID: {} in cart for User: {}", productId, username);
        Cart cart = cartRepository.findByUsername(username);
        if (cart != null) {
            CartItem item = cartItemRepository.findByCartIdAndProductId(cart.getId(), productId);
            if (item != null) {
                item.setQuantity(quantity);
                cartItemRepository.save(item);
                logger.info("Updated cart item quantity - Product ID: {}, New Quantity: {}", productId, quantity);
            } else {
                logger.warn("Cart item not found - Product ID: {}", productId);
            }
        } else {
            logger.warn("No cart found for user: {}", username);
        }
        return cart;
    }

    @Transactional
    public Cart removeCartItem(String username, Long productId) {
        logger.info("Removing Product ID: {} from cart for User: {}", productId, username);
        Cart cart = cartRepository.findByUsername(username);
        if (cart != null) {
            CartItem item = cartItemRepository.findByCartIdAndProductId(cart.getId(), productId);
            if (item != null) {
                cartItemRepository.delete(item);
                cart.getCartItems().remove(item); // Remove the item from the cart's item list
                logger.info("Removed cart item - Product ID: {}", productId);
            } else {
                logger.warn("Cart item not found - Product ID: {}", productId);
            }
        } else {
            logger.warn("No cart found for user: {}", username);
        }
        return cart;
    }

    // Nouvelle méthode pour envoyer la commande au OrderService
    public OrderResponse createOrderFromCart(String username, String paymentMode, double totalAmount) {
        // Récupérer le panier de l'utilisateur
        Cart cart = cartRepository.findByUsername(username);
    
        if (cart == null || cart.getCartItems().isEmpty()) {
            throw new RuntimeException("Panier vide ou utilisateur introuvable");
        }
    
        // Calculer le montant total directement côté backend
        double calculatedTotal = cart.getCartItems().stream()
                .mapToDouble(item -> item.getPrice() * item.getQuantity())
                .sum();
    
        // Vérifier si le totalAmount correspond au montant calculé
        if (totalAmount != calculatedTotal) {
            throw new RuntimeException("Le montant total fourni ne correspond pas au montant calculé côté backend");
        }
    
        // Créer la requête de commande (OrderRequest)
        OrderRequest orderRequest = new OrderRequest();
        orderRequest.setUsername(username);
        orderRequest.setPaymentMode(paymentMode);
        orderRequest.setTotalPrice(calculatedTotal); // Utiliser le montant calculé
    
        // Créer les éléments de la commande (OrderItemRequest)
        List<OrderItemRequest> orderItems = cart.getCartItems().stream()
                .map(item -> {
                    logger.info("Adding to Order - Product ID: {}", item.getProductId());
                    return new OrderItemRequest(item.getProductId(), item.getProductName(), item.getQuantity(), item.getPrice(), item.getImagePath()); // Make sure to include imagePath
                })
                .collect(Collectors.toList());
        orderRequest.setOrderItems(orderItems);
    
        // **Ajout d'un log pour afficher OrderRequest avant de l'envoyer**
        logger.info("OrderRequest to send: {}", orderRequest);
    
        // Appeler le OrderService via FeignClient
        ResponseEntity<OrderResponse> response = orderClient.createOrder(orderRequest);
    
        // Vérifier la réponse du OrderService
        if (response.getStatusCode() == HttpStatus.CREATED) {
            // Si la commande a été créée, vider le panier
            cartRepository.delete(cart);
            return response.getBody(); // Retourner la réponse de la commande créée
        } else {
            throw new RuntimeException("Échec de la création de la commande");
        }
    }
    
}