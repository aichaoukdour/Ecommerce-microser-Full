package com.example.paymentservice.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;

@Entity
public class CartItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "cart_id")
    @JsonBackReference
    private Cart cart;

    @Column(nullable = false)
    private Long productId; 

    @Column(nullable = false)
    private String productName;

    @Column(nullable = false)
    private int quantity;

    @Column(nullable = false)  // Ensures price cannot be null
    private double price; // Field for price

    @Column(nullable = false)  // Ensures imagePath cannot be null
    private String imagePath; // New field for storing image path

    // Constructors
    public CartItem() {}

    public CartItem(Long productId, String productName, int quantity, double price, String imagePath) {
        this.productId = productId;
        this.productName = productName;
        this.quantity = quantity;
        this.price = price; // Initialize price
        this.imagePath = imagePath; // Initialize image path
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Cart getCart() {
        return cart;
    }

    public void setCart(Cart cart) {
        this.cart = cart;
    }

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

    public String getImagePath() { // Getter for imagePath
        return imagePath;
    }

    public void setImagePath(String imagePath) { // Setter for imagePath
        this.imagePath = imagePath;
    }

    @Override
    public String toString() {
        return "CartItem{" +
                "id=" + id +
                ", productId=" + productId +
                ", productName='" + productName + '\'' +
                ", quantity=" + quantity +
                ", price=" + price +
                ", imagePath='" + imagePath + '\'' + // Include imagePath in the toString method
                '}';
    }
}
