package com.example.paymentservice.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // Appliquer CORS à toutes les routes
                .allowedOrigins("http://localhost:3000", "http://localhost:3001") // Autoriser uniquement le frontend
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // Autoriser ces méthodes
                .allowedHeaders("*") // Autoriser tous les en-têtes
                .allowCredentials(true); // Si vous utilisez des cookies ou des sessions
    }


        @Override
        public void addResourceHandlers(ResourceHandlerRegistry registry) {
            registry.addResourceHandler("/uploads/images/**")
                    .addResourceLocations("file:uploads/images/");
        }
    }