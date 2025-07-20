import React from 'react';
import { Link } from 'react-router-dom';
import VideoBackground from '../components/VideoBackground/VideoBackground';
import './AboutUs.css';

const AboutUs = () => {
  return (
    
     
       
        <main className="about-us-content">
          <header className="about-header">
            <h1>About DASVFX</h1>
            <p className="about-subtitle">Fusing Technology with Artistry to Create Unforgettable Visuals</p>
          </header>
           
          <section className="mission-section">
            <h2>Our Mission</h2>
            <p>
              Visual effects have evolved beyond being mere special effects; they have become an integral part of storytelling, shaping visuals and propelling narratives forward. Our mission is to be the creative partner that production houses and directors trust to bring their most ambitious visions from script to screen.
            </p>
            <p>
              We specialize in everything from creating fantastical creatures to seamlessly enhancing live-action footage, transforming the ordinary into the extraordinary with precision and passion.
            </p>
          </section>

          <section className="company-profile-section">
            {/* Re-added <aside> for semantic correctness. It's the right tag for this info. */}
            <aside>
              <h3>Company Profile</h3>
              <dl className="profile-list">
                <dt>Major Activity</dt>
                <dd>VFX & Animation Services</dd>
                <dt>Class of Company</dt>
                <dd>Private Limited</dd>
                <dt>Date of Incorporation</dt>
                <dd>July 26th, 2024</dd>
                <dt>Legal Entity</dt>
                <dd>DAS VFX Studios Pvt. Ltd.</dd>
                <dt>ROC</dt>
                <dd>ROC Bangalore (Chennai)</dd>
              </dl>
            </aside>
          </section>

          <section className="cta-section">
            <h2>Ready to Create Something Extraordinary?</h2>
            <Link to="/contact" className="cta-link-button">Let's Discuss Your Project</Link>
          </section>
        </main>       
      
    
  );
};

export default AboutUs;