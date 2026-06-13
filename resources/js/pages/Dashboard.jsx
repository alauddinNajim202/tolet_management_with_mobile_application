import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserProperties = async () => {
            const token = localStorage.getItem('auth_token');
            if (!token) {
                navigate('/login');
                return;
            }

            try {
                const res = await fetch('/api/auth/property/list', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json'
                    }
                });
                const data = await res.json();

                if (res.ok && data.status) {
                    setProperties(data.data);
                } else if (res.status === 401) {
                    // Token expired or invalid
                    localStorage.removeItem('auth_token');
                    navigate('/login');
                } else {
                    setError(data.message || 'Failed to fetch your properties.');
                }
            } catch (err) {
                setError('Network error. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchUserProperties();
    }, [navigate]);

    return (
        <div className="app-container" style={{paddingTop: '40px', paddingBottom: '80px'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px'}}>
                <div>
                    <h1 style={{fontSize: '28px', fontWeight: 800, color: 'var(--text-main)', marginBottom: '8px'}}>My Dashboard</h1>
                    <p style={{color: 'var(--text-muted)'}}>Manage the properties you have listed on HomeConnect.</p>
                </div>
                <a href="/admin/property/create" className="btn-primary" style={{textDecoration: 'none'}}>+ Add Property</a>
            </div>

            {loading ? (
                <div style={{padding: '60px 0', textAlign: 'center', color: 'var(--text-muted)'}}>Loading your properties...</div>
            ) : error ? (
                <div style={{padding: '20px', background: '#fee2e2', color: '#991b1b', borderRadius: 'var(--radius-md)'}}>{error}</div>
            ) : properties.length === 0 ? (
                <div style={{background: 'var(--surface-color)', padding: '60px 20px', textAlign: 'center', borderRadius: 'var(--radius-lg)', border: '1px dashed var(--border-color)'}}>
                    <div style={{fontSize: '48px', marginBottom: '16px'}}>🏠</div>
                    <h3 style={{fontSize: '20px', fontWeight: 600, marginBottom: '8px', color: 'var(--text-main)'}}>No properties yet</h3>
                    <p style={{color: 'var(--text-muted)', marginBottom: '24px'}}>You haven't listed any properties. Click the button above to get started.</p>
                </div>
            ) : (
                <div className="property-grid">
                    {properties.map(prop => {
                        let imgUrl = prop.thumbnail || "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=600";
                        if (prop.images && prop.images.length > 0 && prop.images[0].file_path) {
                            imgUrl = prop.images[0].file_path;
                        }

                        return (
                            <Link to={`/property/${prop.id}`} style={{textDecoration: 'none', color: 'inherit'}} key={prop.id}>
                                <div className="property-card">
                                    <div className="card-image-wrap">
                                        <span className="status-badge" style={{background: prop.status === 'active' ? '#10b981' : '#f59e0b'}}>{prop.status}</span>
                                        <img src={imgUrl} alt={prop.title} className="card-image" />
                                    </div>
                                    <div className="card-body">
                                        <div className="card-price">৳{Number(prop.rent_amount).toLocaleString('bn-BD')} <span style={{fontSize:'14px', color:'var(--text-muted)', fontWeight:500}}>/month</span></div>
                                        <h3 className="card-title" style={{fontSize: '16px'}}>{prop.title}</h3>
                                        <div style={{display: 'flex', gap: '8px', marginTop: '16px'}}>
                                            <a href={`/admin/property/edit/${prop.id}`} className="btn-primary" style={{padding: '8px 16px', fontSize: '14px', flex: 1, textAlign: 'center', textDecoration: 'none'}}>Edit</a>
                                            <button className="btn-primary" style={{background: '#fee2e2', color: '#dc2626', padding: '8px 16px', fontSize: '14px', flex: 1, textAlign: 'center'}}>Delete</button>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default Dashboard;
