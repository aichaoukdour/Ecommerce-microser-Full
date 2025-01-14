package com.example.product_catalog_service.controller;

import com.example.product_catalog_service.entities.User;
import com.example.product_catalog_service.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserService userService;

    // Get all active users
    @GetMapping("/active")
    public ResponseEntity<List<User>> getActiveUsers() {
        List<User> activeUsers = userService.getActiveUsers();
        return ResponseEntity.ok(activeUsers);
    }

    // Get all inactive users
    @GetMapping("/inactive")
    public ResponseEntity<List<User>> getInactiveUsers() {
        List<User> inactiveUsers = userService.getInactiveUsers();
        return ResponseEntity.ok(inactiveUsers);
    }

    // Activate a user manually by ID
    @PutMapping("/activate/{userId}")
    public ResponseEntity<String> activateUser(@PathVariable Long userId) {
        userService.activateUser(userId);
        return ResponseEntity.ok("User activated successfully");
    }

    // Deactivate a user manually by ID
    @PutMapping("/deactivate/{userId}")
    public ResponseEntity<String> deactivateUser(@PathVariable Long userId) {
        userService.deactivateUser(userId);
        return ResponseEntity.ok("User deactivated successfully");
    }

    // Update activation status of all users based on last login
    @PutMapping("/update-activation-status")
    public ResponseEntity<String> updateUserActivationStatus() {
        userService.updateUserActivationStatus();
        return ResponseEntity.ok("User activation status updated");
    }
}
