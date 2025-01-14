package com.example.product_catalog_service.controller;

import com.example.product_catalog_service.payload.request.LoginRequest;
import com.example.product_catalog_service.service.AuthService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);
    private final AuthService authService;

    @Autowired
    public AuthController(AuthService authService) {
        this.authService = authService;
    }




    @PostMapping("/reset-password")
    public ResponseEntity<Map<String, Object>> resetPassword(@RequestParam("email") String email) {
        Map<String, Object> response = new HashMap<>();
        try {
            authService.resetPassword(email);
            response.put("success", true);
            response.put("message", "Un email de réinitialisation de mot de passe a été envoyé.");
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }@PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody LoginRequest loginRequest) {
        // Utilisez authService pour l'authentification
        boolean authenticated = authService.authenticate(loginRequest.getUsername(), loginRequest.getPassword());
    
        Map<String, Object> response = new HashMap<>();
        if (authenticated) {
            response.put("success", true);
            response.put("message", "Connexion réussie");
            return ResponseEntity.ok(response);
        } else {
            response.put("success", false);
            response.put("message", "Nom d'utilisateur ou mot de passe incorrect");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
    }
    
    @PostMapping("/signup")
    public ResponseEntity<Map<String, Object>> signup(
            @RequestParam("username") String username,
            @RequestParam("email") String email,
            @RequestParam("password") String password,
            @RequestParam(value = "profileImage", required = false) MultipartFile profileImage) {

        // Log des données reçues
        logger.info("Received signup request: username = {}, email = {}, password = {}, profileImage = {}",
                username, email, password, profileImage != null ? profileImage.getOriginalFilename() : "Aucun fichier");

        // Enregistrer l'utilisateur
        authService.registerUser(username, email, password, profileImage);

        // Retournez une réponse d'inscription réussie
        return ResponseEntity.ok(Map.of("message", "Inscription réussie"));
    }
}
