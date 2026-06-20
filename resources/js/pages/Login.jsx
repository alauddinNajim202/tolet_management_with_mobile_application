import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        
        try {
            const res = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();
            if (res.ok && (data.success || data.status)) {
                const token = data.token || data.data?.token;
                if (token) localStorage.setItem('auth_token', token);
                navigate('/dashboard');
            } else {
                setError(data.message || 'Login failed. Please check your credentials.');
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
                <img src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=1200" alt="Login Background" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(to right, rgba(15,23,42,0.8), rgba(15,23,42,0.2))' }}></div>
                <div style={{ position: 'absolute', bottom: '10%', left: '10%', right: '10%', color: 'white' }}>
                    <h2 style={{ fontSize: '36px', fontWeight: 800, marginBottom: '16px', lineHeight: 1.2 }}>Welcome Back to<br/>Your <span style={{ color: '#38bdf8' }}>Dream Space</span></h2>
                    <p style={{ fontSize: '18px', opacity: 0.9 }}>Log in to access your dashboard, manage your properties, and connect with potential buyers and tenants seamlessly.</p>
                </div>
            </div>

            {/* Right Column (Form) */}
            <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '40px 20px' }}>
                <div style={{ width: '100%', maxWidth: '440px', background: 'var(--surface-color)', padding: '48px', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-lg)' }}>
                    <h2 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '8px', color: 'var(--text-main)', letterSpacing: '-0.5px' }}>Welcome back</h2>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '32px', fontSize: '15px' }}>Please enter your details to sign in.</p>
                    
                    {error && <div style={{ background: '#fee2e2', color: '#b91c1c', padding: '12px 16px', borderRadius: 'var(--radius-sm)', marginBottom: '24px', fontSize: '14px', fontWeight: 500 }}>{error}</div>}

                    <form onSubmit={handleLogin}>
                        <div className="form-group">
                            <label>Email Address</label>
                            <input 
                                type="email" 
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                required 
                            />
                        </div>
                        <div className="form-group" style={{ marginBottom: '32px' }}>
                            <label>Password</label>
                            <input 
                                type="password" 
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required 
                            />
                        </div>
                        <button type="submit" className="btn-primary" style={{ width: '100%', padding: '14px', fontSize: '16px' }} disabled={loading}>
                            {loading ? 'Logging in...' : 'Sign In'}
                        </button>
                    </form>
                    
                    <p style={{ marginTop: '32px', textAlign: 'center', fontSize: '15px', color: 'var(--text-muted)' }}>
                        Don't have an account? <Link to="/register" style={{ color: 'var(--primary-blue)', textDecoration: 'none', fontWeight: 700 }}>Sign up</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
