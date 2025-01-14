# Étape 1 : Utiliser une image officielle Java compatible
FROM eclipse-temurin:22-jdk-jammy

# Étape 2 : Définir le répertoire de travail dans l'image
WORKDIR /app

# Étape 3 : Copier le fichier JAR généré par Maven dans l'image Docker
COPY target/productservice-0.0.1-SNAPSHOT.jar app.jar

# Étape 4 : Exposer le port utilisé par le microservice
EXPOSE 8080

# Étape 5 : Définir la commande pour démarrer l'application
ENTRYPOINT ["java", "-jar", "app.jar"]
