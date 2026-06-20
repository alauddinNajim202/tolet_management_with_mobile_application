import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        
        if (password !== passwordConfirm) {
            setError("Passwords do not match!");
            return;
        }

        setLoading(true);
        setError('');
        
        try {
            const res = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify({ name, email, password, password_confirmation: passwordConfirm })
            });
            const data = await res.json();
            
            if (res.ok && (data.success || data.status)) {
                // Auto-login to get the token since register API only returns the user
                try {
                    const loginRes = await fetch('/api/login', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                        body: JSON.stringify({ email, password })
                    });
                    const loginData = await loginRes.json();
                    
                    if (loginRes.ok && (loginData.success || loginData.status)) {
                        const token = loginData.token || loginData.data?.token;
                        if (token) localStorage.setItem('auth_token', token);
                        navigate('/dashboard');
                    } else {
                        navigate('/login');
                    }
                } catch (err) {
                    navigate('/login');
                }
            } else {
                setError(data.message || 'Registration failed. Please check your inputs.');
            }
        } catch (err) {
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ display: 'flex', minHeight: 'calc(100vh - 80px)', background: 'var(--bg-color)' }}>
            {/* Left Column (Image) */}
            <div style={{ flex: 1, display: 'none', '@media (minWidth: 768px)': { display: 'block' }, position: 'relative', overflow: 'hidden' }}>
                <img src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=1200" alt="Register Background" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(to right, rgba(15,23,42,0.85), rgba(15,23,42,0.3))' }}></div>
                <div style={{ position: 'absolute', bottom: '10%', left: '10%', right: '10%', color: 'white' }}>
                    <h2 style={{ fontSize: '36px', fontWeight: 800, marginBottom: '16px', lineHeight: 1.2 }}>Join the <span style={{ color: '#38bdf8' }}>Community</span></h2>
                    <p style={{ fontSize: '18px', opacity: 0.9 }}>Create an account to list your properties, find tenants, and connect with trusted agencies on HomeConnect.</p>
                </div>
            </div>

            {/* Right Column (Form) */}
            <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '40px 20px' }}>
                <div style={{ width: '100%', maxWidth: '440px', background: 'var(--surface-color)', padding: '48px', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-lg)' }}>
                    <h2 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '8px', color: 'var(--text-main)', letterSpacing: '-0.5px' }}>Create an account</h2>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '32px', fontSize: '15px' }}>Let's get started with your 30-day free trial.</p>
                    
                    {error && <div style={{ background: '#fee2e2', color: '#b91c1c', padding: '12px 16px', borderRadius: 'var(--radius-sm)', marginBottom: '24px', fontSize: '14px', fontWeight: 500 }}>{error}</div>}

                    <form onSubmit={handleRegister}>
                        <div className="form-group">
                            <label>Full Name</label>
                            <input 
                                type="text" 
                                value={name}
                                onChange={e => setName(e.target.value)}
                                placeholder="John Doe"
                                required 
                            />
                        </div>
                        <div className="form-group">
                            <label>Email Address</label>
                            <input 
                                type="email" 
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder="john@example.com"
                                required 
                            />
                        </div>
                        <div className="form-group">
                            <label>Password</label>
                            <input 
                                type="password" 
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required 
                            />
                        </div>
                        <div className="form-group" style={{ marginBottom: '32px' }}>
                            <label>Confirm Password</label>
                            <input 
                                type="password" 
                                value={passwordConfirm}
                                onChange={e => setPasswordConfirm(e.target.value)}
                                placeholder="••••••••"
                                required 
                            />
                        </div>
                        <button type="submit" className="btn-primary" style={{ width: '100%', padding: '14px', fontSize: '16px' }} disabled={loading}>
                            {loading ? 'Creating account...' : 'Create Account'}
                        </button>
                    </form>
                    
                    <p style={{ marginTop: '32px', textAlign: 'center', fontSize: '15px', color: 'var(--text-muted)' }}>
                        Already have an account? <Link to="/login" style={{ color: 'var(--primary-blue)', textDecoration: 'none', fontWeight: 700 }}>Log in</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
