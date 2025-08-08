import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // Correct path to your context
import './Navbar.css';

// Import your logo image into a variable
import studioLogo from './Logo.jpg'; 

const Navbar = () => {
  // 1. Get user, login, and logout from the global AuthContext
  const { user, login, logout } = useAuth(); 
  
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const toggleMobileMenu = () => setMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setMobileMenuOpen(false);

  // Helper function for logging out and closing the menu
  const handleLogout = () => {
    logout();
    closeMobileMenu();
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" onClick={closeMobileMenu}>
          <div className="logo-wrapper">
            <img src={studioLogo} alt="DASVFX Studio Logo" className="logo-image" />
            <span className="logo-text">DASVFX STUDIO</span>
          </div>
        </Link>

        <div className="menu-icon" onClick={toggleMobileMenu}>
          {/* A simple hamburger icon using divs */}
          <i className={isMobileMenuOpen ? 'fas fa-times' : 'fas fa-bars'} />
        </div>

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
            <Link to="/contact" className="nav-links" onClick={closeMobileMenu}>Contact</Link>
          </li>
          <li className="nav-item">
            <Link to="/aboutus" className="nav-links" onClick={closeMobileMenu}>About Us</Link>
          </li>
          
          {/* --- DYNAMIC AUTHENTICATION SECTION --- */}
          {user ? (
            // 2. If a user is logged in, show Logout and their avatar
            <>
              <li className="nav-item mobile-only"> 
                <button onClick={handleLogout} className="nav-links nav-links-btn">
                  Logout
                </button>
              </li>
              <li className="nav-item desktop-only">
                 <button onClick={handleLogout} className="nav-links-btn-logout">
                  Logout
                </button>
              </li>
               <li className="nav-item desktop-only">
                {user.picture && (
                  <img src={user.picture} alt="User Avatar" className="user-avatar" />
                )}
              </li>
            </>
          ) : (
            // 3. If no user is logged in, show the Login button
            <li className="nav-item">
              <button onClick={() => { handleLogin(); closeMobileMenu(); }} className=".nav-links-btn">
                Login
              </button>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;