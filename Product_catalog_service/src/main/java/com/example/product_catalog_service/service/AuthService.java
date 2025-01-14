package com.example.product_catalog_service.service;

import com.example.product_catalog_service.entities.User;
import com.example.product_catalog_service.repositories.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;

@Service
public class AuthService {

    private static final Logger logger = LoggerFactory.getLogger(AuthService.class);

    @Value("${file.upload-dir:uploads/users/}")
    private String uploadDir;

    @Autowired
    private UserRepository userRepository;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    public boolean authenticate(String username, String password) {
        logger.info("Tentative d'authentification pour l'utilisateur : {}", username);
    
        // Recherche l'utilisateur dans la base de données par son nom d'utilisateur
        User user = userRepository.findByUsername(username);
        if (user == null) {
            logger.warn("Utilisateur non trouvé : {}", username);
            return false; // Si l'utilisateur n'est pas trouvé, on retourne false
        }
    
        // Vérification du mot de passe avec le mot de passe haché
        boolean isPasswordMatch = passwordEncoder.matches(password, user.getPassword());
        if (isPasswordMatch) {
            // Mise à jour de la date de dernière connexion
            user.setLastLogin(LocalDateTime.now());  // L'utilisateur s'est connecté, donc on met à jour `lastLogin`
            
            // Si l'utilisateur est inactif ou n'a jamais eu de connexion, on l'active automatiquement
            if (user.getLastLogin() != null && !user.getIsActive()) {
                user.setIsActive(true);  // On l'active maintenant, puisqu'il est en train de se connecter
            }
    
            // Sauvegarde de l'utilisateur avec la nouvelle date de connexion et son activation
            userRepository.save(user);
    
            logger.info("Authentification réussie pour l'utilisateur : {}", username);
        } else {
            logger.warn("Mot de passe incorrect pour l'utilisateur : {}", username);
        }
    
        return isPasswordMatch;  // Retourne vrai ou faux selon si l'authentification a réussi
    }
    


    public void registerUser(String username, String email, String password, MultipartFile profileImage) {
        // Vérifier si l'utilisateur existe déjà
        if (userRepository.existsByUsername(username)) {
            throw new IllegalArgumentException("Nom d'utilisateur déjà pris !");
        }
        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("Email déjà utilisé !");
        }

        // Sauvegarder l'image de profil si fournie
        String profileImagePath = null;
        if (profileImage != null && !profileImage.isEmpty()) {
            profileImagePath = saveProfileImage(profileImage);
        }

        User newUser = new User();
        newUser.setUsername(username);
        newUser.setEmail(email);
        newUser.setPassword(passwordEncoder.encode(password)); // Hacher le mot de passe
        newUser.setProfileImage(profileImagePath); // Chemin de l'image de profil

        try {
            userRepository.save(newUser);
        } catch (Exception e) {
            logger.error("Erreur lors de l'enregistrement de l'utilisateur : {}", e.getMessage());
            throw new RuntimeException("Erreur lors de l'enregistrement de l'utilisateur");
        }
    }

    public String saveProfileImage(MultipartFile imageFile) {
        try {
            // Créer le répertoire s'il n'existe pas
            File dir = new File(uploadDir);
            if (!dir.exists()) {
                dir.mkdirs();
            }

            // Générer un nom de fichier unique
            String fileName = System.currentTimeMillis() + "_" + imageFile.getOriginalFilename();
            Path targetLocation = dir.toPath().resolve(fileName);

            // Copier le fichier dans le répertoire cible
            Files.copy(imageFile.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);
            return targetLocation.toString(); // Retourner le chemin de l'image
        } catch (IOException ex) {
            logger.error("Erreur lors de la sauvegarde de l'image : {}", ex.getMessage());
            throw new RuntimeException("Impossible de sauvegarder l'image. Veuillez réessayer !", ex);
        }
    }




    // Cette méthode envoie un email avec un lien de réinitialisation de mot de passe
    public void resetPassword(String email) {
        User user = userRepository.findByEmail(email);

        if (user == null) {
            throw new IllegalArgumentException("Aucun utilisateur trouvé avec cet email");
        }

        // Générez un token de réinitialisation ou un nouveau mot de passe temporaire
        String newPassword = generateTemporaryPassword();

        // Mettre à jour le mot de passe de l'utilisateur
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        // Envoyer un email avec le nouveau mot de passe ou un lien de réinitialisation
        sendResetEmail(user.getEmail(), newPassword);
    }

    private String generateTemporaryPassword() {
        // Logique pour générer un mot de passe temporaire
        return "Temp1234"; // Pour des raisons de sécurité, il est recommandé d'utiliser une génération aléatoire
    }

    private void sendResetEmail(String email, String newPassword) {
        // Implémentez ici la logique pour envoyer un email à l'utilisateur
        logger.info("Email envoyé à {} avec le nouveau mot de passe : {}", email, newPassword);
    }

}


