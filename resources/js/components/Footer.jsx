import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer style={{ background: '#0f172a', color: '#f8fafc', paddingTop: '80px', paddingBottom: '40px', marginTop: 'auto' }}>
            <div className="app-container">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '40px', marginBottom: '60px' }}>
                    
                    {/* Brand Section */}
                    <div>
                        <div style={{ fontSize: '28px', fontWeight: 800, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={{ color: '#0ea5e9' }}>HomeConnect</span>
                        </div>
                        <p style={{ color: '#94a3b8', lineHeight: 1.8, marginBottom: '24px' }}>
                            The most trusted platform to find your next home. We connect property owners with verified tenants across the country.
                        </p>
                        <div style={{ display: 'flex', gap: '16px' }}>
                            {/* Social Icons Placeholder */}
                            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#1e293b', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>FB</div>
                            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#1e293b', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>TW</div>
                            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#1e293b', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>IN</div>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '24px' }}>Quick Links</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <Link to="/" style={{ color: '#94a3b8', textDecoration: 'none' }}>Home</Link>
                            <Link to="/" style={{ color: '#94a3b8', textDecoration: 'none' }}>Properties</Link>
                            <Link to="/" style={{ color: '#94a3b8', textDecoration: 'none' }}>Agencies</Link>
                            <Link to="/" style={{ color: '#94a3b8', textDecoration: 'none' }}>About Us</Link>
                        </div>
                    </div>

                    {/* Support */}
                    <div>
                        <h4 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '24px' }}>Support</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <Link to="/" style={{ color: '#94a3b8', textDecoration: 'none' }}>Help Center</Link>
                            <Link to="/" style={{ color: '#94a3b8', textDecoration: 'none' }}>Terms of Service</Link>
                            <Link to="/" style={{ color: '#94a3b8', textDecoration: 'none' }}>Privacy Policy</Link>
                            <Link to="/" style={{ color: '#94a3b8', textDecoration: 'none' }}>Contact Support</Link>
                        </div>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '24px' }}>Contact Us</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', color: '#94a3b8' }}>
                            <div>📍 123 Property Avenue, Dhaka</div>
                            <div>📞 +880 1700 000 000</div>
                            <div>✉️ support@homeconnect.com</div>
                        </div>
                    </div>

                </div>

                <div style={{ borderTop: '1px solid #1e293b', paddingTop: '32px', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', color: '#64748b', fontSize: '14px' }}>
                    <div>&copy; {new Date().getFullYear()} HomeConnect. All rights reserved.</div>
                    <div>Designed with premium quality.</div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
