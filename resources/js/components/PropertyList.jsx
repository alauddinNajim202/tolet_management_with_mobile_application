import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const categories = ["All", "Apartment", "House", "Commercial", "Sublet", "Hostel"];

const PropertyList = () => {
    const [activeCat, setActiveCat] = useState("All");
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');

    const fetchProperties = async () => {
        setLoading(true);
        try {
            // Build query based on category
            let url = '/api/property/list';
            
            const token = localStorage.getItem('auth_token');
            const headers = { 'Accept': 'application/json' };
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const res = await fetch(url, { headers });
            const data = await res.json();

            if (res.ok && data.status) {
                setProperties(data.data);
            } else {
                setError('Failed to fetch properties.');
            }
        } catch (err) {
            setError('Network error.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProperties();
    }, []);

    const toggleFavorite = async (e, propertyId) => {
        e.preventDefault();
        
        const token = localStorage.getItem('auth_token');
        if (!token) {
            alert('অনুগ্রহ করে লগইন করুন (Please log in to add favorites).');
            return;
        }

        try {
            const res = await fetch(`/api/auth/property/favorite`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ property_id: propertyId })
            });
            const data = await res.json();
            if (res.ok) {
                // Update local state
                setProperties(properties.map(p => {
                    if (p.id === propertyId) {
                        return { ...p, is_favorited: data.data.is_favorited };
                    }
                    return p;
                }));
            } else {
                alert(data.message || 'Error toggling favorite');
            }
        } catch (err) {
            console.error(err);
        }
    };

    // Local filtering by category and search term
    const filteredProperties = properties.filter(prop => {
        const matchesCategory = activeCat === 'All' || (prop.category && prop.category.name === activeCat);
        const matchesSearch = prop.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (prop.address && prop.address.toLowerCase().includes(searchTerm.toLowerCase()));
        
        const price = Number(prop.rent_amount);
        const matchesMinPrice = minPrice === '' || price >= Number(minPrice);
        const matchesMaxPrice = maxPrice === '' || price <= Number(maxPrice);

        return matchesCategory && matchesSearch && matchesMinPrice && matchesMaxPrice;
    });

    return (
        <div style={{ width: '100%' }}>
            {/* Stunning Hero Section */}
            <div style={{
                width: '100%',
                height: '500px',
                background: 'linear-gradient(rgba(15, 23, 42, 0.7), rgba(15, 23, 42, 0.7)), url("https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=2000")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0 20px',
                textAlign: 'center',
                color: 'white'
            }}>
                <h1 style={{ fontSize: '48px', fontWeight: 800, marginBottom: '20px', letterSpacing: '-1px', maxWidth: '800px', lineHeight: 1.2 }}>
                    Discover Your Perfect <span style={{ color: '#38bdf8' }}>Dream Home</span>
                </h1>
                <p style={{ fontSize: '18px', color: '#e2e8f0', marginBottom: '40px', maxWidth: '600px' }}>
                    Browse thousands of verified properties tailored to your lifestyle. Find apartments, houses, and commercial spaces with ease.
                </p>

                {/* Floating Search Bar */}
                <div style={{
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)',
                    padding: '8px 8px 8px 24px',
                    borderRadius: '100px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    width: '100%',
                    maxWidth: '850px',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
                }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                    <input
                        type="text"
                        placeholder="Search by location, neighborhood, or property title..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ flex: 1, border: 'none', background: 'transparent', outline: 'none', fontSize: '16px', color: '#0f172a' }}
                    />
                    <div style={{ width: '1px', height: '32px', background: '#e2e8f0' }}></div>
                    <input
                        type="number"
                        placeholder="Min ৳"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                        style={{ width: '100px', border: 'none', background: 'transparent', outline: 'none', fontSize: '16px', color: '#0f172a', fontWeight: 500 }}
                    />
                    <div style={{ width: '1px', height: '32px', background: '#e2e8f0' }}></div>
                    <input
                        type="number"
                        placeholder="Max ৳"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        style={{ width: '100px', border: 'none', background: 'transparent', outline: 'none', fontSize: '16px', color: '#0f172a', fontWeight: 500 }}
                    />
                    <button className="btn-primary" style={{ borderRadius: '100px', padding: '14px 32px', fontSize: '16px' }}>Search</button>
                </div>
            </div>

            <div className="app-container">
                {/* Filters */}
            <div className="category-filters">
                {categories.map(cat => (
                    <button
                        key={cat}
                        className={`filter-pill ${activeCat === cat ? 'active' : ''}`}
                        onClick={() => setActiveCat(cat)}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Grid */}
            {loading ? (
                <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--text-muted)' }}>Loading properties...</div>
            ) : error ? (
                <div style={{ padding: '40px 0', textAlign: 'center', color: 'red' }}>{error}</div>
            ) : filteredProperties.length === 0 ? (
                <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--text-muted)' }}>No properties found.</div>
            ) : (
                <div className="property-grid">
                    {filteredProperties.map(prop => {
                        // Handle image: API already returns full URLs
                        let imgUrl = prop.thumbnail || "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=600";
                        if (prop.images && prop.images.length > 0 && prop.images[0].file_path) {
                            imgUrl = prop.images[0].file_path;
                        }

                        // Handle location string
                        const locationStr = [prop.area, prop.district?.name, prop.division?.name].filter(Boolean).join(', ') || prop.address || 'Unknown Location';

                        return (
                            <Link to={`/property/${prop.id}`} style={{ textDecoration: 'none', color: 'inherit' }} key={prop.id}>
                                <div className="property-card">
                                    <div className="card-image-wrap">
                                        <span className="status-badge">{prop.status === 'active' ? 'For Rent' : prop.status}</span>
                                        <div className="favorite-btn" onClick={(e) => toggleFavorite(e, prop.id)}>
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill={prop.is_favorited ? "#ef4444" : "none"} stroke={prop.is_favorited ? "#ef4444" : "currentColor"} strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                                        </div>
                                        <img src={imgUrl} alt={prop.title} className="card-image" />
                                    </div>
                                    <div className="card-body">
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                                            <div className="card-price">৳{Number(prop.rent_amount).toLocaleString('bn-BD')} <span style={{ fontSize: '14px', color: 'var(--text-muted)', fontWeight: 500 }}>/month</span></div>
                                            {prop.category && <span className="category-tag">{prop.category.name}</span>}
                                        </div>
                                        <h3 className="card-title" title={prop.title}>{prop.title}</h3>
                                        <div className="card-location">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" style={{ flexShrink: 0 }}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                                            <span className="truncate-text">{locationStr}</span>
                                        </div>

                                        <div className="card-features">
                                            <div className="feature-item" title="Bedrooms">
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" strokeWidth="2"><path d="M2 4v16M2 8h18a2 2 0 0 1 2 2v10M2 17h20"></path></svg>
                                                {prop.beds || 0} Beds
                                            </div>
                                            <div className="feature-item" title="Bathrooms">
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" strokeWidth="2"><path d="M9 22H5a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v5"></path><circle cx="12" cy="15" r="4"></circle><line x1="12" y1="19" x2="12" y2="22"></line><line x1="12" y1="11" x2="12" y2="8"></line></svg>
                                                {prop.baths || 0} Baths
                                            </div>
                                            <div className="feature-item" title="Square Feet">
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect></svg>
                                                {prop.size_sqft || 0} sqft
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            )}

            {/* Mobile App Download CTA Section */}
            <div style={{
                marginTop: '80px',
                marginBottom: '40px',
                background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                borderRadius: '24px',
                padding: '60px 40px',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '40px',
                boxShadow: '0 20px 40px -10px rgba(0,0,0,0.3)',
                position: 'relative',
                overflow: 'hidden'
            }}>
                
                {/* Decorative background circle */}
                <div style={{
                    position: 'absolute',
                    top: '-100px',
                    right: '-100px',
                    width: '300px',
                    height: '300px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(14,165,233,0.2) 0%, rgba(14,165,233,0) 70%)',
                    zIndex: 1
                }}></div>

                <div style={{ flex: '1 1 400px', zIndex: 2 }}>
                    <h2 style={{ fontSize: '36px', fontWeight: 800, color: '#f8fafc', marginBottom: '16px', lineHeight: 1.2 }}>
                        Get the <span style={{ color: '#38bdf8' }}>HomeConnect</span> App
                    </h2>
                    <p style={{ fontSize: '18px', color: '#cbd5e1', marginBottom: '32px', lineHeight: 1.6 }}>
                        Find your perfect home anytime, anywhere. Download our mobile app to browse listings, get instant notifications, and chat directly with owners.
                    </p>
                    
                    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                        {/* Play Store Button */}
                        <a href="#" style={{
                            display: 'flex', alignItems: 'center', gap: '12px', background: '#000', color: '#fff', 
                            padding: '12px 24px', borderRadius: '12px', textDecoration: 'none', border: '1px solid #334155',
                            transition: 'transform 0.2s', width: 'fit-content'
                        }} onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-3px)'} onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                            <svg viewBox="0 0 24 24" width="28" height="28" fill="#fff"><path d="M4 2.5a1.5 1.5 0 0 0-1.5 1.5v16A1.5 1.5 0 0 0 4 21.5l14-9-14-10zm2 3.6l9.6 6.9-9.6 6.9v-13.8z"/></svg>
                            <div style={{ textAlign: 'left' }}>
                                <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px', opacity: 0.8 }}>GET IT ON</div>
                                <div style={{ fontSize: '18px', fontWeight: 600 }}>Google Play</div>
                            </div>
                        </a>

                        {/* App Store Button */}
                        <a href="#" style={{
                            display: 'flex', alignItems: 'center', gap: '12px', background: '#000', color: '#fff', 
                            padding: '12px 24px', borderRadius: '12px', textDecoration: 'none', border: '1px solid #334155',
                            transition: 'transform 0.2s', width: 'fit-content'
                        }} onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-3px)'} onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                            <svg viewBox="0 0 24 24" width="28" height="28" fill="#fff"><path d="M16.5 11c0-2.5 2-3.8 2-3.8-1.2-1.8-3-2-3.8-2-1.6-.2-3.2 1-4 1s-2-1-3.4-1c-1.8 0-3.4 1-4.4 2.6-2 3.4-.6 8.4 1.4 11 1 1.4 2 3 3.6 3 1.4-.2 2-.8 3.8-.8s2.4.8 3.8.8c1.6 0 2.6-1.6 3.6-3 1-1.4 1.4-2.8 1.4-2.8-.2-.2-2.6-1-2.6-4zM13.8 4.2c.8-1 1.4-2.4 1.2-3.8-1.2.2-2.8.8-3.6 1.8-.8.8-1.4 2.2-1.2 3.6 1.2 0 2.6-.6 3.6-1.6z"/></svg>
                            <div style={{ textAlign: 'left' }}>
                                <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px', opacity: 0.8 }}>Download on the</div>
                                <div style={{ fontSize: '18px', fontWeight: 600 }}>App Store</div>
                            </div>
                        </a>
                    </div>
                </div>

                <div style={{ flex: '1 1 300px', display: 'flex', justifyContent: 'center', zIndex: 2 }}>
                    <div style={{
                        width: '240px',
                        height: '480px',
                        background: '#0ea5e9',
                        borderRadius: '36px',
                        border: '8px solid #1e293b',
                        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
                        position: 'relative',
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white'
                    }}>
                        {/* Fake phone notch */}
                        <div style={{
                            position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
                            width: '120px', height: '24px', background: '#1e293b',
                            borderBottomLeftRadius: '12px', borderBottomRightRadius: '12px'
                        }}></div>
                        
                        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🏠</div>
                        <h3 style={{ fontSize: '24px', fontWeight: 800, textAlign: 'center', padding: '0 20px' }}>HomeConnect<br/>App</h3>
                        <div style={{ marginTop: '32px', width: '80%', height: '8px', background: 'rgba(255,255,255,0.3)', borderRadius: '4px' }}></div>
                        <div style={{ marginTop: '16px', width: '60%', height: '8px', background: 'rgba(255,255,255,0.3)', borderRadius: '4px' }}></div>
                        <div style={{ marginTop: '16px', width: '80%', height: '8px', background: 'rgba(255,255,255,0.3)', borderRadius: '4px' }}></div>
                        <div style={{ marginTop: '16px', width: '70%', height: '8px', background: 'rgba(255,255,255,0.3)', borderRadius: '4px' }}></div>
                    </div>
                </div>
            </div>

        </div>
        </div>
    );
};

export default PropertyList;
