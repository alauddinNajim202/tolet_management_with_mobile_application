import React from 'react';

const Footer = () => {
    return (
        <footer className="f-footer">
            <h2>Ready to rent or list?</h2>
            <p style={{marginBottom: '40px'}}>Join thousands of users finding their perfect homes today.</p>
            <a href="/admin/dashboard" className="f-hero-btn primary">Get Started Now</a>
            
            <div style={{marginTop: '80px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #e5e5e5', paddingTop: '40px', fontSize: '14px', color: '#8c8c8c'}}>
                <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                    <span className="f-nav-logo-icon" style={{width: '20px', height: '20px'}}></span>
                    <span style={{fontWeight: 600, color: '#1e1e1e'}}>Saas To-Let</span>
                </div>
                <div>
                    &copy; {new Date().getFullYear()} Saas To-Let Inc. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
