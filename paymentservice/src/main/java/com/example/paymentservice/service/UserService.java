package com.example.paymentservice.service;

import com.example.paymentservice.entities.User;
import com.example.paymentservice.repositories.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.regex.Pattern;

@Service
public class UserService {

    private static final Logger logger = LoggerFactory.getLogger(UserService.class);
    private static final Pattern EMAIL_PATTERN = Pattern.compile("^[A-Za-z0-9+_.-]+@(.+)$");

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // Enregistrement d'un nouvel utilisateur
    @Transactional
    public User registerUser(String username, String password, String email) {
        // Vérifiez si l'utilisateur existe déjà
        if (userRepository.findByUsername(username).isPresent()) {
            throw new RuntimeException("Username already exists"); // Integrated exception
        }

        // Validate email format
        if (!EMAIL_PATTERN.matcher(email).matches()) {
            throw new IllegalArgumentException("Invalid email format");
        }

        // Validate password strength (example: at least 8 characters)
        if (password.length() < 8) {
            throw new IllegalArgumentException("Password must be at least 8 characters long");
        }

        User user = new User();
        user.setUsername(username);
        user.setPassword(passwordEncoder.encode(password)); // Encoder le mot de passe
        user.setEmail(email);
        logger.info("Registering user: {}", username);
        return userRepository.save(user);
    }

    // Récupération d'un utilisateur par son nom d'utilisateur
    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    // Récupération d'un utilisateur par son ID
    public Optional<User> findById(Long userId) {
        return userRepository.findById(userId);
    }

    // Récupération de tous les utilisateurs
    public List<User> findAllUsers() {
        return userRepository.findAll();
    }

    // Suppression d'un utilisateur par son ID
    @Transactional
    public void deleteUser(Long userId) {
        logger.info("Deleting user with ID: {}", userId);
        userRepository.deleteById(userId);
    }
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
}

