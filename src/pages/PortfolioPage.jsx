// src/pages/PortfolioPage.jsx

import React, { useState } from 'react';
import PortfolioGrid from '../components/PortfolioGrid/PortfolioGrid';
import './PortfolioPage.css';

// --- DATA ---
// CORRECTED: IDs are now unique and image paths use forward slashes (/)
// and point to the public folder.
const allPortfolioItems = [
  { id: 1, title: 'Rocky Aur Rani Kii Prem Kahaani (2023-Feature Film)', category: 'Compositing', image: '/video/showreel_01.mp4' },
  { id: 2, title: 'Cyber City', category: '3D Modeling', image: '/images/img_05.jpeg' }, // <-- CORRECTED PATH
  { id: 3, title: 'Cosmic Drift', category: 'Simulation', image: '/video/showreel_02.mp4' },
  { id: 4, title: ' GREEN SCREEN & FX', category: 'Compositing', image: '/video/showreel_03.mp4' },
  { id: 5, title: 'Forest Spirit', category: '3D Modeling', image: '/images/img_01.jpeg' }, // <-- CORRECTED ID & PATH
  { id: 6, title: 'Jungle Ruins', category: '3D Modeling', image: '/images/img_02.jpeg' }, // <-- CORRECTED ID & PATH
  { id: 7, title: 'Mountain Temple', category: '3D Modeling', image: '/images/img_03.jpeg' }, // <-- CORRECTED ID & PATH
  { id: 8, title: ' GREEN SCREEN & FX', category: '3D Modeling', image: '/images/img_04.jpeg' }, // <-- CORRECTED ID & PATH
  { id: 9, title: ' GREEN SCREEN & FX', category: 'VFX', image: '/video/showreel_05.mp4' },
  { id: 10, title: 'MUZZLE FLASH', category: 'Animation', image: '/video/showreel_06.mp4' },
  { id: 11, title: 'PARTICLES & DMP', category: 'Simulation', image: '/video/showreel_07.mp4' },
  { id: 12, title: 'PARTICLES & DMP', category: 'Simulation', image: '/video/showreel_08.mp4' },
  { id: 13, title: '3D-Comp', category: 'Simulation', image: '/video/showreel_09.mp4' },
  { id: 14, title: 'Keying & Set Extension', category: 'Simulation', image: '/video/showreel_10.mp4' },
  { id: 15, title: '3Keying & Set Extension', category: 'Simulation', image: '/video/showreel_11.mp4' },
  { id: 16, title: '3D Modeling/Tracking', category: 'Simulation', image: '/video/showreel_12.mp4' },
  { id: 17, title: '3Keying & Set Extension', category: 'Simulation', image: '/video/showreel_13.mp4' },
  { id: 18, title: '3D Modeling/Tracking', category: 'Simulation', image: '/video/showreel_14.mp4' },
];

// --- COMPONENT ---
const PortfolioPage = () => {
  // State to hold the currently displayed items
  const [filteredItems, setFilteredItems] = useState(allPortfolioItems);
  
  // State to track the active filter button
  const [activeFilter, setActiveFilter] = useState('All');

  // Get a unique list of categories for the filter buttons
  const categories = ['All', ...new Set(allPortfolioItems.map(item => item.category))];

  // Function to handle clicking a filter button
  const handleFilterClick = (category) => {
    setActiveFilter(category);

    if (category === 'All') {
      setFilteredItems(allPortfolioItems);
    } else {
      const newItems = allPortfolioItems.filter(item => item.category === category);
      setFilteredItems(newItems);
    }
  };

  return (
   // In your Portfolio.jsx file
<div className="portfolio-page">
    <div className="our-work-container">
        <h2 className="our-work-title">Our Work</h2>
        <p className="our-work-subtitle">A curated selection of our projects...</p>
        <div className="filter-buttons">
            {/* Your buttons here */}
        </div>
    </div>
    
    <div className="video-grid-container">
        {/* Your video cards here */}
    </div>

 <div className="video-grid-container">
      {/* The Grid of Portfolio Items */}
      <PortfolioGrid items={filteredItems} />
    </div>
    </div>
  );
};

export default PortfolioPage;