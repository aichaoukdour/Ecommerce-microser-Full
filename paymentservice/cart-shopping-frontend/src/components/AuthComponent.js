import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock } from '@fortawesome/free-solid-svg-icons';
import 'react-toastify/dist/ReactToastify.css';
import backgroundImage from '../assets/background.jpg'; // Lien de votre image

const styles = {
    container: {
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundImage: `url(${backgroundImage})`,
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
        fontFamily: 'Time New Roman',
        fontSize: '18px',
        fontWeight: 'bold',
        marginBottom: '25px',
        textAlign: 'center',
        color: '#000',
    },
    inputFieldWrapper: {
        position: 'relative',
        width: '100%',
        marginRight: '20px',
        marginLeft:'-25px',
        marginBottom: '15px',
    },
    inputIcon: {
        position: 'absolute',
        top: '50%',
        left: '10px',
        transform: 'translateY(-50%)',
        color: '#ffd800',
        fontSize: '18px',
    },
    inputField: {
        fontFamily: 'Arial, sans-serif',
        width: '100%',
        padding: '12px 12px 12px 40px',
        borderRadius: '10px',
        border: '1px solid #ffd800',
        fontSize: '14px',
        backgroundColor: 'rgba(255, 255, 255, 0.15)', // Fond transparent avec un effet verre
    
    },
    submitButton: {
        padding: '12px 20px',
        backgroundColor: '#ffd800',
        color: '#000',
        marginLeft:'60px',
        marginTop: '0px',
        border: 'none',
        borderRadius: '10px',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        width: '50%',
        fontWeight: 'bold',
    },
    neonEffect: {
        boxShadow: '0 0 3px #ffd800, 0 0 5px #ffd800, 0 0 10px #ffd800, 0 0 20px #ffd800',
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
        fontSize: '10px',
        display: 'block',
        textAlign: 'center',
    },
};

const AuthComponent = ({ onLogin }) => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });

    const [buttonHover, setButtonHover] = useState(false);
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8081/api/auth/login', {
                username: formData.username,
                password: formData.password
            });

            localStorage.setItem('token', response.data.token);
            localStorage.setItem('username', response.data.username);

            onLogin();
            navigate('/menu');
        } catch (error) {
            console.error('Login failed:', error.response?.data || error);
            toast.error('Invalid username or password');
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.formContainer}>
                <h2 style={styles.title}>Login</h2>
                <form onSubmit={handleLogin}>
                    <div style={styles.inputFieldWrapper}>
                        <FontAwesomeIcon icon={faUser} style={styles.inputIcon} />
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
                        <FontAwesomeIcon icon={faLock} style={styles.inputIcon} />
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
                            ...(buttonHover ? styles.submitButtonHover : styles.neonEffect),
                        }}
                        onMouseEnter={() => setButtonHover(true)}
                        onMouseLeave={() => setButtonHover(false)}
                    >
                        Login
                    </button>
                </form>
                <Link to="/signUp" style={styles.link}>Don't have an account? Sign up here!</Link>
            </div>
        </div>
    );
};

export default AuthComponent;
