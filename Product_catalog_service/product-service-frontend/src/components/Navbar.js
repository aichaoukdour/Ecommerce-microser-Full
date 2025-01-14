// src/components/Navbar.js

import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';  // You can create a separate CSS file for Navbar styles if needed

const Navbar = () => {
    return (
        <nav className="navbar">
            <Link to="/products">Product List</Link>
            <Link to="/add-product">Add Product</Link>
        </nav>
    );
};

export default Navbar;
