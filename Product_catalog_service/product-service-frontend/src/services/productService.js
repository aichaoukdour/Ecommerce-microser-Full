// src/services/productService.js

import axios from 'axios';

const API_BASE_URL = "http://localhost:8080";  // URL de base de l'API backend

// Crée une instance Axios pour configurer les headers ou d'autres options
const api = axios.create({
    baseURL: API_BASE_URL,
});

// Add Product
export const addProduct = async (productData) => {
    try {
        const response = await api.post('/product', productData); // Adjusted to include '/product'
        return response.data;
    } catch (error) {
        console.error("Error adding product:", error);
        throw error.response ? error.response.data : "Network error";
    }
};

// Get product by ID
export const getProductById = async (productId) => {
    try {
        const response = await api.get(`/product/${productId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching product by ID:", error);
        throw error.response ? error.response.data : "Network error";
    }
};

// Get all products
export const getAllProducts = async () => {
    try {
        const response = await api.get('/product');
        return response.data;
    } catch (error) {
        console.error("Error fetching all products:", error);
        throw error.response ? error.response.data : "Network error";
    }
};

// Get total products
export const getTotalProducts = async () => {
    try {
        const response = await api.get('/products/count'); // Ensure this endpoint exists in your backend
        return response.data.count; // Adjust according to your backend response structure
    } catch (error) {
        console.error("Error fetching total products:", error);
        throw error.response ? error.response.data : "Network error";
    }
};

// Get total orders
export const getTotalOrders = async () => {
    try {
        const response = await api.get('/orders/count'); // Ensure this endpoint exists in your backend
        return response.data.count; // Adjust according to your backend response structure
    } catch (error) {
        console.error("Error fetching total orders:", error);
        throw error.response ? error.response.data : "Network error";
    }
};

// Reduce product quantity
export const reduceProductQuantity = async (productId, quantity) => {
    try {
        const response = await api.put(`/reduceQuantity/${productId}?quantity=${quantity}`);
        return response.data;
    } catch (error) {
        console.error("Error reducing product quantity:", error);
        throw error.response ? error.response.data : "Network error";
    }
};

// Delete product
export const deleteProduct = async (productId) => {
    try {
        const response = await api.delete(`/product/${productId}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting product:", error);
        throw error.response ? error.response.data : "Network error";
    }
};

// Update product
export const updateProduct = async (productId, updatedProduct) => {
    try {
        const response = await api.put(`/product/${productId}`, updatedProduct);
        return response.data;
    } catch (error) {
        console.error(`Error updating product with ID ${productId}`, error);
        throw error;
    }
};
