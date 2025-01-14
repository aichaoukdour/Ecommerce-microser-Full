import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import backgroundImage from '../assets/background.jpg'; // Background image
import { FaUserAlt, FaEnvelope, FaLock, FaKey, FaCamera } from 'react-icons/fa'; // Icons for inputs

function AdminSignup() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [profileImage, setProfileImage] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setErrorMessage('Les mots de passe ne correspondent pas');
            return;
        }

        const formData = new FormData();
        formData.append('username', username);
        formData.append('email', email);
        formData.append('password', password);
        if (profileImage) {
            formData.append('profileImage', profileImage);
        }

        try {
            const response = await axios.post(
                'http://localhost:8080/auth/signup',
                formData,
                { headers: { 'Content-Type': 'multipart/form-data' } }
            );

            if (response.data && response.data.message === "Inscription réussie") {
                navigate('/login'); // Naviguer vers la page de connexion
            } else {
                setErrorMessage(response.data.message || 'Erreur lors de l’inscription');
            }
        } catch (error) {
            if (error.response) {
                setErrorMessage(`Erreur lors de l’inscription : ${error.response.data.message || 'Une erreur est survenue'}`);
            } else {
                setErrorMessage('Erreur lors de l’inscription');
            }
        }
    };

    return (
        <div style={styles.signupContainer}>
            <h2 style={styles.header}>signUp</h2>
            <form onSubmit={handleSignup} style={styles.signupForm}>
                <div style={styles.formGroup}>
                    <label><FaUserAlt style={styles.icon} /></label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Username"
                        required
                        style={styles.signupInput}
                    />
                </div>
                <div style={styles.formGroup}>
                    <label><FaEnvelope style={styles.icon} /></label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                        required
                        style={styles.signupInput}
                    />
                </div>
                <div style={styles.formGroup}>
                    <label><FaLock style={styles.icon} /></label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        required
                        style={styles.signupInput}
                    />
                </div>
                <div style={styles.formGroup}>
                    <label><FaKey style={styles.icon} /></label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm Password"
                        required
                        style={styles.signupInput}
                    />
                </div>
                <div style={styles.formGroup}>
                    <label><FaCamera style={styles.icon} /></label>
                    <input
                        type="file"
                        onChange={(e) => setProfileImage(e.target.files[0])}
                        required
                        style={styles.signupInput}
                    />
                </div>
                <button type="submit" style={styles.signupButton}>signUp</button>
                {errorMessage && <p style={styles.errorMessage}>{errorMessage}</p>}
            </form>
            <p style={styles.redirectText}>
                you have an account ? <Link to="/login" style={styles.link}>signIn</Link>
            </p>
        </div>
    );
}

const styles = {
    signupContainer: {
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
    signupForm: {
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
    signupInput: {
        fontFamily: 'Times New Roman',
        width: '100%',
        padding: '12px',
        borderRadius: '10px',
        border: '1px solid #ffd800',
        fontSize: '14px',
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        position: 'relative',
    },
    signupButton: {
        width: '20%',
        padding: '12px 20px',
        backgroundColor: '#ffd800',
        color: '#000',
        marginLeft:'150px',
        border: 'none',
        borderRadius: '10px',
        cursor: 'pointer',
        fontSize: '10px',
        transition: 'all 0.3s ease',
    },
    errorMessage: {
        color: 'red',
        fontSize: '0.9em',
        marginTop: '10px',
        textAlign: 'center',
    },
    redirectText: {
        marginTop: '20px',
        textAlign: 'center',
    },
    link: {
        fontSize: '10px',
        color: '#007BFF',
        textDecoration: 'none',
    },
    icon: {
        marginRight: '10px',
        color: '#ffd800', // Gold color for icons
    },
};

export default AdminSignup;
