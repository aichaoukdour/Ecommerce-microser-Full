package com.example.product_catalog_service.repositories;

import com.example.product_catalog_service.entities.User;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
    User findByUsername(String username);
    User findByEmail(String email); // Ajout d'une méthode pour trouver par email
    boolean existsByUsername(String username); // Vérifie si le nom d'utilisateur existe
    boolean existsByEmail(String email); // Vérifie si l'email existe
    // Trouver tous les utilisateurs inactifs
List<User> findByIsActiveFalse();
List<User> findByIsActiveTrue();

}
