import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import AuthComponent from './components/AuthComponent';
import Menu from './components/Menu';
import ProductList from './components/ProductList';
import Cart from './components/Cart';
import SignUp from './components/SignUp';
import Payment from './components/payment'; // Import the Payment component
import Orders from './components/orders'; // Import the NotificationComponent

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeLink, setActiveLink] = useState('');
  const [notification, setNotification] = useState({ message: "", type: "" });  // État pour la notification

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  const handleLinkClick = (link) => {
    setActiveLink(link);
  };

  const handlePaymentSuccess = () => {
    setNotification({
      message: "Votre paiement est effectué, votre commande est en route !",
      type: "success"
    });
  };

  const renderMenu = () => {
    if (isAuthenticated) {
      return (
        <Menu
          handleLogout={handleLogout}
          activeLink={activeLink}
          handleLinkClick={handleLinkClick}
        />
      );
    }
    return null;
  };

  return (
    <Router>
      {renderMenu()}
      
      <Routes>
        <Route path="/signUp" element={<SignUp />} />
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/products" /> : <AuthComponent onLogin={handleLogin} />}
        />
        <Route path="/menu" element={isAuthenticated ? <Navigate to="/products" /> : <Navigate to="/login" />} />
        <Route path="/products" element={<ProductList />} />
        <Route path="/cart" element={<Cart />} />
        <Route 
          path="/payment" 
          element={<Payment onPaymentSuccess={handlePaymentSuccess} />} // Pass the payment success handler
        />
        <Route path="/orders" element={<Orders />} />
          <Route path="/notif" element={<notificationComponenet />} />
        <Route path="*" element={<Navigate to={isAuthenticated ? "/menu" : "/login"} />} />
      </Routes>
    </Router>
  );
}

export default App;
