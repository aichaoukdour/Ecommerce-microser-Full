package com.example.product_catalog_service.repositories;

import com.example.product_catalog_service.entities.Product;
import org.springframework.data.jpa.repository.JpaRepository;
public interface ProductRepository extends JpaRepository<Product,Long> {

}