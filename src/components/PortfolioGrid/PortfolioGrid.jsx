// src/components/PortfolioGrid/PortfolioGrid.jsx

import React from 'react';
import './PortfolioGrid.css'; // Make sure you are importing the CSS file

const PortfolioGrid = ({ items }) => {
  return (
    <div className="portfolio-grid">
      {items.map((item) => {
        // Check if the item's source is a video by its file extension
        const isVideo = item.image.endsWith('.mp4');

        return (
          <article key={item.id} className="portfolio-item">
            {/* Conditional Rendering Logic: */}
            {isVideo ? (
              // If it's a video, render a <video> tag
              <video
                className="portfolio-media"
                autoPlay
                loop
                muted
                playsInline
                src={item.image}
              >
                Your browser does not support the video tag.
              </video>
            ) : (
              // Otherwise, render an <img> tag
              <img
                className="portfolio-media"
                src={item.image}
                alt={item.title}
              />
            )}

            {/* The Text Overlay that appears on hover */}
            <div className="portfolio-overlay">
              <h3 className="portfolio-title">{item.title}</h3>
              <p className="portfolio-category">{item.category}</p>
            </div>
          </article>
        );
      })}
    </div>
  );
};

export default PortfolioGrid;