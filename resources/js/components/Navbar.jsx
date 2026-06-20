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
                <Link to="/" className="logo">
                    <div style={{ background: 'var(--primary-blue)', color: 'white', padding: '4px 8px', borderRadius: '8px', fontSize: '20px' }}>🏠</div>
                    <span>HomeConnect</span>
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
                            <Link to="/dashboard" style={{color: 'var(--text-main)', textDecoration: 'none', fontWeight: 600, fontSize: '15px'}}>My Dashboard</Link>
                            <button onClick={handleLogout} className="btn-outline">Log out</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" style={{color: 'var(--text-main)', textDecoration: 'none', fontWeight: 600, fontSize: '15px'}}>Log in</Link>
                            <Link to="/register" className="btn-primary">Sign up</Link>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Navbar;
