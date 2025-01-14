package com.microservice.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf().disable()  // Désactiver la protection CSRF si vous ne l'utilisez pas
            .authorizeRequests()
                .requestMatchers("/**").permitAll()  // Permettre l'accès à toutes les URL
            .anyRequest().authenticated();  // Permet tout autre accès
        return http.build();
    }
}
