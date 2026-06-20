import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const PropertyEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        rent_amount: '',
        category_id: '',
        division_id: '',
        district_id: '',
        upazila_id: '',
        area: '',
        address: '',
        contact_mobile_number: '',
        is_available_immediately: false,
        is_negotiable: false,
        for_whom: 'family',
        month_id: '',
        advance_month: '',
        service_charge: '',
        rent_type: 'monthly',
        beds: '',
        baths: '',
        balconies: '',
        floor_no: '',
        size_sqft: '',
        map_link: '',
        gas_bill_included: false,
        electricity_bill_included: false,
        water_bill_included: false,
        market_distance_km: '',
        contact_name: '',
        contact_type: 'owner',
        contact_whatsapp_number: '',
        hide_contact_number: false,
        special_terms: ''
    });

    const [facilitiesList, setFacilitiesList] = useState([]);
    const [categories, setCategories] = useState([]);
    const [divisions, setDivisions] = useState([]);
    const [months, setMonths] = useState([]);
    
    const [selectedFacilities, setSelectedFacilities] = useState([]);
    const [existingImages, setExistingImages] = useState([]);
    const [existingThumbnail, setExistingThumbnail] = useState(null);
    const [newImages, setNewImages] = useState([]);
    const [newThumbnail, setNewThumbnail] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('auth_token');
            if (!token) {
                navigate('/login');
                return;
            }

            try {
                // Fetch form dependencies
                const depsRes = await fetch('/api/property-form-data');
                const depsData = await depsRes.json();
                if (depsData.status) {
                    setCategories(depsData.data.categories || []);
                    setDivisions(depsData.data.divisions || []);
                    setFacilitiesList(depsData.data.facilities || []);
                    setMonths(depsData.data.months || []);
                }

                // Fetch property details
                const propRes = await fetch(`/api/property/details/${id}`);
                const propData = await propRes.json();

                if (propData.status) {
                    const p = propData.data;
                    setFormData({
                        title: p.title || '',
                        description: p.description || '',
                        rent_amount: p.rent_amount || '',
                        category_id: p.category_id || '',
                        division_id: p.division_id || '',
                        district_id: p.district_id || '',
                        upazila_id: p.upazila_id || '',
                        area: p.area || '',
                        address: p.address || '',
                        contact_mobile_number: p.contact_mobile_number || '',
                        is_available_immediately: p.is_available_immediately === 1,
                        is_negotiable: p.is_negotiable === 1,
                        for_whom: p.for_whom || 'family',
                        month_id: p.month_id || '',
                        advance_month: p.advance_month || '',
                        service_charge: p.service_charge || '',
                        rent_type: p.rent_type || 'monthly',
                        beds: p.beds || '',
                        baths: p.baths || '',
                        balconies: p.balconies || '',
                        floor_no: p.floor_no || '',
                        size_sqft: p.size_sqft || '',
                        map_link: p.map_link || '',
                        gas_bill_included: p.gas_bill_included === 1,
                        electricity_bill_included: p.electricity_bill_included === 1,
                        water_bill_included: p.water_bill_included === 1,
                        market_distance_km: p.market_distance_km || '',
                        contact_name: p.contact_name || '',
                        contact_type: p.contact_type || 'owner',
                        contact_whatsapp_number: p.contact_whatsapp_number || '',
                        hide_contact_number: p.hide_contact_number === 1,
                        special_terms: p.special_terms || ''
                    });

                    if (p.facilities) {
                        setSelectedFacilities(p.facilities.map(f => f.id));
                    }
                    if (p.images) {
                        setExistingImages(p.images);
                    }
                    if (p.thumbnail) {
                        setExistingThumbnail(p.thumbnail);
                    }
                } else {
                    setError('Property not found');
                }
            } catch (err) {
                setError('Failed to load data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id, navigate]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleFacilityToggle = (facilityId) => {
        setSelectedFacilities(prev => 
            prev.includes(facilityId) 
                ? prev.filter(id => id !== facilityId)
                : [...prev, facilityId]
        );
    };

    const handleDeleteImage = async (imageId) => {
        if (!window.confirm('Are you sure you want to delete this image?')) return;
        
        try {
            const token = localStorage.getItem('auth_token');
            const res = await fetch(`/api/auth/property/image/${imageId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (res.ok && data.status) {
                setExistingImages(prev => prev.filter(img => img.id !== imageId));
            } else {
                alert(data.message || 'Failed to delete image');
            }
        } catch (err) {
            alert('Error deleting image');
        }
    };

    const handleDeleteThumbnail = async () => {
        if (!window.confirm('Are you sure you want to delete the main thumbnail?')) return;
        
        try {
            const token = localStorage.getItem('auth_token');
            const res = await fetch(`/api/auth/property/${id}/thumbnail`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (res.ok && data.status) {
                setExistingThumbnail(null);
            } else {
                alert(data.message || 'Failed to delete thumbnail');
            }
        } catch (err) {
            alert('Error deleting thumbnail');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');
        setSuccess('');

        const token = localStorage.getItem('auth_token');
        const submitData = new FormData();
        
        Object.keys(formData).forEach(key => {
            submitData.append(key, formData[key] === null ? '' : formData[key]);
        });

        // Append boolean fields explicitly
        submitData.set('is_available_immediately', formData.is_available_immediately ? 1 : 0);
        submitData.set('is_negotiable', formData.is_negotiable ? 1 : 0);
        submitData.set('gas_bill_included', formData.gas_bill_included ? 1 : 0);
        submitData.set('electricity_bill_included', formData.electricity_bill_included ? 1 : 0);
        submitData.set('water_bill_included', formData.water_bill_included ? 1 : 0);
        submitData.set('hide_contact_number', formData.hide_contact_number ? 1 : 0);

        selectedFacilities.forEach(facilityId => {
            submitData.append('facilities[]', facilityId);
        });

        if (newThumbnail) {
            submitData.append('thumbnail', newThumbnail);
        }

        newImages.forEach(image => {
            submitData.append('images[]', image);
        });

        try {
            const res = await fetch(`/api/auth/property/update/${id}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: submitData
            });

            const data = await res.json();
            
            if (res.ok && data.status) {
                setSuccess('Property updated successfully!');
                setTimeout(() => navigate('/dashboard'), 1500);
            } else {
                setError(data.message || 'Validation Error');
                if (data.data) {
                    const errStr = Object.values(data.data).map(val => val.join(', ')).join(' | ');
                    setError(errStr);
                }
            }
        } catch (err) {
            setError('An error occurred during update.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div style={{padding: '100px', textAlign: 'center', fontSize: '18px', color: 'var(--text-muted)'}}>Loading property details...</div>;

    return (
        <div className="app-container" style={{paddingTop: '40px', paddingBottom: '80px', width: '100%', paddingLeft: '4%', paddingRight: '4%', margin: '0 auto'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px'}}>
                <div>
                    <h1 style={{fontSize: '32px', fontWeight: 800, color: 'var(--text-main)', marginBottom: '8px'}}>Edit Property</h1>
                    <p style={{color: 'var(--text-muted)'}}>Update your listing details, photos, and features.</p>
                </div>
                <button onClick={() => navigate('/dashboard')} className="btn-primary" style={{background: 'transparent', color: 'var(--primary-blue)', border: '1px solid var(--primary-blue)'}}>
                    Back to Dashboard
                </button>
            </div>
            
            {error && <div style={{background: '#fee2e2', color: '#dc2626', padding: '16px', borderRadius: '8px', marginBottom: '24px', fontWeight: 500, borderLeft: '4px solid #dc2626'}}>{error}</div>}
            {success && <div style={{background: '#dcfce3', color: '#16a34a', padding: '16px', borderRadius: '8px', marginBottom: '24px', fontWeight: 500, borderLeft: '4px solid #16a34a'}}>{success}</div>}

            <form onSubmit={handleSubmit} className="property-edit-form">
                
                <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
                    
                    {/* LEFT COLUMN (Wider) */}
                    <div style={{ flex: '2 1 600px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
                        
                        {/* SECTION: BASIC INFO */}
                        <div className="form-section">
                            <h2 className="section-title">Basic Information</h2>
                            <div className="form-grid">
                                <div className="form-group span-2">
                                    <label>Title *</label>
                                    <input type="text" name="title" value={formData.title} onChange={handleInputChange} required />
                                </div>
                                <div className="form-group span-2">
                                    <label>Description *</label>
                                    <textarea name="description" value={formData.description} onChange={handleInputChange} required rows="4"></textarea>
                                </div>
                                <div className="form-group">
                                    <label>Category</label>
                                    <select name="category_id" value={formData.category_id} onChange={handleInputChange}>
                                        <option value="">Select Category</option>
                                        {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Property For</label>
                                    <select name="for_whom" value={formData.for_whom} onChange={handleInputChange}>
                                        <option value="family">Family</option>
                                        <option value="bachelor">Bachelor</option>
                                        <option value="female">Female Student/Jobholder</option>
                                        <option value="any">Any</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* SECTION: PROPERTY DETAILS */}
                        <div className="form-section">
                            <h2 className="section-title">Property Details</h2>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Bedrooms</label>
                                    <input type="number" name="beds" value={formData.beds} onChange={handleInputChange} />
                                </div>
                                <div className="form-group">
                                    <label>Bathrooms</label>
                                    <input type="number" name="baths" value={formData.baths} onChange={handleInputChange} />
                                </div>
                                <div className="form-group">
                                    <label>Balconies</label>
                                    <input type="number" name="balconies" value={formData.balconies} onChange={handleInputChange} />
                                </div>
                                <div className="form-group">
                                    <label>Floor No</label>
                                    <input type="text" name="floor_no" value={formData.floor_no} onChange={handleInputChange} placeholder="E.g. 5th Floor" />
                                </div>
                                <div className="form-group">
                                    <label>Size (SqFt)</label>
                                    <input type="number" name="size_sqft" value={formData.size_sqft} onChange={handleInputChange} />
                                </div>
                                <div className="form-group">
                                    <label>Available From</label>
                                    <select name="month_id" value={formData.month_id} onChange={handleInputChange}>
                                        <option value="">Select Month</option>
                                        {months.map(m => <option key={m.id} value={m.id}>{m.name_en}</option>)}
                                    </select>
                                </div>
                                <div className="form-group span-2">
                                    <label className="checkbox-label">
                                        <input type="checkbox" name="is_available_immediately" checked={formData.is_available_immediately} onChange={handleInputChange} />
                                        Available Immediately
                                    </label>
                                </div>
                                <div className="form-group span-2" style={{display: 'flex', gap: '20px', marginTop: '8px', flexWrap: 'wrap'}}>
                                    <label className="checkbox-label"><input type="checkbox" name="gas_bill_included" checked={formData.gas_bill_included} onChange={handleInputChange} /> Gas Included</label>
                                    <label className="checkbox-label"><input type="checkbox" name="water_bill_included" checked={formData.water_bill_included} onChange={handleInputChange} /> Water Included</label>
                                    <label className="checkbox-label"><input type="checkbox" name="electricity_bill_included" checked={formData.electricity_bill_included} onChange={handleInputChange} /> Electricity Included</label>
                                </div>
                            </div>
                        </div>

                        {/* SECTION: FACILITIES */}
                        <div className="form-section">
                            <h2 className="section-title">Facilities</h2>
                            <div className="facilities-grid">
                                {facilitiesList.map(f => (
                                    <label key={f.id} className={`facility-pill ${selectedFacilities.includes(f.id) ? 'active' : ''}`}>
                                        <input type="checkbox" checked={selectedFacilities.includes(f.id)} onChange={() => handleFacilityToggle(f.id)} style={{display: 'none'}} />
                                        {f.name_en}
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* SECTION: MEDIA */}
                        <div className="form-section">
                            <h2 className="section-title">Media & Photos</h2>
                            
                            <div className="media-manager" style={{ gridTemplateColumns: '1fr', gap: '20px' }}>
                                <div className="media-block">
                                    <label>Main Thumbnail</label>
                                    {existingThumbnail ? (
                                        <div className="image-preview-card" style={{ maxWidth: '200px' }}>
                                            <img src={existingThumbnail} alt="Thumbnail" />
                                            <button type="button" className="delete-img-btn" onClick={handleDeleteThumbnail} title="Delete Thumbnail">🗑️</button>
                                        </div>
                                    ) : (
                                        <input type="file" accept="image/*" onChange={(e) => setNewThumbnail(e.target.files[0])} />
                                    )}
                                </div>

                                <div className="media-block">
                                    <label>Gallery Images</label>
                                    <div className="gallery-grid">
                                        {existingImages.map(img => (
                                            <div key={img.id} className="image-preview-card">
                                                <img src={img.file_path} alt="Gallery" />
                                                <button type="button" className="delete-img-btn" onClick={() => handleDeleteImage(img.id)} title="Delete Image">🗑️</button>
                                            </div>
                                        ))}
                                    </div>
                                    <div style={{marginTop: '16px'}}>
                                        <label style={{fontSize: '14px', marginBottom: '8px', display: 'block', fontWeight: 600}}>Upload New Images</label>
                                        <input type="file" multiple accept="image/*" onChange={(e) => setNewImages(Array.from(e.target.files))} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                    </div>

                    {/* RIGHT COLUMN (Narrower) */}
                    <div style={{ flex: '1 1 350px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
                        
                        {/* SECTION: PRICING */}
                        <div className="form-section">
                            <h2 className="section-title">Pricing & Terms</h2>
                            <div className="form-grid" style={{ gridTemplateColumns: '1fr' }}>
                                <div className="form-group">
                                    <label>Rent Amount (৳) *</label>
                                    <input type="number" name="rent_amount" value={formData.rent_amount} onChange={handleInputChange} required />
                                </div>
                                <div className="form-group">
                                    <label>Rent Type</label>
                                    <select name="rent_type" value={formData.rent_type} onChange={handleInputChange}>
                                        <option value="monthly">Monthly</option>
                                        <option value="yearly">Yearly</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Advance/Deposit (Months)</label>
                                    <input type="number" name="advance_month" value={formData.advance_month} onChange={handleInputChange} />
                                </div>
                                <div className="form-group">
                                    <label>Service Charge (৳)</label>
                                    <input type="number" name="service_charge" value={formData.service_charge} onChange={handleInputChange} />
                                </div>
                                <div className="form-group">
                                    <label className="checkbox-label">
                                        <input type="checkbox" name="is_negotiable" checked={formData.is_negotiable} onChange={handleInputChange} />
                                        Rent is Negotiable
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* SECTION: LOCATION */}
                        <div className="form-section">
                            <h2 className="section-title">Location</h2>
                            <div className="form-grid" style={{ gridTemplateColumns: '1fr' }}>
                                <div className="form-group">
                                    <label>Division</label>
                                    <select name="division_id" value={formData.division_id} onChange={handleInputChange}>
                                        <option value="">Select Division</option>
                                        {divisions.map(div => <option key={div.id} value={div.id}>{div.name_en}</option>)}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>District ID *</label>
                                    <input type="number" name="district_id" value={formData.district_id} onChange={handleInputChange} required />
                                </div>
                                <div className="form-group">
                                    <label>Upazila ID *</label>
                                    <input type="number" name="upazila_id" value={formData.upazila_id} onChange={handleInputChange} required />
                                </div>
                                <div className="form-group">
                                    <label>Area</label>
                                    <input type="text" name="area" value={formData.area} onChange={handleInputChange} placeholder="E.g. Mirpur 10" />
                                </div>
                                <div className="form-group">
                                    <label>Full Address *</label>
                                    <input type="text" name="address" value={formData.address} onChange={handleInputChange} required />
                                </div>
                                <div className="form-group">
                                    <label>Map Link</label>
                                    <input type="url" name="map_link" value={formData.map_link} onChange={handleInputChange} placeholder="Google Maps URL" />
                                </div>
                            </div>
                        </div>

                        {/* SECTION: CONTACT */}
                        <div className="form-section">
                            <h2 className="section-title">Contact Information</h2>
                            <div className="form-grid" style={{ gridTemplateColumns: '1fr' }}>
                                <div className="form-group">
                                    <label>Contact Name</label>
                                    <input type="text" name="contact_name" value={formData.contact_name} onChange={handleInputChange} />
                                </div>
                                <div className="form-group">
                                    <label>Contact Type</label>
                                    <select name="contact_type" value={formData.contact_type} onChange={handleInputChange}>
                                        <option value="owner">Owner</option>
                                        <option value="broker">Broker / Agent</option>
                                        <option value="manager">Manager</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Mobile Number *</label>
                                    <input type="text" name="contact_mobile_number" value={formData.contact_mobile_number} onChange={handleInputChange} required />
                                </div>
                                <div className="form-group">
                                    <label>WhatsApp Number</label>
                                    <input type="text" name="contact_whatsapp_number" value={formData.contact_whatsapp_number} onChange={handleInputChange} />
                                </div>
                                <div className="form-group">
                                    <label className="checkbox-label" style={{ alignItems: 'flex-start' }}>
                                        <input type="checkbox" name="hide_contact_number" checked={formData.hide_contact_number} onChange={handleInputChange} style={{ marginTop: '4px' }} />
                                        <span>Hide Contact Number<br/><small style={{color: 'var(--text-muted)'}}>Users must message you</small></span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="form-actions" style={{display: 'flex', justifyContent: 'flex-end', gap: '16px', marginTop: '32px', padding: '24px', background: 'var(--surface-color)', borderRadius: '16px', border: '1px solid var(--border-color)'}}>
                    <button type="button" onClick={() => navigate('/dashboard')} className="btn-primary" style={{background: '#f1f5f9', color: '#475569', padding: '16px 32px'}}>Cancel</button>
                    <button type="submit" className="btn-primary" disabled={submitting} style={{padding: '16px 40px', fontSize: '18px'}}>
                        {submitting ? 'Updating Property...' : 'Save Changes'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default PropertyEdit;
