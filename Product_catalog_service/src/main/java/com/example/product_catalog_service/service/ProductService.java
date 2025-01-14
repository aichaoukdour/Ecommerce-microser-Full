package com.example.product_catalog_service.service;

import com.example.product_catalog_service.payload.request.ProductRequest;
import com.example.product_catalog_service.payload.response.ProductResponse;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface ProductService {
    // Method to add a product, accepting a ProductRequest and a MultipartFile for the product image
    long addProduct(ProductRequest productRequest, MultipartFile imageFile);

    // Method to retrieve a product by its ID
    ProductResponse getProductById(long productId);

    // Method to reduce the quantity of a product
    void reduceQuantity(long productId, long quantity);

    // Method to delete a product by its ID
    void deleteProductById(long productId);
    
    // Method to update an existing product, accepting a ProductRequest and a MultipartFile for the product image
    ProductResponse updateProduct(long productId, ProductRequest productRequest, MultipartFile imageFile);

    // Method to retrieve all products
    List<ProductResponse> getAllProducts();
    
    
}
