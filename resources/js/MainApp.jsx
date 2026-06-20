import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PropertyList from './components/PropertyList';
import Login from './pages/Login';
import Register from './pages/Register';
import PropertyDetails from './pages/PropertyDetails';
import Dashboard from './pages/Dashboard';

import PropertyEdit from './pages/PropertyEdit';

const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
        return <Navigate to="/login" replace />;
    }
    return children;
};

const MainApp = () => {
    return (
        <BrowserRouter>
            <div className="property-saas-app" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                <Navbar />
                <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <Routes>
                        <Route path="/" element={<PropertyList />} />
                        <Route path="/property/:id" element={<PropertyDetails />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/dashboard" element={
                            <ProtectedRoute>
                                <Dashboard />
                            </ProtectedRoute>
                        } />
                        <Route path="/user/property/edit/:id" element={
                            <ProtectedRoute>
                                <PropertyEdit />
                            </ProtectedRoute>
                        } />
                    </Routes>
                </main>
                <Footer />
            </div>
        </BrowserRouter>
    );
};

export default MainApp;
