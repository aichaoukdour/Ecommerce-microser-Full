package com.example.paymentservice.controller;

import com.example.paymentservice.entities.User;
import com.example.paymentservice.service.UserService;
import com.example.paymentservice.utils.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import com.example.paymentservice.payload.JwtResponse;
import com.example.paymentservice.payload.RegisterRequest;
import com.example.paymentservice.payload.LoginRequest;

import jakarta.servlet.http.HttpServletRequest;
import java.util.Enumeration;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    // Registration Endpoint
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody RegisterRequest registerRequest) {
        try {
            User user = userService.registerUser(registerRequest.getUsername(), registerRequest.getPassword(), registerRequest.getEmail());
            return ResponseEntity.ok("User registered successfully! ID: " + user.getId());
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage()); // Handle the RuntimeException for username existence
        } catch (Exception e) {
            return ResponseEntity.status(500).body("An unexpected error occurred");
        }
    }

    // Login Endpoint
    @PostMapping("/login")
public ResponseEntity<?> loginUser(@RequestBody LoginRequest loginRequest) {
    // Log the login request details
    logger.info("Received login request for username: " + loginRequest.getUsername());

    try {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword())
        );
        
        // Extract user details and log authentication details
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String jwtToken = jwtUtil.generateToken(userDetails);
        
        // Log user details (excluding the password for security reasons)
        logger.info("Authentication successful for user: " + loginRequest.getUsername());
        
        // Log user details safely (password should not be logged)
        logger.debug("User details: Username = " + userDetails.getUsername() + ", Authorities = " + userDetails.getAuthorities());

        return ResponseEntity.ok(new JwtResponse(jwtToken));
    } catch (AuthenticationException e) {
        // Log failed authentication attempt
        logger.warn("Failed login attempt for username: " + loginRequest.getUsername());
        
logger.info("Password entered by user: " + loginRequest.getPassword());

        return ResponseEntity.status(401).body("Invalid username or password");
    }
}


    // GET Mapping to log incoming requests
    @GetMapping("/log")
    public ResponseEntity<String> logRequest(HttpServletRequest request) {
        // Log request details
        logger.info("Received GET request: " + request.getRequestURL() + "?" + request.getQueryString());
        logger.info("Request Headers: ");
        Enumeration<String> headerNames = request.getHeaderNames();
        while (headerNames.hasMoreElements()) {
            String headerName = headerNames.nextElement();
            String headerValue = request.getHeader(headerName);
            logger.info(headerName + ": " + headerValue);
        }
        return ResponseEntity.ok("Logged request");
    }
}
