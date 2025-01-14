package com.example.paymentservice.repositories;

import com.example.paymentservice.entities.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {

    CartItem findByCartIdAndProductId(Long cart_id, Long productId);

}