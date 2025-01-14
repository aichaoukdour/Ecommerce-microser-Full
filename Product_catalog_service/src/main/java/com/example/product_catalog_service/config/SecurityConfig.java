package com.example.product_catalog_service.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import static org.springframework.security.config.Customizer.withDefaults;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public UserDetailsService userDetailsService() {
        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        UserDetails adminUser = User.withUsername("admin")
                .password(passwordEncoder.encode("Test@1234")) // Encoder le mot de passe avec BCrypt
                .roles("ADMIN")
                .build();
        return new InMemoryUserDetailsManager(adminUser);
    }


    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(withDefaults())
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/auth/**").permitAll() // Autoriser l'accès public à /auth/login
                        .requestMatchers("/product/**").permitAll() 
                        .requestMatchers("/users/**").permitAll() // Autoriser l'accès public à /product
                        .anyRequest().authenticated() // Toutes les autres requêtes nécessitent une authentification
                )
                .httpBasic(withDefaults()); // Activer l'authentification de base HTTP
        return http.build();
    }

    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(true);
        config.addAllowedOriginPattern("http://localhost:3000"); // URL du frontend React
        config.addAllowedOriginPattern("http://localhost:3001"); // URL d'un autre frontend si nécessaire
        config.addAllowedHeader("*");
        config.addAllowedMethod("*");
        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    }


    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
