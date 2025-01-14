import React, { useState, useEffect } from 'react';
import { getProductById, reduceProductQuantity } from '../services/productService';

const ProductDetail = ({ match }) => {
    const [product, setProduct] = useState(null);

    useEffect(() => {
        const fetchProduct = async () => {
            const response = await getProductById(match.params.id);
            setProduct(response.data);
        };
        fetchProduct();
    }, [match.params.id]);

    const handleReduceQuantity = async (quantity) => {
        await reduceProductQuantity(product.id, quantity);
        // Refresh product details after quantity update
    };

    if (!product) return <div>Loading...</div>;

    return (
        <div>
            <h2>{product.name}</h2>
            <p>Price: ${product.price}</p>
            <p>Quantity: {product.quantity}</p>
            <button onClick={() => handleReduceQuantity(1)}>Reduce Quantity by 1</button>
        </div>
    );
};

export default ProductDetail;
