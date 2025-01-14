package com.example.product_catalog_service.payload.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.bind.annotation.CrossOrigin;

@CrossOrigin(origins = "http://localhost:3000") // Adjust as needed
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProductResponse {
    private String productName;  // Name of the product
    private long productId;      // Unique identifier for the product
    private long quantity;        // Available quantity of the product
    private double price;         // Price of the product
    private String imagePath;     // Path to the product image
    private String description;    // Description of the product
    private String category;       // Category of the product
}
