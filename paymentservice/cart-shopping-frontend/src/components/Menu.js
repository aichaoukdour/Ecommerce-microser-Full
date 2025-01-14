import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faBoxOpen, faBars, faBell, faUserCircle, faClipboardList } from '@fortawesome/free-solid-svg-icons';
import img from '../assets/img.png';

function Menu({ handleLogout, activeLink, handleLinkClick, isAuthenticated }) {
    const [showDropdown, setShowDropdown] = useState(false);
    const navigate = useNavigate(); // Initialize useNavigate

    const handleLogoutClick = () => {
        handleLogout();
        navigate('/login'); // Redirect to login after logout
    };

    return (
        <header style={{ ...styles.header }}>
            <nav style={styles.navbar}>
                <div style={{ position: 'relative' }}>
                    <Link to="#" style={styles.menuIcon} onClick={() => setShowDropdown(prev => !prev)}>
                        <FontAwesomeIcon icon={faBars} style={styles.menuIconIcon} />
                    </Link>
                    {showDropdown && (
                        <div style={styles.dropdown}>
                            <button onClick={handleLogoutClick} style={styles.dropdownButton}>
                                Logout
                            </button>
                        </div>
                    )}
                </div>
                <div style={styles.linkContainer}>
                    <Link
                        to="/products"
                        style={{
                            ...styles.navLink,
                            ...(activeLink === 'products' ? styles.navLinkActive : {}),
                        }}
                        onClick={() => handleLinkClick('products')}
                    >
                        <FontAwesomeIcon icon={faBoxOpen} style={styles.icon} />
                        Products
                    </Link>
                    <Link
                        to="/cart"
                        style={{
                            ...styles.navLink,
                            ...(activeLink === 'cart' ? styles.navLinkActive : {}),
                        }}
                        onClick={() => handleLinkClick('cart')}
                    >
                        <FontAwesomeIcon icon={faShoppingCart} style={styles.icon} />
                        Cart
                    </Link>
                    <Link
                        to="/notifications"
                        style={{
                            ...styles.navLink,
                            ...(activeLink === 'notifications' ? styles.navLinkActive : {}),
                        }}
                        onClick={() => handleLinkClick('notifications')}
                    >
                        <FontAwesomeIcon icon={faBell} style={styles.icon} />
                        Notifications
                    </Link>
                    <Link
                        to="/orders"
                        style={{
                            ...styles.navLink,
                            ...(activeLink === 'orders' ? styles.navLinkActive : {}),
                        }}
                        onClick={() => handleLinkClick('orders')}
                    >
                        <FontAwesomeIcon icon={faClipboardList} style={styles.icon} />
                        Orders
                    </Link>
                    {isAuthenticated && (
                        <Link
                            to="/profile"
                            style={{
                                ...styles.navLink,
                                ...(activeLink === 'profile' ? styles.navLinkActive : {}),
                            }}
                            onClick={() => handleLinkClick('profile')}
                        >
                            <FontAwesomeIcon icon={faUserCircle} style={styles.icon} />
                            Profile
                        </Link>
                    )}
                </div>
            </nav>
        </header>
    );
}

const styles = {
    header: {
        backgroundSize: 'cover',
        fontFamily: 'Times New Roman',
        backgroundPosition: 'center',
        padding: '10px',
        backgroundColor: 'rgba(252, 236, 7, 0.37)',
        backdropFilter: 'blur(40px)',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '50px',
        color: 'white',
    },
    navbar: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flex: '1',
    },
    linkContainer: {
        display: 'flex',
        alignItems: 'center',
    },
    navLink: {
        color: 'black',
        textDecoration: 'none',
        fontWeight: 'bold',
        padding: '10px',
        transition: 'background-color 0.3s, transform 0.3s',
        position: 'relative',
        fontSize: '10px',
        borderRadius: '5px',
        border: '1px solid white',
        margin: '0 5px',
        display: 'inline-block',
        fontFamily: 'Times New Roman',
    },
    navLinkActive: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        transform: 'scale(1.1)',
    },
    icon: {
        marginRight: '8px',
        fontSize: '11px',
    },
    menuIcon: {
        color: 'black',
        textDecoration: 'none',
        padding: '10px',
    },
    menuIconIcon: {
        fontSize: '30px',
    },
    dropdown: {
        position: 'absolute',
        backgroundColor: 'white',
        border: '1px solid #ccc',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
        zIndex: 1000,
        fontFamily: 'Times New Roman',
        right: 0,
        marginTop: '5px',
        borderRadius: '5px',
    },
    dropdownButton: {
        padding: '10px 20px',
        border: 'none',
        backgroundColor: 'transparent',
        cursor: 'pointer',
        fontFamily: 'Times New Roman, serif',
        width: '100%',
        textAlign: 'left',
    },
};

export default Menu;
