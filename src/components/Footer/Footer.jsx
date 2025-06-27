import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Section 1: Brand Info - Text is now left-aligned on desktop for readability */}
        <div className="footer-section about">
          <h4>DASVFX_STUDIO</h4>
          <p>Pushing the boundaries of visual storytelling. We visualize tomorrow, today.</p>
        </div>

        {/* Section 2: Quick Links */}
        <div className="footer-section links">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="/portfolio">Portfolio</a></li>
            <li><a href="/services">Services</a></li>
            <li><a href="/contact">Contact Us</a></li>
          </ul>
        </div>

        {/* Section 3: Social Media */}
        <div className="footer-section social">
          <h4>Follow Us</h4>
          <div className="social-icons">
            {/* Using target="_blank" opens links in a new tab. 
                rel="noopener noreferrer" is a crucial security measure for external links. */}
            <a href="https://www.artstation.com/" target="_blank" rel="noopener noreferrer" aria-label="ArtStation">ArtStation</a>
            <a href="https://www.linkedin.com/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">LinkedIn</a>
            <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">Instagram</a>
          </div>
        </div>
      </div>

      {/* Footer Bottom Bar */}
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} DAS VFX STUDIO. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;