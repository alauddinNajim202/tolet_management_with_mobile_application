import React from 'react';

const Hero = () => {
    return (
        <section className="f-hero">
            <h1>How you rent, <br/><span className="f-hero-highlight">list, and manage</span></h1>
            <p>Saas To-Let is the leading collaborative platform for property management. Connect landlords, tenants, and properties in one seamless workflow.</p>
            <div className="f-hero-cta">
                <a href="/admin/dashboard" className="f-hero-btn primary">Get Started Free</a>
                <a href="#properties" className="f-hero-btn secondary">Explore Properties</a>
            </div>

            <div className="f-mockup">
                <div className="f-mockup-header">
                    <div className="f-mockup-dot"></div>
                    <div className="f-mockup-dot"></div>
                    <div className="f-mockup-dot"></div>
                </div>
                <div className="f-mockup-body" style={{background: '#f9f9f9'}}>
                    {/* Floating Property Card 1 */}
                    <div className="f-floating-element f-float-1" style={{width: '240px', height: 'auto', padding: '15px', border: 'none', borderLeft: '4px solid var(--figma-purple)', top: '15%', left: '10%'}}>
                        <div style={{width: '100%', height: '100px', background: '#e5e5e5', borderRadius: '8px', marginBottom: '12px'}}></div>
                        <div style={{width: '80%', height: '12px', background: '#d1d1d1', borderRadius: '4px', marginBottom: '8px'}}></div>
                        <div style={{width: '50%', height: '12px', background: '#10b981', borderRadius: '4px'}}></div>
                    </div>
                    
                    {/* Floating Price Tag */}
                    <div className="f-floating-element f-float-2" style={{width: '120px', height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--figma-orange)', color: '#fff', fontSize: '24px', fontWeight: 'bold', bottom: '15%', right: '20%'}}>
                        ৳১৫,০০০
                    </div>

                    {/* Floating Status Card */}
                    <div className="f-floating-element f-float-3" style={{width: '160px', height: '60px', border: 'none', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', top: '25%', right: '15%', boxShadow: '0 10px 25px rgba(0,0,0,0.1)'}}>
                        <span style={{display: 'inline-block', width: '10px', height: '10px', background: 'var(--figma-green)', borderRadius: '50%', marginRight: '8px'}}></span>
                        <span style={{fontWeight: 'bold', color: '#1e1e1e'}}>Available</span>
                    </div>

                    <div style={{fontSize: '28px', fontWeight: 800, color: '#1e1e1e', background: '#fff', padding: '15px 30px', borderRadius: '12px', boxShadow: '0 10px 40px rgba(0,0,0,0.08)', position: 'relative', zIndex: 10}}>
                        Dashboard Overview
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
