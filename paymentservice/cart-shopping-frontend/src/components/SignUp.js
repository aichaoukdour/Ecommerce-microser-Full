import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';

const SignUp = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
    });

    const [buttonHover, setButtonHover] = useState(false);
    const navigate = useNavigate();

    const styles = {
        container: {
            height: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundImage: `url(${require('../assets/background.jpg')})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
        },
        formContainer: {
            fontFamily: 'Arial, sans-serif',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(250, 245, 178, 0.3)',
            backdropFilter: 'blur(40px)',
            padding: '40px',
            borderRadius: '15px',
            boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
            width: '350px',
            maxWidth: '90%',
            zIndex: '10',
        },
        title: {
            fontSize: '18px',
            fontWeight: 'bold',
            marginBottom: '25px',
            textAlign: 'center',
            color: '#000',
        },
        inputFieldWrapper: {
            position: 'relative',
            width: '100%',
            marginBottom: '15px',
        },
        inputField: {
            fontFamily: 'Arial, sans-serif',
            width: '100%',
            padding: '12px 12px 12px 40px',
            borderRadius: '10px',
            border: '1px solid #ffd800',
            fontSize: '14px',
            backgroundColor: '#fff', // Fond blanc
            color: '#000',
        },
        icon: {
            position: 'absolute',
            top: '50%',
            left: '10px',
            transform: 'translateY(-50%)',
            color: '#ffd800',
            fontSize: '16px',
        },
        submitButton: {
            padding: '12px 20px',
            backgroundColor: '#ffd800',
            color: '#000',
            marginTop: '15px',
            border: 'none',
            borderRadius: '10px',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            width: '50%',
            marginLeft:'70px',
            fontWeight: 'bold',
            textAlign: 'center',
        },
        submitButtonHover: {
            backgroundColor: '#fff',
            color: '#ffd800',
            boxShadow: '0 0 10px #ffd800, 0 0 20px #ffd800',
        },
        link: {
            marginTop: '15px',
            color: '#007BFF',
            textDecoration: 'none',
            fontSize: '12px',
            display: 'block',
            textAlign: 'center',
        },
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8081/api/auth/register', formData);
            toast.success('User registered successfully!');
            navigate('/login');
        } catch (error) {
            toast.error('Failed to register user.');
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.formContainer}>
                <h2 style={styles.title}>Signup</h2>
                <form onSubmit={handleSignup}>
                    <div style={styles.inputFieldWrapper}>
                        <FontAwesomeIcon icon={faUser} style={styles.icon} />
                        <input
                            type="text"
                            name="username"
                            placeholder="Username"
                            value={formData.username}
                            onChange={handleInputChange}
                            style={styles.inputField}
                            required
                        />
                    </div>
                    <div style={styles.inputFieldWrapper}>
                        <FontAwesomeIcon icon={faEnvelope} style={styles.icon} />
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleInputChange}
                            style={styles.inputField}
                            required
                        />
                    </div>
                    <div style={styles.inputFieldWrapper}>
                        <FontAwesomeIcon icon={faLock} style={styles.icon} />
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleInputChange}
                            style={styles.inputField}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        style={{
                            ...styles.submitButton,
                            ...(buttonHover ? styles.submitButtonHover : {}),
                        }}
                        onMouseEnter={() => setButtonHover(true)}
                        onMouseLeave={() => setButtonHover(false)}
                    >
                        Signup
                    </button>
                </form>
                <Link to="/login" style={styles.link}>
                    Already have an account? Login here!
                </Link>
            </div>
        </div>
    );
};

export default SignUp;
