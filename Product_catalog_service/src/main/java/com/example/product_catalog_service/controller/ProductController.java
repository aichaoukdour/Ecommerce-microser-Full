package com.example.product_catalog_service.controller;

import com.example.product_catalog_service.entities.Product;
import com.example.product_catalog_service.payload.request.ProductRequest;
import com.example.product_catalog_service.payload.response.ProductResponse;
import com.example.product_catalog_service.repositories.ProductRepository;
import com.example.product_catalog_service.service.ProductService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:3000") // Ajuster si nécessaire
@RestController
@RequestMapping("/product")
@RequiredArgsConstructor
@Log4j2
public class ProductController {

    @Autowired
    private ProductRepository productRepository;

    private final ProductService productService;

    // Ajouter un produit avec image
    @PostMapping(consumes = {"multipart/form-data"})
    public ResponseEntity<Long> addProduct(@Valid @ModelAttribute ProductRequest productRequest, @RequestParam("image") MultipartFile image) {
        log.info("ProductController | addProduct est appelé");
        log.info("ProductController | addProduct | productRequest : {}", productRequest);

        long productId = productService.addProduct(productRequest, image);
        return new ResponseEntity<>(productId, HttpStatus.CREATED);
    }

    // Récupérer un produit par son ID
    @GetMapping("/{id}")
    public ResponseEntity<ProductResponse> getProductById(@PathVariable("id") long productId) {
        log.info("ProductController | getProductById is called");
        log.info("ProductController | getProductById | productId : {}", productId);

        ProductResponse productResponse = productService.getProductById(productId);
        return new ResponseEntity<>(productResponse, HttpStatus.OK);
    }

    // Récupérer tous les produits
    @GetMapping
    public ResponseEntity<List<ProductResponse>> getAllProducts() {
        log.info("ProductController | getAllProducts is called");
        List<ProductResponse> products = productService.getAllProducts();
        return new ResponseEntity<>(products, HttpStatus.OK);
    }

    // Réduire la quantité d'un produit
    @PutMapping("/reduceQuantity/{id}")
    public ResponseEntity<Void> reduceQuantity(
            @PathVariable("id") long productId,
            @RequestParam long quantity
    ) {
        log.info("ProductController | reduceQuantity is called");
        log.info("ProductController | reduceQuantity | productId : {}", productId);
        log.info("ProductController | reduceQuantity | quantity : {}", quantity);

        productService.reduceQuantity(productId, quantity);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    // Supprimer un produit par son ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProductById(@PathVariable("id") long productId) {
        log.info("ProductController | deleteProductById is called");
        log.info("ProductController | deleteProductById | productId : {}", productId);
        productService.deleteProductById(productId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    // Modifier un produit (mettre à jour)
    @PutMapping("/{id}")
    public ResponseEntity<ProductResponse> updateProduct(
            @PathVariable("id") long productId,
            @Valid @ModelAttribute ProductRequest productRequest,
            @RequestParam(value = "image", required = false) MultipartFile image) {
        log.info("ProductController | updateProduct is called");
        log.info("ProductController | updateProduct | productId : {}", productId);

        ProductResponse updatedProduct = productService.updateProduct(productId, productRequest, image);
        return new ResponseEntity<>(updatedProduct, HttpStatus.OK);
    }



     // Méthode pour obtenir la quantité disponible d'un produit
    @GetMapping("/{productId}/quantity")
    public ResponseEntity<Long> getProductQuantity(@PathVariable("productId") Long productId) {
        Optional<Product> productOpt = productRepository.findById(productId);
        if (productOpt.isPresent()) {
            long availableQuantity = productOpt.get().getQuantity();  // Utilisation de 'quantity' ici
            return ResponseEntity.ok(availableQuantity);
        }
        return ResponseEntity.notFound().build();  // Si le produit n'est pas trouvé
    }
}




