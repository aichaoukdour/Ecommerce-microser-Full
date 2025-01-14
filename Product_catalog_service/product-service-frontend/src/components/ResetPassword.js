import React, { useState } from 'react';
import axios from 'axios';

function ResetPassword() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleResetPassword = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(
                'http://localhost:8080/auth/reset-password',
                null,
                {
                    params: { email },
                    headers: { 'Content-Type': 'application/json' }
                }
            );

            if (response.data.success) {
                setMessage('Un email de réinitialisation a été envoyé à votre adresse.');
            } else {
                setMessage('Erreur : ' + response.data.message);
            }
        } catch (error) {
            setMessage('Erreur lors de la réinitialisation du mot de passe : ' + error.response?.data?.message || 'Erreur inconnue');
        }
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.header}>Réinitialisation du mot de passe</h2>
            <form onSubmit={handleResetPassword} style={styles.form}>
                <input
                    type="email"
                    placeholder="Entrez votre email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={styles.input}
                />
                <button type="submit" style={styles.button}>Réinitialiser le mot de passe</button>
            </form>
            {message && <p style={styles.message}>{message}</p>}
        </div>
    );
}

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#f4d3a7',
        padding: '20px',
    },
    header: {
        marginBottom: '20px',
        color: '#333',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '10px',
    },
    input: {
        padding: '10px',
        borderRadius: '5px',
        border: '1px solid #ccc',
        width: '300px',
    },
    button: {
        padding: '10px 20px',
        borderRadius: '5px',
        border: 'none',
        backgroundColor: '#007bff',
        color: '#fff',
        cursor: 'pointer',
    },
    message: {
        marginTop: '10px',
        color: '#d9534f',
    }
};

export default ResetPassword;
