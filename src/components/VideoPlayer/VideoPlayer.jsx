// src/components/VideoPlayer/VideoPlayer.jsx (with Fullscreen Support)

import React, { useEffect, useRef, useState } from 'react';
import './VideoPlayer.css';

const BACKEND_URL = 'http://localhost:5000';

const VideoPlayer = ({ video, onClose }) => {
  const videoRef = useRef(null);
  const playerContainerRef = useRef(null); // Ref for the container we want to make fullscreen

  // --- Fullscreen Logic ---
  const handleFullscreen = () => {
    const playerElement = playerContainerRef.current;
    if (!playerElement) return;

    if (document.fullscreenElement) {
      // If already fullscreen, exit.
      document.exitFullscreen();
    } else {
      // Otherwise, request fullscreen for the player container.
      if (playerElement.requestFullscreen) {
        playerElement.requestFullscreen();
      } else if (playerElement.mozRequestFullScreen) { // Firefox
        playerElement.mozRequestFullScreen();
      } else if (playerElement.webkitRequestFullscreen) { // Chrome, Safari and Opera
        playerElement.webkitRequestFullscreen();
      } else if (playerElement.msRequestFullscreen) { // IE/Edge
        playerElement.msRequestFullscreen();
      }
    }
  };


  useEffect(() => {
    if (video && videoRef.current) {
      videoRef.current.load();
    }
  }, [video]);


  if (!video) {
    return null;
  }

  const videoSrc = `${BACKEND_URL}/api/stream/${video.id}`;

  return (
    <div className="video-player-overlay" onClick={onClose}>
      {/* Attach the ref to the container */}
      <div 
        ref={playerContainerRef} 
        className="video-player-container" 
        onClick={(e) => e.stopPropagation()}
      >
        <button className="close-button" onClick={onClose}>×</button>
        
        {/* --- NEW FULLSCREEN BUTTON --- */}
        <button className="fullscreen-button" onClick={handleFullscreen}>
          {/* Simple SVG icon for fullscreen */}
          <svg viewBox="0 0 24 24">
            <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 2h-2v3h-3v2h5v-5zm-3-4V5h-2v2h-3v2h5z"/>
          </svg>
        </button>

        <video
          ref={videoRef}
          className="video-element"
          controls
          autoPlay
          key={video.id}
          // Double-click to toggle fullscreen
          onDoubleClick={handleFullscreen} 
          onError={() => console.error(`Error loading video: ${video.title}`)}
        >
          <source src={videoSrc} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <h3 className="video-player-title">{video.title}</h3>
      </div>
    </div>
  );
};

export default VideoPlayer;