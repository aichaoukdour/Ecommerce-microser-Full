package com.example.product_catalog_service.payload.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class ProductRequest {

    @NotBlank(message = "Le nom du produit ne peut pas être vide")
    @Size(min = 2, max = 100, message = "Le nom du produit doit contenir entre 2 et 100 caractères")
    private String name;

    @NotNull(message = "Le prix du produit est requis")
    @Min(value = 0, message = "Le prix du produit doit être positif")
    private Double price;

    @NotNull(message = "La quantité du produit est requise")
    @Min(value = 1, message = "La quantité du produit doit être au moins de 1")
    private Integer quantity;

    // Nouveau champ pour uploader une image
    private MultipartFile image;

    // Nouveau champ pour la catégorie
    @NotBlank(message = "La catégorie ne peut pas être vide")
    @Size(min = 2, max = 50, message = "La catégorie doit contenir entre 2 et 50 caractères")
    private String category;

    // Nouveau champ pour la description
    @Size(max = 255, message = "La description ne peut pas dépasser 255 caractères")
    private String description;
}
