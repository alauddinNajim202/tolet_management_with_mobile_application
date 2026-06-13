import React from 'react';

const Features = () => {
    return (
        <section className="f-features" id="features">
            <div className="f-feature-card">
                <div className="f-feature-icon green">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                </div>
                <h3>List Properties Easily</h3>
                <p>Add your properties, upload beautiful photos, and set your pricing. Reach thousands of verified tenants instantly in your area.</p>
            </div>
            
            <div className="f-feature-card">
                <div className="f-feature-icon orange">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                </div>
                <h3>Manage Tenants</h3>
                <p>Keep track of all your tenants from a centralized dashboard. Manage agreements, handle complaints, and build strong relationships.</p>
            </div>

            <div className="f-feature-card">
                <div className="f-feature-icon blue">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                </div>
                <h3>Track Payments</h3>
                <p>Never miss a rent cycle again. Automate your rent collection, generate invoices, and view complete financial summaries effortlessly.</p>
            </div>
        </section>
    );
};

export default Features;
