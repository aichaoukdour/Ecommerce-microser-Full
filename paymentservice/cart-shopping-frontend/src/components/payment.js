import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCreditCard } from '@fortawesome/free-solid-svg-icons';

// Import images
import visaLogo from '../assets/visa2.jpg';
import paypalLogo from '../assets/paypal.jpg';
import mastercardLogo from '../assets/mastercard.jpg';
import backgroundImage from '../assets/image.jpg'; 
import backgroundcard from '../assets/background.jpg'; 


const styles = {
    body: {
        backgroundColor: `#F5f5dc`, 
        backgroundSize: 'cover', 
        backgroundRepeat: 'no-repeat', 
        backgroundPosition: 'center',
        height: '100vh',
        width: '100vw',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: '#fff',
        borderRadius: '12px',
        padding: '40px',
        boxShadow: '0 10px 20px rgba(0, 0, 0, 0.3)',
        width: '80%',
        maxWidth: '1200px',
    },
    cardFront: {
        backgroundImage: `url(${backgroundcard})`, 
        position: 'relative',
      
        borderRadius: '15px',
        color: '#000',
        padding: '20px',
        width: '350px',
      
        height: '200px',
        boxShadow: '0 8px 15px rgba(0, 0, 0, 0.5)',
    },
    cardLogoContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '15px',
    },
    logo: {
        width: '50px',
        height: '50px',
    },
    cardNumber: {
        fontSize: '20px',
        letterSpacing: '2px',
        margin: '20px 0',
    },
    expiryAndCvv: {
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: '14px',
    },
    inputContainer: {
        marginLeft: '30px',
        width: '50%',
    },
    inputLabel: {
        fontSize: '14px',
        fontWeight: 'bold',
        marginBottom: '5px',
    },
    input: {
        width: '100%',
        padding: '10px',
        fontSize: '16px',
        marginBottom: '15px',
        border: '1px solid #ddd',
        borderRadius: '8px',
    },
    checkboxContainer: {
        display: 'flex',
        alignItems: 'center',
        margin: '15px 0',
    },
    checkbox: {
        marginRight: '10px',
    },
    payButton: {
        width: '100%',
        padding: '15px',
        fontSize: '16px',
        backgroundColor: '#28a745',
        color: '#fff',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        marginTop: '20px',
    },
};

const Payment = () => {
    const locationState = useLocation();
    const { orderId, totalPrice, paymentMode } = locationState.state || {};

    const [cardNumber, setCardNumber] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [cvv, setCvv] = useState('');
    const [isChecked, setIsChecked] = useState(false);

    const isFormValid = cardNumber && expiryDate && cvv && isChecked;

    const handlePayNow = async () => {
        const paymentData = {
            orderId: orderId,
            totalPrice: totalPrice,
            paymentMode: paymentMode,
            paymentDate: new Date().toISOString(),
        };

        try {
            const response = await fetch('http://localhost:8081/api/payment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(paymentData),
            });

            if (response.ok) {
                const responseData = await response.json();
                alert('Payment successfully processed');
            } else {
                alert('Payment failed');
            }
        } catch (error) {
            console.error('Error processing payment:', error);
            alert('An error occurred while processing the payment');
        }
    };

    return (
        <div style={styles.body}>
            <div style={styles.container}>
                {/* Card */}
                <div style={styles.cardFront}>
                    <div style={styles.cardLogoContainer}>
                        <img src={visaLogo} alt="Visa" style={styles.logo} />
                        <img src={paypalLogo} alt="PayPal" style={styles.logo} />
                        <img src={mastercardLogo} alt="MasterCard" style={styles.logo} />
                    </div>
                    <div style={styles.cardNumber}>
                        {cardNumber || '#### #### #### ####'}
                    </div>
                    <div style={styles.expiryAndCvv}>
                        <span>Expires: {expiryDate || 'MM/YY'}</span>
                        <span>CVV: {cvv || '***'}</span>
                    </div>
                </div>

                {/* Payment Form */}
                <div style={styles.inputContainer}>
                    <label style={styles.inputLabel}>Card Number</label>
                    <input
                        style={styles.input}
                        type="text"
                        placeholder="0000 0000 0000 0000"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                    />
                    <label style={styles.inputLabel}>Expiry Date</label>
                    <input
                        style={styles.input}
                        type="text"
                        placeholder="MM/YY"
                        value={expiryDate}
                        onChange={(e) => setExpiryDate(e.target.value)}
                    />
                    <label style={styles.inputLabel}>CVV</label>
                    <input
                        style={styles.input}
                        type="text"
                        placeholder="CVV"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value)}
                    />
                    <div style={styles.checkboxContainer}>
                        <input
                            type="checkbox"
                            style={styles.checkbox}
                            checked={isChecked}
                            onChange={() => setIsChecked(!isChecked)}
                        />
                        <span>I agree to the Terms of Service</span>
                    </div>
                    <button
                        style={isFormValid ? styles.payButton : { ...styles.payButton, backgroundColor: '#ccc' }}
                        disabled={!isFormValid}
                        onClick={handlePayNow}
                    >
                        Pay Now
                    </button>
                </div>
            </div>
        </div>
    );
};
 export default Payment;