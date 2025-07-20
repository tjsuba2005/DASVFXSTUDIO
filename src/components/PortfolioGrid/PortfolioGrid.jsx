// src/components/PortfolioGrid/PortfolioGrid.jsx

import React from 'react';
import './PortfolioGrid.css'; // Make sure this CSS file is imported

// You can place the SVG icon right in the component for simplicity
const PlayIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M8 5v14l11-7z"></path>
  </svg>
);

const PortfolioGrid = ({ items, onVideoSelect }) => {
  return (
    <div className="portfolio-grid">
      {items.map(item => (
        // The main clickable card container
        <div
          key={item.id}
          className="video-card" // We'll style this as the main card
          onClick={() => onVideoSelect(item)}
          tabIndex="0" // Makes it keyboard accessible
          role="button"
          aria-label={`Play video: ${item.title}`}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onVideoSelect(item)}
        >
          {/* NEW: Wrapper for the thumbnail to handle aspect ratio and overlay */}
          <div className="card-thumbnail-wrapper">
            <img src={item.image} alt={item.title} className="video-thumbnail" />
            {/* NEW: The play icon that appears on hover */}
            <div className="play-icon-overlay">
              <PlayIcon />
            </div>
          </div>

          {/* This is your existing info section */}
          <div className="video-info">
            <h3 className="video-title">{item.title}</h3>
            <p className="video-category">{item.category}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PortfolioGrid;