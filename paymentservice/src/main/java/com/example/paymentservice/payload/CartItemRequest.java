package com.example.paymentservice.payload;

public class CartItemRequest {
    private Long productId;   // ID of the product to be added to the cart
    private int quantity;     // Quantity of the product to be added

    // Getter for productId
    public Long getProductId() {
        return productId;
    }

    // Setter for productId
    public void setProductId(Long productId) {
        this.productId = productId;
    }

    // Getter for quantity
    public int getQuantity() {
        return quantity;
    }

    // Setter for quantity
    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }
}
