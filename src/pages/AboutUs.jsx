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

<<<<<<< HEAD
          <section className="cta-section">
            <h2>Ready to Create Something Extraordinary?</h2>
            <Link to="/contact" className="cta-link-button">Let's Discuss Your Project</Link>
          </section>
        </main>       
      
    
=======
      {/* --- Section 2: Our Mission / Philosophy --- */}
      <section className="mission-section">
        <h2>Our Mission</h2>
        <p>
          Visual effects have evolved beyond being mere special effects; they have become an integral part of storytelling, shaping visuals and propelling narratives forward. Our mission is to be the creative partner that production houses and directors trust to bring their most ambitious visions from script to screen.
        </p>
        <p>
          We specialize in everything from creating fantastical creatures to seamlessly enhancing live-action footage, transforming the ordinary into the extraordinary with precision and passion.
        </p>
      </section>

      {/* --- Section 3: Meet the Team --- */}
  //*   <section className="team-section">
        <h2>Meet the Core Team</h2>
        <div className="team-grid">
          <article className="team-member">
            <img src="https://placehold.co/200x200/a3bdbd/1a1a2e?text=CEO" alt="CEO Portrait" />
            <h3>K.RAMYA DEVI</h3>
            <p>Founder & VFX Supervisor</p>
          </article>
          <article className="team-member">
            <img src="https://placehold.co/200x200/e86776/1a1a2e?text=Lead" alt="Lead Artist Portrait" />
            <h3>K.RAMYA DEVI</h3>
            <p>Lead Compositing Artist</p>
          </article>
          <article className="team-member">
            <img src="https://placehold.co/200x200/ffffff/1a1a2e?text=Head" alt="Head of Production Portrait" />
            <h3>K.RAMYA DEVI</h3>
            <p>Head of Production</p>
          </article>
        </div>
      </section>
*//
      {/* --- Section 4: Company Profile (Your Requested Section) --- */}
      <section className="company-profile-section">
        <aside className="company-details">
          <h3>Company Profile</h3>
          <dl> {/* Definition List for key-value pairs */}
            <div>
              <dt>Major Activity</dt>
              <dd>VFX & Animation Services</dd>
            </div>
            <div>
              <dt>Class of Company</dt>
              <dd>Private Limited</dd>
            </div>
            <div>
              <dt>Date of Incorporation</dt>
              <dd>July 26th, 2024</dd>
            </div>
            <div>
              <dt>Legal Entity</dt>
              <dd>DAS VFX Studios Pvt. Ltd.</dd>
            </div>
             <div>
              <dt>RoC</dt>
              <dd>ROC Bangalore (Chennai)</dd>
            </div>
          </dl>
        </aside>
      </section>

       {/* --- Section 5: Call to Action --- */}
       <section className="cta-section">
          <h2>Ready to Create Something Extraordinary?</h2>
          <Link to="/contact" className="cta-button">Let's Discuss Your Project</Link>
        </section>

    </div></VideoBackground>
>>>>>>> 3cb32be7192a580aca7694c2eb23d702bf92297c
  );
};

export default AboutUs;
