package com.example.paymentservice.repositories;

import com.example.paymentservice.entities.Cart;
import com.example.paymentservice.entities.User;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface CartRepository extends JpaRepository<Cart, Long> {
    Cart findByUsername(String username); // Add this method
   

}
