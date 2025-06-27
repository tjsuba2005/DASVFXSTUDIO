// src/components/VideoBackground/VideoBackground.jsx

import React, { useState, useEffect, useRef } from 'react';
import './VideoBackground.css';

/**
 * A component that plays a video for a set duration, then fades to a static image.
 *
 * @param {object} props
 * @param {React.ReactNode} props.children - The content to display on top.
 * @param {string} props.videoSrc - The path to the background video.
 * @param {string} props.imageSrc - The path to the fallback/static background image.
 * @param {number} [props.duration=5000] - Duration in milliseconds to play the video before fading.
 */
const VideoBackground = ({ children, videoSrc, imageSrc, duration = 5000 }) => {
  // State to control whether the video is active or the image is shown
  const [showVideo, setShowVideo] = useState(true);
  const videoRef = useRef(null);

  useEffect(() => {
    // Set a timer to switch from video to image after the specified duration
    const timer = setTimeout(() => {
      setShowVideo(false);
    }, duration);

    // Mute the video programmatically to ensure autoplay
    // This is a more robust way to handle it.
    if (videoRef.current) {
      videoRef.current.muted = true;
    }

    // Cleanup function: clear the timer if the component unmounts
    return () => clearTimeout(timer);
  }, [duration]); // The effect re-runs only if the duration prop changes

  // Dynamic styles for the main container to handle the background image transition
  const containerStyles = {
    // When the video is done, this sets the background image for the fade-in effect
    backgroundImage: !showVideo ? `url(${imageSrc})` : 'none',
  };

  return (
    <div
      className={`video-background-container ${!showVideo ? 'show-image-bg' : ''}`}
      style={containerStyles}
    >
      {/* 
        We use a class to control the video's opacity.
        This makes it fade out smoothly instead of just disappearing.
      */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        id="bg-video"
        className={showVideo ? 'video-active' : 'video-hidden'}
      >
        <source src={videoSrc} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      
      <div className="video-overlay"></div>

      <div className="content-container">
        {children}
      </div>
    </div>
  );
};

export default VideoBackground;