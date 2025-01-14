import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaUser, FaLock, FaSignInAlt } from 'react-icons/fa'; // Importing the icons
import backgroundImage from '../assets/background.jpg'; // Background image

function AdminLogin() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!username || !password) {
            setErrorMessage("Le nom d'utilisateur et le mot de passe sont obligatoires");
            return;
        }

        try {
            const response = await axios.post(
                'http://localhost:8080/auth/login',
                { username, password },
                { withCredentials: true, headers: { 'Content-Type': 'application/json' } }
            );

            console.log('Réponse du serveur:', response.data);

            if (response.status === 200 && response.data.success) {
                localStorage.setItem('adminUsername', username);
                navigate('/dashboard'); // Redirection vers le tableau de bord
            } else {
                setErrorMessage("Nom d'utilisateur ou mot de passe incorrect");
            }
        } catch (error) {
            console.error('Erreur lors de la tentative de connexion:', error);
            setErrorMessage(error.response?.data?.message || 'Erreur lors de la connexion');
        }
    };

    return (
        <div style={styles.loginContainer}>
            <h2 style={styles.header}>Admin</h2>
            <form onSubmit={handleLogin} style={styles.loginForm}>
                <div style={styles.formGroup}>
                    <label> </label>
                    <div style={styles.inputContainer}>
                        <FaUser style={{ ...styles.icon, color: '#ffd800' }} />
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            placeholder="Nom d'utilisateur"
                            style={styles.loginInput}
                        />
                    </div>
                </div>
                <div style={styles.formGroup}>
                    <label></label>
                    <div style={styles.inputContainer}>
                        <FaLock style={{ ...styles.icon, color: '#ffd800' }} />
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="Mot de passe"
                            style={styles.loginInput}
                        />
                    </div>
                </div>
                <button type="submit" style={styles.loginButton}>
                    <FaSignInAlt style={styles.buttonIcon} /> Se connecter
                </button>
                {errorMessage && <p style={styles.errorMessage}>{errorMessage}</p>}
            </form>
            <div style={styles.linksContainer}>
                <p style={styles.redirectText}>
                    no account ? <Link to="/signup" style={styles.link}>signUp</Link>
                </p>
                <p style={styles.redirectText}>
                    <Link to="/reset-password" style={styles.link}>Mot de passe oublié ?</Link>
                </p>
            </div>
        </div>
    );
}

const styles = {
    loginContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        padding: '20px',
    },
    header: {
        fontFamily: 'Times New Roman, serif',
        fontSize: '24px',
        fontWeight: 'bold',
        marginBottom: '20px',
        color: '#000',
    },
    loginForm: {
        backgroundColor: 'rgba(250, 245, 178, 0.3)',
        backdropFilter: 'blur(40px)',
        padding: '40px',
        borderRadius: '15px',
        boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
        width: '350px',
        maxWidth: '90%',
        zIndex: '10',
    },
    formGroup: {
        marginBottom: '15px',
    },
    inputContainer: {
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
    },
    icon: {
        position: 'absolute',
        left: '10px',
        fontSize: '18px',
       
    },
    loginInput: {
        fontFamily: 'Times New Roman',
        width: '80%',
        padding: '12px 12px 12px 40px',
        borderRadius: '10px',
        border: '1px solid #ffd800',
        fontSize: '14px',
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        position: 'relative',
    },
    loginButton: {
        width: '40%',
        padding: '12px 20px',
        backgroundColor: '#ffd800',
        color: '#000',
        border: 'none',
        borderRadius: '10px',
        cursor: 'pointer',
        fontSize: '10px',
        transition: 'all 0.3s ease',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft:'100px',
    },
    buttonIcon: {
        marginRight: '8px',
    },
    errorMessage: {
        color: 'red',
        fontSize: '0.9em',
        marginTop: '10px',
        textAlign: 'center',
    },
    linksContainer: {
        marginTop: '20px',
        textAlign: 'center',
    },
    redirectText: {
        marginBottom: '10px',
    },
    link: {
        fontSize: '10px',
        color: '#007BFF',
        textDecoration: 'none',
    },
};

export default AdminLogin;
