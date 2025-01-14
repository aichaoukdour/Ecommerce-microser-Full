import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import AdminLogin from './components/AdminLogin';
import AddProduct from './components/AddProduct';
import ProductList from './components/ProductList';
import ProductDetail from './components/ProductDetail';
import Sidebar from './components/Sidebar';
import './App.css';
import Signup from './components/AdminSignup'; // Importer le composant d'inscription
import ResetPassword from './components/ResetPassword'; // Importer le composant de réinitialisation de mot de passe
import Orders from './components/orders'; // Ensure correct import

function App() {
    const username = localStorage.getItem('adminUsername');

    return (
        <Router>
            <Routes>
                {/* La route de connexion est accessible à tous */}
                <Route path="/" element={<AdminLogin />} />

                {/* Ajout de la route pour l'inscription */}
                <Route path="/signup" element={<Signup />} />

                {/* Ajout de la route pour la réinitialisation du mot de passe */}
                <Route path="/reset-password" element={<ResetPassword />} />

                {/* Routes protégées qui nécessitent une authentification */}
                <Route path="/dashboard" element={username ? (
                    <div style={{ display: 'flex', height: '100vh' }}>
                        <Sidebar />
                        <div style={{ padding: '20px', flex: 1, marginLeft: '250px' }}>
                            <Dashboard />
                        </div>
                    </div>
                ) : <Navigate to="/" />} />
                
                <Route path="/orders" element={username ? (
                    <div style={{ display: 'flex', height: '100vh' }}>
                        <Sidebar />
                        <div style={{ padding: '20px', flex: 1, marginLeft: '250px' }}>
                            <Orders />
                        </div>
                    </div>
                ) : <Navigate to="/" />} />

                <Route path="/add-product" element={username ? (
                    <div style={{ display: 'flex', height: '100vh' }}>
                        <Sidebar />
                        <div style={{ padding: '0px', flex: 1, marginLeft: '174px' }}>
                            <AddProduct />
                        </div>
                    </div>
                ) : <Navigate to="/" />} />

                <Route path="/product-list" element={username ? (
                    <div style={{ display: 'flex', height: '100vh' }}>
                        <Sidebar />
                        <div style={{ padding: '10px', flex: 1, marginLeft: '250px' }}>
                            <ProductList />
                        </div>
                    </div>
                ) : <Navigate to="/" />} />

                <Route path="/product-detail/:id" element={username ? (
                    <div style={{ display: 'flex', height: '100vh' }}>
                        <Sidebar />
                        <div style={{ padding: '20px', flex: 1, marginLeft: '250px' }}>
                            <ProductDetail />
                        </div>
                    </div>
                ) : <Navigate to="/" />} />

                {/* Rediriger vers la page de connexion pour toute route inconnue */}
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </Router>
    );
}

export default App;
