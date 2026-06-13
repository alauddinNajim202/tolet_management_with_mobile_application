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
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 70px)', background: 'var(--bg-color)', padding: '40px 20px'}}>
            <div style={{background: 'var(--surface-color)', padding: '40px', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', width: '100%', maxWidth: '400px'}}>
                <h2 style={{fontSize: '24px', fontWeight: 700, marginBottom: '8px', color: 'var(--text-main)'}}>Create an account</h2>
                <p style={{color: 'var(--text-muted)', marginBottom: '24px'}}>Join HomeConnect to list and manage properties.</p>
                
                {error && <div style={{background: '#f8d7da', color: '#842029', padding: '10px', borderRadius: 'var(--radius-sm)', marginBottom: '16px', fontSize: '14px'}}>{error}</div>}

                <form onSubmit={handleRegister}>
                    <div style={{marginBottom: '16px'}}>
                        <label style={{display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500}}>Full Name</label>
                        <input 
                            type="text" 
                            value={name}
                            onChange={e => setName(e.target.value)}
                            style={{width: '100%', padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', outline: 'none'}} 
                            required 
                        />
                    </div>
                    <div style={{marginBottom: '16px'}}>
                        <label style={{display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500}}>Email Address</label>
                        <input 
                            type="email" 
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            style={{width: '100%', padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', outline: 'none'}} 
                            required 
                        />
                    </div>
                    <div style={{marginBottom: '16px'}}>
                        <label style={{display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500}}>Password</label>
                        <input 
                            type="password" 
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            style={{width: '100%', padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', outline: 'none'}} 
                            required 
                        />
                    </div>
                    <div style={{marginBottom: '24px'}}>
                        <label style={{display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500}}>Confirm Password</label>
                        <input 
                            type="password" 
                            value={passwordConfirm}
                            onChange={e => setPasswordConfirm(e.target.value)}
                            style={{width: '100%', padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', outline: 'none'}} 
                            required 
                        />
                    </div>
                    <button type="submit" className="btn-primary" style={{width: '100%', padding: '12px'}} disabled={loading}>
                        {loading ? 'Signing up...' : 'Sign Up'}
                    </button>
                </form>
                
                <p style={{marginTop: '24px', textAlign: 'center', fontSize: '14px', color: 'var(--text-muted)'}}>
                    Already have an account? <Link to="/login" style={{color: 'var(--primary-blue)', textDecoration: 'none', fontWeight: 600}}>Log in</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
