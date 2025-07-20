import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css'; // Make sure this CSS file is imported

// The HomePage is now a simple, "presentational" component.
const HomePage = () => {
  return (
    <div className="home-page">
      {/* The background video and overlay remain */}
      <div className="video-background-container">
        <video autoPlay loop muted playsInline className="background-video">
          <source src="/porfoliovideo.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="video-overlay"></div>
      </div>

      {/* The main content is now static and doesn't need to check for a user */}
      <div className="home-content-container">
        <h1 className="home-title">DASVFX STUDIO</h1>
        <p className="home-subtitle">REEL TO REAL</p>
        <div className="home-welcome-message">
          <p>Bringing your vision to life with cutting-edge visual effects.</p>
        </div>
        <Link to="/portfolio" className="home-cta-button">
          View Our Work
        </Link>
      </div>
    </div>
  );
};

export default HomePage;