// src/components/Footer/Footer.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      
      {/* This container holds all the main content columns */}
      <div className="footer-content-container">

        {/* Section 1: About Us */}
        <div className="footer-section about">
          <h4>DASVFX_STUDIO</h4>
          <p>Pushing the boundaries of visual storytelling. We visualize tomorrow, today.</p>
        </div>

        {/* Section 2: Quick Links */}
        <div className="footer-section links">
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/portfolio">Portfolio</Link></li>
            <li><Link to="/services">Services</Link></li>
            <li><Link to="/contact">Contact Us</Link></li>
          </ul>
        </div>

        {/* Section 3: Follow Us */}
        <div className="footer-section social">
          <h4>Follow Us</h4>
          <div className="social-links">
            {/* Using <a> for external links is correct */}
            <a href="https://www.artstation.com/" target="_blank" rel="noopener noreferrer">ArtStation</a>
            <a href="https://www.linkedin.com/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
            <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer">Instagram</a>
          </div>
        </div>
      </div>

      {/* --- CORRECTED SECTION --- */}
      {/* 
        The copyright is now in its own container at the bottom of the footer.
        This allows it to be styled independently (e.g., centered across the full width).
      */}
      <div className="footer-copyright">
        {/* FIX: Changed 'class' to 'className' */}
        <p>©{new Date().getFullYear()} DASVFX STUDIO. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;