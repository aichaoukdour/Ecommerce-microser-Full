import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; // Import jwtDecode for decoding the token
import { useNavigate } from 'react-router-dom';
import backgroundImg from '../assets/img.png'; // Make sure you have this image in your assets folder

const styles = {
    container: {
        fontFamily: 'Times New Roman',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        padding: '20px',
        borderRadius: '8px',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        backgroundPosition: 'center',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)',
    },
    cartList: {
        width: '100%',
        backgroundColor:'#F5f5dc',
        backdropFilter: 'blur(40px)',
        padding: '15px',
        borderRadius: '8px',
        marginRight: '20px',
    },
    cartItem: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        padding: '10px',
        marginBottom: '15px',
        backgroundColor: '#fff',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
    },
    itemDetails: {
        display: 'flex',
        alignItems: 'center',
    },
    itemImage: {
        width: '80px',
        height: '80px',
        marginRight: '10px',
        objectFit: 'cover',
        borderRadius: '8px',
    },
    itemInfo: {
        fontFamily: 'Times New Roman',
    },
    itemName: {
        fontWeight: 'bold',
        fontSize: '14px',
    },
    itemPrice: {
        fontSize: '12px',
        color: '#555',
    },
    itemTotalPrice: {
        fontSize: '12px',
        color: '#d9534f',
        textAlign: 'center',
    },
    itemQuantity: {
        fontSize: '12px',
        display: 'flex',
        alignItems: 'center',
    },
    quantityButton: {
        fontSize: '12px',
        padding: '5px 10px',
        backgroundColor: 'white',
        border: 'none',
        cursor: 'pointer',
        borderRadius: '5px',
        margin: '0 5px',
    },
    removeButton: {
        fontSize: '12px',
        padding: '5px 10px',
        backgroundColor: '#8B0000',
        border: 'none',
        color: '#fff',
        cursor: 'pointer',
        borderRadius: '5px',
    },
    total: {
        fontSize: '14px',
        fontWeight: 'bold',
        margin: '20px 0',
    },
    orderSummary: {
        width: '30%',
        padding: '20px',
        borderRadius: '8px',
        backgroundColor: '#F5f5dc',
    },
    checkoutButton: {
        fontSize: '14px',
        padding: '10px 20px',
        backgroundColor: ' #ffd800',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        width: '100%',
        marginTop: '20px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    },
    paymentMethod: {
        fontSize: '14px',
        margin: '10px 0',
    },
    paymentSelect: {
        padding: '10px',
        width: '100%',
        fontSize: '14px',
        borderRadius: '5px',
        border: '1px solid #ccc',
        margin: '10px 0',
    },
    error: {
        color: 'red',
        fontWeight: 'bold',
        margin: '10px 0',
    },
    loading: {
        fontSize: '12px',
    },
};

