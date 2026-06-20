import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const [myProperties, setMyProperties] = useState([]);
    const [favoriteProperties, setFavoriteProperties] = useState([]);
    const [activeTab, setActiveTab] = useState('my_properties'); // my_properties or favorites
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDashboardData = async () => {
            const token = localStorage.getItem('auth_token');
            if (!token) {
                navigate('/login');
                return;
            }

            try {
                const headers = {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                };

                const [resMy, resFav] = await Promise.all([
                    fetch('/api/auth/property/my-listing', { headers }),
                    fetch('/api/auth/property/favorite/list', { headers })
                ]);

                if (resMy.status === 401 || resFav.status === 401) {
                    localStorage.removeItem('auth_token');
                    navigate('/login');
                    return;
                }

                const dataMy = await resMy.json();
                const dataFav = await resFav.json();

                if (resMy.ok && dataMy.status) {
                    setMyProperties(dataMy.data);
                } else {
                    setError(dataMy.message || 'Failed to fetch your properties.');
                }

                if (resFav.ok && dataFav.status) {
                    setFavoriteProperties(dataFav.data);
                }
            } catch (err) {
                setError('Network error. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [navigate]);

    const handleDelete = async (propertyId) => {
        if (!window.confirm('Are you sure you want to delete this property? This action cannot be undone.')) {
            return;
        }

        const token = localStorage.getItem('auth_token');
        try {
            const res = await fetch(`/api/auth/property/destroy/${propertyId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });
            const data = await res.json();
            if (res.ok && data.status) {
                // Remove from state
                setMyProperties(prev => prev.filter(p => p.id !== propertyId));
            } else {
                alert(data.message || 'Failed to delete property.');
            }
        } catch (err) {
            alert('An error occurred while deleting.');
        }
    };

    const activeProperties = activeTab === 'my_properties' ? myProperties : favoriteProperties;

    // We can reuse the toggleFavorite logic from PropertyList here if we want to allow un-favoriting from dashboard.
    // For now, we'll just show them.

    return (
        <div className="app-container" style={{ paddingTop: '40px', paddingBottom: '80px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div>
                    <h1 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-main)', marginBottom: '8px' }}>My Dashboard</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Manage the properties you have listed on HomeConnect.</p>
                </div>
                <a href="/admin/property/create" className="btn-primary" style={{ textDecoration: 'none' }}>+ Add Property</a>
            </div>

            {/* Tabs */}
            <div className="category-filters" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '24px', marginBottom: '32px' }}>
                <button
                    onClick={() => setActiveTab('my_properties')}
                    className={`filter-pill ${activeTab === 'my_properties' ? 'active' : ''}`}
                    style={{ fontSize: '16px', padding: '12px 24px' }}
                >
                    My Properties
                </button>
                <button
                    onClick={() => setActiveTab('favorites')}
                    className={`filter-pill ${activeTab === 'favorites' ? 'active' : ''}`}
                    style={{ fontSize: '16px', padding: '12px 24px' }}
                >
                    Favorite Properties ❤️
                </button>
            </div>

            {loading ? (
                <div style={{ padding: '60px 0', textAlign: 'center', color: 'var(--text-muted)' }}>Loading data...</div>
            ) : error ? (
                <div style={{ padding: '20px', background: '#fee2e2', color: '#991b1b', borderRadius: 'var(--radius-md)' }}>{error}</div>
            ) : activeProperties.length === 0 ? (
                <div style={{ background: 'var(--surface-color)', padding: '60px 20px', textAlign: 'center', borderRadius: 'var(--radius-lg)', border: '1px dashed var(--border-color)' }}>
                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>🏠</div>
                    <h3 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '8px', color: 'var(--text-main)' }}>No properties found</h3>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>
                        {activeTab === 'my_properties' ? "You haven't listed any properties." : "You haven't favorited any properties yet."}
                    </p>
                </div>
            ) : (
                <div className="property-grid">
                    {activeProperties.map(prop => {
                        let imgUrl = prop.thumbnail || "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=600";
                        if (prop.images && prop.images.length > 0 && prop.images[0].file_path) {
                            imgUrl = prop.images[0].file_path;
                        }

                        return (
                            <div style={{ textDecoration: 'none', color: 'inherit' }} key={prop.id}>
                                <div className="property-card">
                                    <div className="card-image-wrap">
                                        <span className="status-badge" style={{ background: prop.status === 'active' ? '#10b981' : '#f59e0b' }}>{prop.status}</span>
                                        <img src={imgUrl} alt={prop.title} className="card-image" />
                                    </div>
                                    <div className="card-body">
                                        <div className="card-price">৳{Number(prop.rent_amount).toLocaleString('bn-BD')} <span style={{ fontSize: '14px', color: 'var(--text-muted)', fontWeight: 500 }}>/month</span></div>
                                        <h3 className="card-title" style={{ fontSize: '16px' }}>{prop.title}</h3>

                                        {activeTab === 'my_properties' && (
                                            <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
                                                <Link to={`/user/property/edit/${prop.id}`} className="btn-primary" style={{ padding: '8px 16px', fontSize: '14px', flex: 1, textAlign: 'center', textDecoration: 'none' }}>Edit</Link>
                                                <button onClick={() => handleDelete(prop.id)} className="btn-primary" style={{ background: '#fee2e2', color: '#dc2626', padding: '8px 16px', fontSize: '14px', flex: 1, textAlign: 'center' }}>Delete</button>
                                            </div>
                                        )}
                                        {activeTab === 'favorites' && (
                                            <div style={{ marginTop: '16px' }}>
                                                <Link to={`/property/${prop.id}`} className="btn-primary" style={{ display: 'block', padding: '8px 16px', fontSize: '14px', textAlign: 'center', textDecoration: 'none' }}>View Details</Link>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default Dashboard;
