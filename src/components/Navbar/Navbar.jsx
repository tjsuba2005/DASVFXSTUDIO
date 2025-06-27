import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  // State to manage the mobile menu's visibility
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Function to toggle the menu
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  // Function to close the menu when a link is clicked
  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          <Link to="/" className="navbar-logo" onClick={closeMobileMenu}>
            DAS VFX STUDIO
          </Link>

          {/* Hamburger Menu Icon */}
          <div className="menu-icon" onClick={toggleMobileMenu}>
            {/* Simple icon using divs: 3 lines */}
            <span></span>
            <span></span>
            <span></span>
          </div>

          {/* Navigation Menu */}
          <ul className={isMobileMenuOpen ? 'nav-menu active' : 'nav-menu'}>
            <li className="nav-item">
              <Link to="/" className="nav-links" onClick={closeMobileMenu}>Home</Link>
            </li>
            <li className="nav-item">
              <Link to="/portfolio" className="nav-links" onClick={closeMobileMenu}>Portfolio</Link>
            </li>
            <li className="nav-item">
              <Link to="/services" className="nav-links" onClick={closeMobileMenu}>Services</Link>
            </li>
            <li className="nav-item">
              <Link to="/contact" className="nav-links nav-links-btn" onClick={closeMobileMenu}>Contact</Link>
            </li>
            <li className="nav-item">
              <Link to="/aboutus" className="nav-links nav-links-btn" onClick={closeMobileMenu}>AboutUs</Link>
            </li>
          </ul>
        </div>
      </nav>

      {/* Hero Section - This now sits outside the <nav> for correct structure */}
      <div className="hero-section">
        <h1 className="hero-title">Transforming Imagination</h1>
        <p className="hero-motto">REELS TO REAL</p>
      </div>
    </>
  );
};

export default Navbar;