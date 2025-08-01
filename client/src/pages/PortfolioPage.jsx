import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext'; // <-- IMPORTANT: Use the global auth context
import PortfolioGrid from '../components/PortfolioGrid/PortfolioGrid';
import VideoPlayer from '../components/VideoPlayer/VideoPlayer';
import LoadingSpinner from '../components/LoadingSpinner/LoadingSpinner';
import './PortfolioPage.css';

const BACKEND_URL =import.meta.env.VITE_API_URL;


const PortfolioPage = () => {
  // Get the user status directly from our global context
  const { user, isLoading: isAuthLoading } = useAuth(); 

  // State for this page's specific data
  const [videos, setVideos] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isPortfolioLoading, setIsPortfolioLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // This effect now ONLY fetches videos, and only if a user exists.
    if (user) {
      const fetchPortfolioVideos = async () => {
        setIsPortfolioLoading(true);
        try {
          const videosRes = await axios.get(`${BACKEND_URL}/api/videos`, {
            withCredentials: true,
          });
          
          const formattedData = videosRes.data.map(video => ({
            id: video.id,
            title: video.name.replace(/\.[^/.]+$/, ""),
            category: video.category,
            image: video.thumbnailLink,
            videoUrl: `${BACKEND_URL}/api/stream/${video.id}`
          }));

          setVideos(formattedData);
          setFilteredItems(formattedData);
        } catch (err) {
          console.error("Error fetching portfolio videos:", err);
          setError("Could not load your video portfolio. Please try refreshing.");
        } finally {
          setIsPortfolioLoading(false);
        }
      };

      fetchPortfolioVideos();
    } else {
      // If there's no user, we're not loading anything.
      setIsPortfolioLoading(false);
    }
  }, [user]); // Re-run this effect if the user object changes (e.g., on login/logout)

  const categories = ['All', 'DASVFX', ...new Set(videos.map(item => item.category).filter(c => c !== 'DASVFX'))];

  const handleFilterClick = (category) => {
    setActiveFilter(category);
    setFilteredItems(category === 'All' ? videos : videos.filter(item => item.category === category));
  };
  
  const handleVideoSelect = (video) => setSelectedVideo(video);

  const renderContent = () => {
    // First, wait for the initial auth check to complete
    if (isAuthLoading) {
      return <LoadingSpinner message="Verifying Session..." />;
    }

    // If there's no user after checking, they are not logged in.
    // The Navbar will show the "Login" button. We can show a prompt here too.
    if (!user) {
      return (
        <div className="login-container">
          <h2>Portfolio Access</h2>
          <p>This content is protected. Please log in to view the projects.</p>
          {/* The login button is in the Navbar, so no button is needed here */}
        </div>
      );
    }
    
    // If we get here, the user is logged in. Now check if the portfolio is loading.
    if (isPortfolioLoading) {
      return <LoadingSpinner message="Loading Portfolio..." />;
    }

    if (error) {
      return <p className="error-message">{error}</p>;
    }

    return (
      <>
        <VideoPlayer video={selectedVideo} onClose={() => setSelectedVideo(null)} />
        <div className="our-work-container">
          <h2 className="our-work-title">Our Work</h2>
          <p className="our-work-subtitle">A curated selection of our projects.</p>
          <div className="filter-buttons">
            {categories.map(category => (
              <button key={category} className={`filter-button ${activeFilter === category ? 'active' : ''}`} onClick={() => handleFilterClick(category)}>
                {category}
              </button>
            ))}
          </div>
        </div>
        {filteredItems.length > 0 ? (
          <PortfolioGrid items={filteredItems} onVideoSelect={handleVideoSelect} />
        ) : (
          <p className="no-videos-message">No videos found in your portfolio folder.</p>
        )}
      </>
    );
  };

  return (
    <div className="portfolio-page">
      <div className="video-background-container">
        <video autoPlay loop muted playsInline className="background-video">
          <source src="/porfoliovideo.mp4" type="video/mp4" />
        </video>
        <div className="video-overlay"></div>
      </div>
      <div className="portfolio-content">
        {renderContent()}
      </div>
    </div>
  );
};

export default PortfolioPage;