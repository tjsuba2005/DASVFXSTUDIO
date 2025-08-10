import React from 'react';
import { useAuth } from '../../context/AuthContext.jsx'; // Import the hook
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  // Use the hook to get everything you need!
  const { user, isAuthenticated, login, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          {/* ... your logo ... */}
        </Link>
        
        {/* ... your nav menu ... */}
        
        <div className="nav-auth-section">
          {isAuthenticated ? (
            // --- User is Logged In ---
            <div className="user-info">
              <img src={user.avatar} alt={user.displayName} className="user-avatar" />
              <span>Welcome, {user.displayName}</span>
              <button onClick={logout} className="nav-links-btn-logout">
                Logout
              </button>
            </div>
          ) : (
            // --- User is Logged Out ---
            <button onClick={login} className="nav-links-btn">
              Login with Google
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;