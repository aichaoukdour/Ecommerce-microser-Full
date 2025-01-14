package com.example.paymentservice.controller;

import com.example.paymentservice.entities.Cart;
import com.example.paymentservice.entities.CartItem;
import com.example.paymentservice.external.client.OrderResponse;
import com.example.paymentservice.payload.OrderRequest;
import com.example.paymentservice.service.CartService;

import jakarta.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.File;
import java.io.IOException;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    private static final Logger logger = LoggerFactory.getLogger(CartController.class);

    @Autowired
    private CartService cartService;

    // Method to add an item to the cart
    @PostMapping("/user/{username}/add")
    public ResponseEntity<Cart> addToCart(
            @PathVariable String username,
            @RequestParam(value = "file", required = false) MultipartFile file, // Optional image upload
            @RequestParam("productId") Long productId,
            @RequestParam("productName") String productName,
            @RequestParam("quantity") int quantity,
            @RequestParam("price") double price,
            @RequestParam(value = "imagePath", required = false) String imagePath) {

        logger.info("Adding item to cart for user: {}", username);
        
        // If an image file is provided, save it and use its path
        if (file != null && !file.isEmpty()) {
            imagePath = saveImage(file);
        }

        // Use the imagePath provided or saved
        Cart cart = cartService.addToCart(username, productId, productName, quantity, price, imagePath);
        
        return ResponseEntity.ok(cart);
    }

    // Method to save the image file
    private String saveImage(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            return "uploads/images/default.png";  // Default image path if no file provided
        }
        String directoryPath = "uploads/images";
        File directory = new File(directoryPath);
        if (!directory.exists()) {
            directory.mkdirs(); // Create directory if it doesn't exist
        }

        String filePath = directoryPath + "/" + file.getOriginalFilename();
        File imageFile = new File(filePath);

        try {
            file.transferTo(imageFile); // Save the file to the filesystem
        } catch (IOException e) {
            logger.error("Failed to save image", e);
            return null; // Return null if saving fails
        }

        return filePath; // Return the path of the saved image
    }

    // Retrieve all cart items for a user
    @GetMapping("/user/{username}")
    public ResponseEntity<List<CartItem>> getCartItems(@PathVariable String username) {
        logger.info("Retrieving cart items for user: {}", username);
        List<CartItem> cartItems = cartService.getCartItems(username);
        return ResponseEntity.ok(cartItems);
    }

    // Retrieve full cart for a user
    @GetMapping("/user/{username}/full")
    public ResponseEntity<Cart> getCart(@PathVariable String username) {
        logger.info("Retrieving full cart for user: {}", username);
        Cart cart = cartService.getCartByUsername(username);

        if (cart != null) {
            logger.info("Retrieved full cart for user {}: {}", username, cart);
            return ResponseEntity.ok(cart);
        } else {
            logger.warn("No cart found for user: {}", username);
            return ResponseEntity.notFound().build(); // Return 404 if cart is not found
        }
    }

    // Update cart item quantity
    @PutMapping("/user/{username}/item/{productId}")
    public ResponseEntity<Cart> updateCartItemQuantity(
            @PathVariable String username,
            @PathVariable Long productId,
            @RequestBody UpdateCartItemRequest request) { // Use a request body class
        logger.info("Updating quantity for Product ID: {} in cart for User: {}", productId, username);
        Cart updatedCart = cartService.updateCartItemQuantity(username, productId, request.getQuantity());
        return ResponseEntity.ok(updatedCart);
    }

    // Remove item from cart
    @DeleteMapping("/user/{username}/item/{productId}")
    public ResponseEntity<Cart> removeCartItem(@PathVariable String username, @PathVariable Long productId) {
        logger.info("Removing Product ID: {} from cart for User: {}", productId, username);
        Cart updatedCart = cartService.removeCartItem(username, productId);
        return ResponseEntity.ok(updatedCart);
    }


    @PostMapping("/create-order/{username}")
public ResponseEntity<com.example.paymentservice.payload.OrderResponse> createOrder(
        @PathVariable("username") String username,
        @RequestParam("paymentMode") String paymentMode,
        @RequestParam("totalAmount") double totalAmount) { // Ajout de totalAmount
    logger.info("Request to create order for user: {}, paymentMode: {}, totalAmount: {}", username, paymentMode, totalAmount);

    // Appeler le CartService pour créer une commande
    com.example.paymentservice.payload.OrderResponse orderResponse = cartService.createOrderFromCart(username, paymentMode, totalAmount);

    if (orderResponse != null) {
        logger.info("Order created successfully for user: {}", username);
        return ResponseEntity.status(HttpStatus.CREATED).body(orderResponse);
    } else {
        logger.error("Failed to create order for user: {}", username);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
    }
}

    
      // Class to handle the request body for updating cart item quantity
      public static class UpdateCartItemRequest {
        private int quantity;

        // Getter and setter
        public int getQuantity() {
            return quantity;
        }

        public void setQuantity(int quantity) {
            this.quantity = quantity;
        }
    }



    
}
