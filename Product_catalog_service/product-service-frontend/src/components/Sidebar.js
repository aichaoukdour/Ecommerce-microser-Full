import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, Add, List, ExpandMore, Person, Assignment } from '@mui/icons-material'; 
import axios from 'axios'; 
import backgroundImg from '../assets/background.jpg'; 

function Sidebar() {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [username, setUsername] = useState('');
    const [userImage, setUserImage] = useState('');
    const [selectedLink, setSelectedLink] = useState(''); // Track selected link
    const navigate = useNavigate();

    useEffect(() => {
        const storedUsername = localStorage.getItem('adminUsername');
        const storedImage = localStorage.getItem('adminImage');
        if (storedUsername) {
            setUsername(storedUsername);
        }
        if (storedImage) {
            setUserImage(storedImage);
        }
    }, []);

    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    };

    const handleLogout = () => {
        localStorage.removeItem('adminUsername');
        localStorage.removeItem('adminImage');
        navigate('/');
    };

    const handleLinkClick = (link) => {
        setSelectedLink(link); // Update selected link
    };

    const sidebarStyle = {
        width: isCollapsed ? '60px' : '130px',
        padding: '20px',
        backgroundColor: 'rgb(245, 245, 227)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        boxShadow: '2px 0 5px rgba(0, 0, 0, 0.1)',
        height: '100vh',
        position: 'fixed',
        color: '#000',
        transition: 'width 0.3s',
    };

    const titleStyle = {
        marginTop: '0',
        display: isCollapsed ? 'none' : 'block',
        fontSize: "12px",
        color: '#000',
    };

    const userProfileStyle = {
        display: 'flex',
        alignItems: 'center',
        marginBottom: '20px',
    };

    const profileIconStyle = {
        fontSize: '40px',
        marginRight: isCollapsed ? '0' : '10px',
        color: '#000',
    };

    const profileImageStyle = {
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        marginRight: '10px',
        display: isCollapsed ? 'none' : 'block',
    };

    const listStyle = {
        listStyle: 'none',
        padding: '0',
    };

    const listItemStyle = {
        margin: '6px 0',
    };

    const linkStyle = (isSelected) => ({
        textDecoration: 'none',
        color: '#000',
        padding: '10px',
        display: 'flex',
        alignItems: 'center',
        fontSize: '10px',
        backgroundColor: isSelected ? 'rgba(0, 0, 0, 0.1)' : 'transparent', // Background for selected link
        borderRadius: '5px',
    });

    const iconStyle = {
        fontSize: '16px',
        color: '#000',
    };

    const logoutButtonStyle = {
        marginTop: '260px',
        padding: '10px',
        backgroundColor: '#ffd800',
        color: '#000',
        border: '1px solid #ddd',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '9px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.2)',
        transition: 'background-color 0.2s',
    };

    return (
        <div style={sidebarStyle}>
            <button onClick={toggleSidebar} style={{ marginBottom: '2px' }}>
                <ExpandMore style={iconStyle} />
            </button>
            <div style={userProfileStyle}>
                {userImage && <img src={userImage} alt="Profile" style={profileImageStyle} />}
                <Person style={profileIconStyle} />
                {!isCollapsed && <h4 style={{ margin: '0' }}>{username}</h4>}
            </div>
            <h2 style={titleStyle}>Menu</h2>

            <ul style={listStyle}>
                <li style={listItemStyle}>
                    <Link 
                        to="/dashboard" 
                        style={linkStyle(selectedLink === 'dashboard')}
                        onClick={() => handleLinkClick('dashboard')}
                    >
                        <Home style={{ ...iconStyle, marginRight: isCollapsed ? '0' : '4px' }} />
                        {!isCollapsed && ' Dashboard'}
                    </Link>
                </li>
                <li style={listItemStyle}>
                    <Link 
                        to="/add-product" 
                        style={linkStyle(selectedLink === 'add-product')}
                        onClick={() => handleLinkClick('add-product')}
                    >
                        <Add style={{ ...iconStyle, marginRight: isCollapsed ? '0' : '10px' }} />
                        {!isCollapsed && ' Add Product'}
                    </Link>
                </li>
                <li style={listItemStyle}>
                    <Link 
                        to="/product-list" 
                        style={linkStyle(selectedLink === 'product-list')}
                        onClick={() => handleLinkClick('product-list')}
                    >
                        <List style={{ ...iconStyle, marginRight: isCollapsed ? '0' : '10px' }} />
                        {!isCollapsed && ' Clients'}
                    </Link>
                </li>
                <li style={listItemStyle}>
                    <Link 
                        to="/orders" 
                        style={linkStyle(selectedLink === 'orders')}
                        onClick={() => handleLinkClick('orders')}
                    >
                        <Assignment style={{ ...iconStyle, marginRight: isCollapsed ? '0' : '10px' }} />
                        {!isCollapsed && ' Orders'}
                    </Link>
                </li>
            </ul>
            <button onClick={handleLogout} style={logoutButtonStyle}>
                {!isCollapsed && ' Log Out'}
            </button>
        </div>
    );
}

export default Sidebar;
