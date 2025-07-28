// src/components/VideoBackground/VideoBackground.jsx

import React, { useState, useEffect } from 'react';
import './VideoBackground.css'; // Make sure this CSS is imported

const VideoBackground = ({ videoSrc, imageSrc, duration = 5000, children }) => {
  const [showVideo, setShowVideo] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowVideo(false);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  const containerClasses = `video-background-container ${!showVideo ? 'show-image-bg' : ''}`;
  const videoClasses = `video-element ${showVideo ? 'video-active' : 'video-hidden'}`;

  return (
    <div 
      className={containerClasses} 
      style={{ backgroundImage: !showVideo ? `url(${imageSrc})` : 'none' }}
    >
      <video
        id="bg-video"
        className={videoClasses}
        playsInline
        autoPlay
        muted
        loop
      >
        <source src={videoSrc} type="video/mp4" />
      </video>

      {/* This overlay provides the dark tint */}
      <div className="background-overlay"></div>

      {/* 
        --- KEY CHANGE IS HERE ---
        Wrap the children in the scrollable content container.
        This container has a z-index to ensure it sits ON TOP of the video and overlay.
      */}
      <div className="content-container">
        {children}
      </div>

    </div>
  );
};

export default VideoBackground;