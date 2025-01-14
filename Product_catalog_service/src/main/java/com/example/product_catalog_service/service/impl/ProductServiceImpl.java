package com.example.product_catalog_service.service.impl;

import com.example.product_catalog_service.entities.Product;
import com.example.product_catalog_service.exception.ProductServiceCustomException;
import com.example.product_catalog_service.payload.request.ProductRequest;
import com.example.product_catalog_service.payload.response.ProductResponse;
import com.example.product_catalog_service.repositories.ProductRepository;
import com.example.product_catalog_service.service.ProductService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Log4j2
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final String IMAGE_UPLOAD_DIR = "uploads/images";

    @Override
    public long addProduct(ProductRequest productRequest, MultipartFile imageFile) {
        log.info("ProductServiceImpl | addProduct with image is called");

        if (productRequest.getQuantity() < 0 || productRequest.getPrice() < 0) {
            throw new ProductServiceCustomException("Quantity and price must be non-negative", "INVALID_INPUT");
        }

        String imagePath = saveImageFile(imageFile);

        Product product = Product.builder()
                .productName(productRequest.getName())
                .quantity(productRequest.getQuantity())
                .price(productRequest.getPrice())
                .description(productRequest.getDescription()) // New field
                .category(productRequest.getCategory()) // New field
                .imagePath(imagePath)
                .build();

        product = productRepository.save(product);
        log.info("ProductServiceImpl | addProduct | Product Created with Id : {}", product.getProductId());
        return product.getProductId();
    }

    private String saveImageFile(MultipartFile imageFile) {
        if (imageFile.isEmpty()) {
            log.error("Uploaded file is empty");
            throw new ProductServiceCustomException("Uploaded file is empty", "IMAGE_UPLOAD_ERROR");
        }

        try {
            Path uploadPath = Paths.get(IMAGE_UPLOAD_DIR).toAbsolutePath();
            Files.createDirectories(uploadPath);

            String originalFilename = imageFile.getOriginalFilename();
            if (originalFilename == null) {
                throw new IOException("Filename is null");
            }

            if (!imageFile.getContentType().startsWith("image/")) {
                throw new ProductServiceCustomException("Uploaded file is not an image", "IMAGE_UPLOAD_ERROR");
            }

            String fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
            String fileName = originalFilename.replace(fileExtension, "") + fileExtension;

            int count = 1;
            while (Files.exists(uploadPath.resolve(fileName))) {
                fileName = originalFilename.replace(fileExtension, "") + "_" + count + fileExtension;
                count++;
            }

            Path filePath = uploadPath.resolve(fileName);
            imageFile.transferTo(filePath.toFile());
            log.info("Image saved at: {}", filePath.toString());

            return IMAGE_UPLOAD_DIR + "/" + fileName;
        } catch (IOException e) {
            log.error("Failed to save image: {}", e.getMessage(), e);
            throw new ProductServiceCustomException("Failed to save image", "IMAGE_UPLOAD_ERROR");
        }
    }

    @Override
    public ProductResponse getProductById(long productId) {
        log.info("ProductServiceImpl | getProductById is called for productId: {}", productId);

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ProductServiceCustomException("Product with given Id not found", "PRODUCT_NOT_FOUND"));

        return convertToProductResponse(product);
    }

    @Override
    public void reduceQuantity(long productId, long quantity) {
        log.info("ProductServiceImpl | reduceQuantity is called for productId: {} with quantity: {}", productId, quantity);

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ProductServiceCustomException("Product with given Id not found", "PRODUCT_NOT_FOUND"));

        if (product.getQuantity() < quantity) {
            throw new ProductServiceCustomException("Insufficient quantity", "INSUFFICIENT_QUANTITY");
        }

        product.setQuantity(product.getQuantity() - quantity);
        productRepository.save(product);
        log.info("Product quantity reduced. New quantity: {}", product.getQuantity());
    }

    @Override
    public void deleteProductById(long productId) {
        log.info("ProductServiceImpl | deleteProductById is called for productId: {}", productId);

        if (!productRepository.existsById(productId)) {
            throw new ProductServiceCustomException("Product with given Id not found", "PRODUCT_NOT_FOUND");
        }

        productRepository.deleteById(productId);
        log.info("Product with id: {} deleted successfully", productId);
    }

    @Override
    public List<ProductResponse> getAllProducts() {
        log.info("ProductServiceImpl | getAllProducts is called");

        List<Product> products = productRepository.findAll();

        if (products.isEmpty()) {
            log.info("No products found.");
            return List.of();
        }

        return products.stream()
                .map(this::convertToProductResponse)
                .collect(Collectors.toList());
    }

    private ProductResponse convertToProductResponse(Product product) {
        return ProductResponse.builder()
                .productId(product.getProductId())
                .productName(product.getProductName())
                .quantity(product.getQuantity())
                .price(product.getPrice())
                .imagePath(product.getImagePath())
                .description(product.getDescription()) // New field
                .category(product.getCategory()) // New field
                .build();
    }

    @Override
    public ProductResponse updateProduct(long productId, ProductRequest productRequest, MultipartFile imageFile) {
        log.info("ProductServiceImpl | updateProduct is called for productId: {}", productId);

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ProductServiceCustomException("Product with given Id not found", "PRODUCT_NOT_FOUND"));

        product.setProductName(productRequest.getName());
        product.setQuantity(productRequest.getQuantity());
        product.setPrice(productRequest.getPrice());
        product.setDescription(productRequest.getDescription()); // New field
        product.setCategory(productRequest.getCategory()); // New field

        if (imageFile != null && !imageFile.isEmpty()) {
            String newImagePath = saveImageFile(imageFile);
            product.setImagePath(newImagePath);
        }

        product = productRepository.save(product);
        log.info("ProductServiceImpl | updateProduct | Product Updated with Id : {}", product.getProductId());

        return convertToProductResponse(product);
    }
}
