import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const categories = ["All", "Apartment", "House", "Commercial", "Sublet", "Hostel"];

const PropertyList = () => {
    const [activeCat, setActiveCat] = useState("All");
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const fetchProperties = async () => {
        setLoading(true);
        try {
            // Build query based on category
            let url = '/api/property/list';
            const queryParams = new URLSearchParams();
            if (activeCat !== 'All') {
                // Try to filter by category name if API supports, or map to category ID
                // Depending on the backend, for now we will send search or fetch all and filter locally 
                // if the API only filters by category_id. We'll fetch all and filter in frontend for this demo.
            }

            const res = await fetch(url);
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

    // Local filtering by category and search term
    const filteredProperties = properties.filter(prop => {
        const matchesCategory = activeCat === 'All' || (prop.category && prop.category.name === activeCat);
        const matchesSearch = prop.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              (prop.address && prop.address.toLowerCase().includes(searchTerm.toLowerCase()));
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="app-container">
            {/* Search Hero */}
            <div className="search-section">
                <h1 style={{fontSize: '28px', marginBottom: '16px'}}>Find your next home</h1>
                <div className="search-bar">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6c757d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{margin: '10px'}}><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                    <input 
                        type="text" 
                        className="search-input" 
                        placeholder="Search by location, property title..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button className="btn-primary" style={{padding: '10px 24px'}}>Search</button>
                </div>
            </div>

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
                <div style={{padding: '40px 0', textAlign: 'center', color: 'var(--text-muted)'}}>Loading properties...</div>
            ) : error ? (
                <div style={{padding: '40px 0', textAlign: 'center', color: 'red'}}>{error}</div>
            ) : filteredProperties.length === 0 ? (
                <div style={{padding: '40px 0', textAlign: 'center', color: 'var(--text-muted)'}}>No properties found.</div>
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
                            <Link to={`/property/${prop.id}`} style={{textDecoration: 'none', color: 'inherit'}} key={prop.id}>
                                <div className="property-card">
                                    <div className="card-image-wrap">
                                        <span className="status-badge">{prop.status === 'active' ? 'For Rent' : prop.status}</span>
                                        <img src={imgUrl} alt={prop.title} className="card-image" />
                                    </div>
                                    <div className="card-body">
                                        <div className="card-price">৳{Number(prop.rent_amount).toLocaleString('bn-BD')} <span style={{fontSize:'14px', color:'var(--text-muted)', fontWeight:500}}>/month</span></div>
                                        <h3 className="card-title">{prop.title}</h3>
                                        <div className="card-location">
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                                            {locationStr}
                                        </div>
                                        
                                        <div className="card-features">
                                            <div className="feature-item">
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 4v16M2 8h18a2 2 0 0 1 2 2v10M2 17h20"></path></svg>
                                                {prop.beds || 0} Beds
                                            </div>
                                            <div className="feature-item">
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 22H5a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v5"></path><circle cx="12" cy="15" r="4"></circle><line x1="12" y1="19" x2="12" y2="22"></line><line x1="12" y1="11" x2="12" y2="8"></line></svg>
                                                {prop.baths || 0} Baths
                                            </div>
                                            <div className="feature-item">
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect></svg>
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
        </div>
    );
};

export default PropertyList;
