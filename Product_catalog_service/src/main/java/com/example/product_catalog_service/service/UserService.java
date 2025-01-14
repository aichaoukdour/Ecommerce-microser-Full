package com.example.product_catalog_service.service;

import com.example.product_catalog_service.entities.User;
import com.example.product_catalog_service.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    // Update the activation status of all users based on their last login
    public void updateUserActivationStatus() {
        List<User> users = userRepository.findAll(); // Retrieve all users

        for (User user : users) {
            if (user.getLastLogin() == null) {
                user.setIsActive(false); // Disable users who never logged in (lastLogin is null)
            } else {
                long daysSinceLastLogin = ChronoUnit.DAYS.between(user.getLastLogin(), LocalDateTime.now());
                if (daysSinceLastLogin > 30) {
                    user.setIsActive(false); // Disable users who haven't logged in for 30 days
                } else {
                    user.setIsActive(true); // Enable users who logged in within the last 30 days
                }
            }
            userRepository.save(user); // Save the updated user status
        }for (User user : users) {
            if (user.getLastLogin() == null) {
                System.out.println("User " + user.getId() + " has no last login. Setting is_active to false.");
                user.setIsActive(false);
            } else {
                long daysSinceLastLogin = ChronoUnit.DAYS.between(user.getLastLogin(), LocalDateTime.now());
                if (daysSinceLastLogin > 30) {
                    user.setIsActive(false);
                } else {
                    user.setIsActive(true);
                }
            }
            userRepository.save(user);
        }
        
    }

    // Activate a user manually
    public void activateUser(Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new IllegalArgumentException("User not found"));
        user.setIsActive(true); // Activate the user
        userRepository.save(user); // Save the updated user
    }

    // Deactivate a user manually
    public void deactivateUser(Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new IllegalArgumentException("User not found"));
        user.setIsActive(false); // Deactivate the user
        userRepository.save(user); // Save the updated user
    }

    // Retrieve all active users
    public List<User> getActiveUsers() {
        return userRepository.findByIsActiveTrue(); // Fetch users who are active
    }

    // Retrieve all inactive users
    public List<User> getInactiveUsers() {
        return userRepository.findByIsActiveFalse(); // Fetch users who are inactive
    }
}
