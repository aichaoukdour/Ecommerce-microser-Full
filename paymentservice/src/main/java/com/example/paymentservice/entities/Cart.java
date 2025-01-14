package com.example.paymentservice.entities;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;

@Entity
public class Cart {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToMany(mappedBy = "cart", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    @JsonManagedReference
    private List<CartItem> cartItems = new ArrayList<>();

    private String username;

    // Constructors
    public Cart() {}

    public Cart(String username) {
        this.username = username;
        this.cartItems = new ArrayList<>();
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public List<CartItem> getCartItems() {
        return cartItems;
    }

    public void setCartItems(List<CartItem> cartItems) {
        this.cartItems = cartItems;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public void addCartItem(CartItem cartItem) {
        cartItems.add(cartItem);
        cartItem.setCart(this);
    }

    public void updateCartItemQuantity(Long productId, int newQuantity) {
        for (CartItem item : cartItems) {
            if (item.getProductId().equals(productId)) {
                item.setQuantity(newQuantity);
                return;
            }
        }
        throw new IllegalArgumentException("Product not found in cart");
    }

    // Optional: Remove an item from the cart
    public void removeCartItem(CartItem item2) {
        cartItems.removeIf(item -> item.getProductId().equals(item2));
    }

    @Override
    public String toString() {
        return "Cart{" +
                "id=" + id +
                ", username='" + username + '\'' +
                ", cartItems=" + cartItems +
                '}';
    }
}
