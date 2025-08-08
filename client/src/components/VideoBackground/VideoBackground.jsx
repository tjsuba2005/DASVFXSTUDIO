// src/components/VideoBackground/VideoBackground.jsx

import React, { useState, useEffect } from 'react';
import './VideoBackground.css';

// BEST PRACTICE: Custom hook to check user's motion preference
const usePrefersReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = () => setPrefersReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersReducedMotion;
};


const VideoBackground = ({ videoSrc, imageSrc, posterSrc, duration = 5000, children }) => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [showVideo, setShowVideo] = useState(!prefersReducedMotion); // Start with image if motion is disabled

  // This effect handles the transition from video to image
  useEffect(() => {
    // If we're not showing the video initially, don't run the timer
    if (!showVideo) return;

    const timer = setTimeout(() => {
      setShowVideo(false);
    }, duration);

    // This cleanup function is essential
    return () => clearTimeout(timer);
  }, [duration, showVideo]);

  // This function handles video loading errors
  const handleVideoError = () => {
    console.error("Video failed to load. Falling back to static image.");
    setShowVideo(false);
  };

  const containerClasses = `video-background-container ${!showVideo ? 'show-image-bg' : ''}`;
  const videoClasses = `video-element ${showVideo ? 'video-active' : 'video-hidden'}`;

  return (
    <div 
      className={containerClasses} 
      style={{ backgroundImage: !showVideo ? `url(${imageSrc})` : 'none' }}
    >
      {/* Only render the video tag if we intend to show it */}
      {showVideo && (
        <video
          id="bg-video"
          className={videoClasses}
          playsInline
          autoPlay
          muted
          loop
          poster={posterSrc} // CRITICAL: For instant perceived load time
          onError={handleVideoError} // ROBUSTNESS: Handles broken video links
        >
          <source src={videoSrc} type="video/mp4" />
        </video>
      )}

      <div className="background-overlay"></div>
      
      <div className="content-container">
        {children}
      </div>
    </div>
  );
};

export default VideoBackground;