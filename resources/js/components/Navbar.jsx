import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        setIsAuthenticated(!!localStorage.getItem('auth_token'));
    }, [location]);

    const handleLogout = () => {
        localStorage.removeItem('auth_token');
        setIsAuthenticated(false);
        navigate('/login');
    };

    return (
        <header className="navbar">
            <div className="app-container navbar-content">
                <Link to="/" className="logo" style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                    <img src="/images/logo.png" alt="HomeConnect Logo" style={{height: '48px', width: 'auto'}} />
                    <span style={{fontSize: '26px', fontWeight: '800', letterSpacing: '-0.5px'}}>HomeConnect</span>
                </Link>
                <nav className="nav-links">
                    <Link to="/">Home</Link>
                    <Link to="/">Properties</Link>
                    <Link to="/">Agencies</Link>
                    <Link to="/">Contact</Link>
                </nav>
                <div style={{display: 'flex', gap: '16px', alignItems: 'center'}}>
                    {isAuthenticated ? (
                        <>
                            <Link to="/dashboard" style={{color: 'var(--text-main)', textDecoration: 'none', fontWeight: 600, fontSize: '14px'}}>My Dashboard</Link>
                            <button onClick={handleLogout} className="btn-primary" style={{background: '#f1f5f9', color: '#334155', padding: '8px 16px', fontSize: '14px'}}>Log out</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" style={{color: 'var(--text-main)', textDecoration: 'none', fontWeight: 500, fontSize: '14px'}}>Log in</Link>
                            <Link to="/register" className="btn-primary" style={{padding: '8px 16px', fontSize: '14px'}}>Sign up</Link>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Navbar;
