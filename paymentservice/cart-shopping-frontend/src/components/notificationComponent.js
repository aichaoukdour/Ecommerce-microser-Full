import React, { useState } from "react";

const NotificationPanel = () => {
    const [notifications, setNotifications] = useState([]);

    // Fonction pour ajouter une notification
    const addNotification = (message) => {
        setNotifications((prev) => [...prev, { id: Date.now(), message }]);
    };

    // Simuler l'appel API pour ajouter une notification
    const fetchNotifications = () => {
        setTimeout(() => {
            addNotification("Une commande a été payée !");
        }, 1000);
    };

    return (
        <div style={styles.panel}>
            <h3>Notifications</h3>
            <ul style={styles.list}>
                {notifications.map((notif) => (
                    <li key={notif.id} style={styles.item}>
                        {notif.message}
                    </li>
                ))}
            </ul>
            <button onClick={fetchNotifications} style={styles.addButton}>
                Charger les notifications
            </button>
        </div>
    );
};

// Définir les styles
const styles = {
    panel: {
        border: "1px solid #ddd",
        borderRadius: "5px",
        padding: "10px",
        width: "300px",
        background: "#f9f9f9",
    },
    list: {
        listStyleType: "none",
        padding: 0,
    },
    item: {
        display: "flex",
        justifyContent: "space-between",
        padding: "5px",
        marginBottom: "5px",
        background: "#e0f7fa",
        borderRadius: "4px",
    },
    addButton: {
        marginTop: "10px",
        padding: "8px",
        background: "#4caf50",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
    },
};

export default NotificationPanel;