const Cart = () => {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [username, setUsername] = useState('');
    const [paymentMode, setPaymentMode] = useState('Credit Card'); // Default payment method

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                setUsername(decodedToken.sub.trim());
            } catch (error) {
                setError('Failed to decode token.');
                setLoading(false);
            }
        } else {
            setError('Token is missing.');
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (!username) {
            setError('Username is required to fetch cart items.');
            setLoading(false);
            return;
        }

        const fetchCartItems = async () => {
            try {
                const url = `http://localhost:8081/api/cart/user/${username}`;
                const response = await axios.get(url);
                if (Array.isArray(response.data)) {
                    setCartItems(response.data);
                } else {
                    setError('Unexpected data format.');
                }
            } catch (error) {
                setError('Failed to fetch cart items. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchCartItems();
    }, [username]);

    useEffect(() => {
        const totalAmount = cartItems.reduce(
            (acc, item) => acc + (item.price || 0) * (item.quantity || 0),
            0
        );
        setTotal(totalAmount);
    }, [cartItems]);

    const checkProductAvailability = async (productId) => {
        try {
            const response = await axios.get(`http://localhost:8080/product/${productId}/quantity`);
            return response.data;
        } catch (error) {
            console.error("Erreur lors de la récupération de la quantité du produit:", error);
            return 0;
        }
    };

    const updateCartItemQuantity = async (productId, newQuantity) => {
        if (newQuantity < 1) return;
    
        try {
            const availableQuantity = await checkProductAvailability(productId);
    
            if (newQuantity > availableQuantity) {
                setError('La quantité demandée dépasse la quantité disponible.');
                return;
            }
    
            const url = `http://localhost:8081/api/cart/user/${username}/item/${productId}`;
            await axios.put(url, { quantity: newQuantity });
    
            setCartItems(prevItems =>
                prevItems.map(item =>
                    item.productId === productId ? { ...item, quantity: newQuantity } : item
                )
            );
        } catch (error) {
            setError('Échec de la mise à jour de la quantité. Veuillez réessayer.');
        }
    };
    


    const removeFromCart = async (productId) => {
        try {
            const url = `http://localhost:8081/api/cart/user/${username}/item/${productId}`;
            await axios.delete(url);
            setCartItems(prevItems => prevItems.filter(item => item.productId !== productId));
        } catch (error) {
            setError('Failed to remove item from cart. Please try again.');
        }
    };
    
    const handleProceedToPayment = async () => {
        // Check if there are any items in the cart before proceeding
        if (cartItems.length === 0) {
            setError('Your cart is empty. Please add items to your cart.');
            return;
        }
        
            // Préparer les données pour la requête
            const orderData = {
                username: username,
                paymentMode: paymentMode,
                totalAmount: total,
            };
        
            console.log('Order Data:', orderData);
        
            try {
                // Requête POST pour créer la commande
                const response = await axios.post(
                    `http://localhost:8081/api/cart/create-order/${username}?paymentMode=${paymentMode}&totalAmount=${total}`
                );
        
                if (response.status === 201) {
                    const orderResponse = response.data;
                    console.log('Order Response:', orderResponse);
        
                    // Naviguer vers la page de paiement avec les données de la commande
                    navigate('/payment', { state: orderResponse });

                } else {
                    setError('Failed to create order. Please try again.');
                }
            } catch (error) {
                setError('An error occurred while processing your order. Please try again.');
                console.error('Error while creating order:', error);
            }
        };
        
    
    return (
        <div style={styles.container}>
            <div style={styles.cartList}>
                <h2>Your Shopping Cart</h2>
                {error && <p style={styles.error}>{error}</p>}
                {loading ? (
                    <p style={styles.loading}>Loading...</p>
                ) : cartItems.length > 0 ? (
                    cartItems.map((item) => (
                        <div key={item.productId} style={styles.cartItem}>
                            <div style={styles.itemDetails}>
                                <img
                                    src={`http://localhost:8080/${item.imagePath}`}
                                    alt={item.productName}
                                    style={styles.itemImage}
                                    onError={(e) => { e.target.onerror = null; e.target.src = 'default-image-path.jpg'; }}
                                />
                                <div style={styles.itemInfo}>
                                    <p style={styles.itemName}>{item.productName}</p>
                                    <p style={styles.itemPrice}>Price: ${item.price}</p>
                                    <p style={styles.itemTotalPrice}>
                                        Total: ${(item.price * item.quantity).toFixed(2)}
                                    </p>
                                </div>
                            </div>
                            <div style={styles.itemQuantity}>
                                <button
                                    style={styles.quantityButton}
                                    onClick={() => updateCartItemQuantity(item.productId, item.quantity - 1)}
                                    disabled={item.quantity <= 1}
                                >
                                    -
                                </button>
                                <p>{item.quantity}</p>
                                <button
                                    style={styles.quantityButton}
                                    onClick={() => updateCartItemQuantity(item.productId, item.quantity + 1)}
                                >
                                    +
                                </button>
                            </div>
                            <button
                                style={styles.removeButton}
                                onClick={() => removeFromCart(item.productId)}
                            >
                                Remove
                            </button>
                        </div>
                    ))
                ) : (
                    <p>Your cart is empty.</p>
                )}
            </div>
            <div style={styles.orderSummary}>
                <p style={styles.total}>Total: ${total.toFixed(2)}</p>
                <div style={styles.paymentMethod}>
                    <label htmlFor="paymentMode">Select Payment Method:</label>
                    <select
                        id="paymentMode"
                        value={paymentMode}
                        onChange={(e) => setPaymentMode(e.target.value)}
                        style={styles.paymentSelect}
                    >
                        <option value="GOOGLE_PAY">GOOGLE_PAY</option>
                        <option value="PAYPAL">PAYPAL</option>
                        <option value="CREDIT_CARD">CREDIT_CARD</option>
                    </select>
                </div>
                <button style={styles.checkoutButton} onClick={handleProceedToPayment}>
                    Proceed to Payment
                </button>
            </div>
        </div>
    );
};

export default Cart;
