import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const PropertyDetails = () => {
    const { id } = useParams();
    const [property, setProperty] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeImage, setActiveImage] = useState(0);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const res = await fetch(`/api/property/details/${id}`);
                const data = await res.json();
                if (res.ok && data.status) {
                    setProperty(data.data);
                } else {
                    setError('Failed to fetch property details.');
                }
            } catch (err) {
                setError('Network error.');
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();
    }, [id]);

    if (loading) return <div style={{padding: '100px', textAlign: 'center', fontSize: '18px', color: 'var(--text-muted)'}}>Loading beautiful details...</div>;
    if (error || !property) return <div style={{padding: '100px', textAlign: 'center', color: 'red', fontSize: '18px'}}>{error || 'Property not found.'}</div>;

    // Handle Images
    const allImages = [];
    if (property.thumbnail) allImages.push(property.thumbnail);
    if (property.images && property.images.length > 0) {
        property.images.forEach(img => {
            if (img.file_path && !allImages.includes(img.file_path)) {
                allImages.push(img.file_path);
            }
        });
    }
    if (allImages.length === 0) {
        allImages.push("https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=1200");
    }

    const locationStr = [property.area, property.district?.name_en, property.division?.name_en].filter(Boolean).join(', ') || property.address;

    return (
        <div className="app-container" style={{paddingTop: '20px', paddingBottom: '80px'}}>
            {/* Breadcrumb / Back */}
            <div style={{marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px'}}>
                <Link to="/" style={{color: 'var(--primary-blue)', textDecoration: 'none', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px'}}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                    Back to search
                </Link>
                <span style={{color: 'var(--text-muted)'}}>/</span>
                <span style={{color: 'var(--text-muted)', fontSize: '14px'}}>{property.category?.name || 'Property'}</span>
            </div>

            {/* Header */}
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px', marginBottom: '24px'}}>
                <div>
                    <div style={{display: 'flex', gap: '10px', marginBottom: '12px'}}>
                        <span className="status-badge" style={{position: 'static', background: property.status === 'active' ? '#10b981' : 'var(--primary-blue)', color: '#fff'}}>
                            {property.status === 'active' ? 'Available Now' : property.status}
                        </span>
                        {property.is_negotiable ? <span className="status-badge" style={{position: 'static', background: '#f59e0b', color: '#fff'}}>Negotiable</span> : null}
                    </div>
                    <h1 style={{fontSize: '32px', fontWeight: 800, marginBottom: '8px', color: 'var(--text-main)', lineHeight: 1.2}}>{property.title}</h1>
                    <div style={{color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '16px'}}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                        {locationStr}
                        {property.map_link && (
                            <a href={property.map_link} target="_blank" rel="noreferrer" style={{marginLeft: '12px', color: 'var(--primary-blue)', fontSize: '14px', textDecoration: 'none', fontWeight: 600}}>View on Map</a>
                        )}
                    </div>
                </div>
            </div>

            {/* Image Gallery */}
            <div style={{marginBottom: '40px'}}>
                <div style={{width: '100%', height: '500px', borderRadius: 'var(--radius-lg)', overflow: 'hidden', marginBottom: '16px', background: '#eee'}}>
                    <img src={allImages[activeImage]} alt="Main" style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                </div>
                {allImages.length > 1 && (
                    <div style={{display: 'flex', gap: '16px', overflowX: 'auto', paddingBottom: '8px'}}>
                        {allImages.map((img, idx) => (
                            <div 
                                key={idx} 
                                onClick={() => setActiveImage(idx)}
                                style={{
                                    width: '120px', height: '80px', borderRadius: 'var(--radius-sm)', overflow: 'hidden', cursor: 'pointer', flexShrink: 0,
                                    border: activeImage === idx ? '3px solid var(--primary-blue)' : 'none', opacity: activeImage === idx ? 1 : 0.7
                                }}
                            >
                                <img src={img} alt={`Thumb ${idx}`} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Main Content Layout */}
            <div style={{display: 'flex', gap: '40px', flexWrap: 'wrap', alignItems: 'flex-start'}}>
                
                {/* Left Column (Details) */}
                <div style={{flex: '1 1 60%', minWidth: '300px'}}>
                    
                    {/* Key Features Quick Look */}
                    <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '16px', marginBottom: '40px'}}>
                        <div style={{background: 'var(--surface-color)', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '8px'}}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--primary-blue)" strokeWidth="2"><path d="M2 4v16M2 8h18a2 2 0 0 1 2 2v10M2 17h20"></path></svg>
                            <div style={{fontSize: '20px', fontWeight: 700}}>{property.beds || 0}</div>
                            <div style={{color: 'var(--text-muted)', fontSize: '14px'}}>Bedrooms</div>
                        </div>
                        <div style={{background: 'var(--surface-color)', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '8px'}}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--primary-blue)" strokeWidth="2"><path d="M9 22H5a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v5"></path><circle cx="12" cy="15" r="4"></circle><line x1="12" y1="19" x2="12" y2="22"></line><line x1="12" y1="11" x2="12" y2="8"></line></svg>
                            <div style={{fontSize: '20px', fontWeight: 700}}>{property.baths || 0}</div>
                            <div style={{color: 'var(--text-muted)', fontSize: '14px'}}>Bathrooms</div>
                        </div>
                        <div style={{background: 'var(--surface-color)', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '8px'}}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--primary-blue)" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect></svg>
                            <div style={{fontSize: '20px', fontWeight: 700}}>{property.size_sqft || 0}</div>
                            <div style={{color: 'var(--text-muted)', fontSize: '14px'}}>Square Feet</div>
                        </div>
                        <div style={{background: 'var(--surface-color)', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '8px'}}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--primary-blue)" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
                            <div style={{fontSize: '20px', fontWeight: 700}}>{property.floor_no || 'N/A'}</div>
                            <div style={{color: 'var(--text-muted)', fontSize: '14px'}}>Floor Level</div>
                        </div>
                    </div>

                    {/* About Section */}
                    <div style={{marginBottom: '40px'}}>
                        <h2 style={{fontSize: '24px', fontWeight: 700, marginBottom: '16px', color: 'var(--text-main)'}}>About this property</h2>
                        <p style={{lineHeight: 1.8, color: '#4a5568', fontSize: '16px', whiteSpace: 'pre-wrap'}}>{property.description || 'No description provided.'}</p>
                    </div>

                    {/* Detailed Info Grid */}
                    <div style={{marginBottom: '40px'}}>
                        <h2 style={{fontSize: '24px', fontWeight: 700, marginBottom: '24px', color: 'var(--text-main)'}}>Property Details</h2>
                        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'y-16px', rowGap: '20px'}}>
                            <div style={{display: 'flex', justifyContent: 'space-between', paddingRight: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px'}}>
                                <span style={{color: 'var(--text-muted)'}}>Category</span>
                                <span style={{fontWeight: 600}}>{property.category?.name || 'N/A'}</span>
                            </div>
                            <div style={{display: 'flex', justifyContent: 'space-between', paddingRight: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px'}}>
                                <span style={{color: 'var(--text-muted)'}}>For Whom</span>
                                <span style={{fontWeight: 600}}>{property.for_whom || 'Anyone'}</span>
                            </div>
                            <div style={{display: 'flex', justifyContent: 'space-between', paddingRight: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px'}}>
                                <span style={{color: 'var(--text-muted)'}}>Balconies</span>
                                <span style={{fontWeight: 600}}>{property.balconies || 0}</span>
                            </div>
                            <div style={{display: 'flex', justifyContent: 'space-between', paddingRight: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px'}}>
                                <span style={{color: 'var(--text-muted)'}}>Available</span>
                                <span style={{fontWeight: 600}}>{property.is_available_immediately ? 'Immediately' : 'Contact Owner'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Billing Details */}
                    <div style={{marginBottom: '40px'}}>
                        <h2 style={{fontSize: '24px', fontWeight: 700, marginBottom: '24px', color: 'var(--text-main)'}}>Utility & Financials</h2>
                        <div style={{display: 'flex', flexWrap: 'wrap', gap: '16px'}}>
                            <div style={{padding: '12px 20px', background: property.gas_bill_included ? '#d1fae5' : '#fee2e2', color: property.gas_bill_included ? '#065f46' : '#991b1b', borderRadius: 'var(--radius-full)', fontWeight: 600, fontSize: '14px', display: 'flex', gap: '8px'}}>
                                {property.gas_bill_included ? '✓' : '✕'} Gas Bill Included
                            </div>
                            <div style={{padding: '12px 20px', background: property.water_bill_included ? '#d1fae5' : '#fee2e2', color: property.water_bill_included ? '#065f46' : '#991b1b', borderRadius: 'var(--radius-full)', fontWeight: 600, fontSize: '14px', display: 'flex', gap: '8px'}}>
                                {property.water_bill_included ? '✓' : '✕'} Water Bill Included
                            </div>
                            <div style={{padding: '12px 20px', background: property.electricity_bill_included ? '#d1fae5' : '#fee2e2', color: property.electricity_bill_included ? '#065f46' : '#991b1b', borderRadius: 'var(--radius-full)', fontWeight: 600, fontSize: '14px', display: 'flex', gap: '8px'}}>
                                {property.electricity_bill_included ? '✓' : '✕'} Electricity Bill Included
                            </div>
                        </div>
                    </div>

                    {/* Special Terms */}
                    {property.special_terms && (
                        <div style={{marginBottom: '40px', padding: '24px', background: '#fffbeb', borderLeft: '4px solid #f59e0b', borderRadius: '0 var(--radius-md) var(--radius-md) 0'}}>
                            <h3 style={{fontSize: '18px', fontWeight: 700, marginBottom: '12px', color: '#b45309'}}>Special Rules & Terms</h3>
                            <p style={{lineHeight: 1.6, color: '#78350f', whiteSpace: 'pre-wrap'}}>{property.special_terms}</p>
                        </div>
                    )}
                </div>

                {/* Right Column (Pricing & Contact Widget) */}
                <div style={{flex: '1 1 35%', minWidth: '320px', position: 'sticky', top: '20px'}}>
                    <div style={{background: 'var(--surface-color)', padding: '32px', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border-color)'}}>
                        <div style={{marginBottom: '24px', borderBottom: '1px solid var(--border-color)', paddingBottom: '24px'}}>
                            <div style={{fontSize: '14px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px'}}>Monthly Rent</div>
                            <div style={{fontSize: '40px', fontWeight: 900, color: 'var(--primary-blue)'}}>৳{Number(property.rent_amount).toLocaleString('bn-BD')}</div>
                            <div style={{color: 'var(--text-muted)', fontSize: '14px', marginTop: '8px'}}>
                                Advance: <strong>{property.advance_month || 0} Month(s)</strong> <br/>
                                Service Charge: <strong>৳{Number(property.service_charge || 0).toLocaleString('bn-BD')}</strong>
                            </div>
                        </div>

                        <div style={{marginBottom: '24px'}}>
                            <div style={{fontSize: '16px', fontWeight: 700, marginBottom: '16px'}}>Contact Information</div>
                            <div style={{display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px'}}>
                                <div style={{width: '56px', height: '56px', borderRadius: '50%', background: 'var(--primary-blue)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: 700}}>
                                    {property.contact_name ? property.contact_name.charAt(0).toUpperCase() : 'O'}
                                </div>
                                <div>
                                    <div style={{fontWeight: 700, fontSize: '18px'}}>{property.contact_name || 'Property Owner'}</div>
                                    <div style={{color: 'var(--text-muted)', fontSize: '14px'}}>{property.contact_type || 'Landlord / Agent'}</div>
                                </div>
                            </div>
                            
                            <button className="btn-primary" style={{width: '100%', padding: '16px', fontSize: '16px', fontWeight: 600, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', marginBottom: '12px'}}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                                {property.hide_contact_number ? 'Hidden by Owner' : (property.contact_mobile_number || 'Call Now')}
                            </button>

                            {property.contact_whatsapp_number && !property.hide_contact_number && (
                                <a href={`https://wa.me/${property.contact_whatsapp_number}`} target="_blank" rel="noreferrer" style={{display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', width: '100%', padding: '16px', fontSize: '16px', fontWeight: 600, background: '#25D366', color: '#fff', borderRadius: 'var(--radius-sm)', textDecoration: 'none'}}>
                                    WhatsApp
                                </a>
                            )}
                        </div>

                        <div style={{fontSize: '13px', color: 'var(--text-muted)', textAlign: 'center', lineHeight: 1.5}}>
                            By contacting the owner, you agree to our Terms of Service and Privacy Policy. Never wire funds directly without verifying the property.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PropertyDetails;
