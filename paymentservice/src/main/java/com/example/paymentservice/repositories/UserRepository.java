package com.example.paymentservice.repositories;

import com.example.paymentservice.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.security.Timestamp;
import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    List<User> findByLastLoginAfter(Timestamp lastLogin);
    User save(Optional<User> user);
}
