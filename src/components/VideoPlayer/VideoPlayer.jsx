// src/components/VideoPlayer/VideoPlayer.jsx

import React from 'react';
import PropTypes from 'prop-types'; // Good practice to define expected props

const VideoPlayer = ({ src }) => {
  // If no src is provided, don't render anything
  if (!src) {
    return null;
  }

  return (
    <div className="video-player-wrapper">
      {/* 
        Using the `key` prop on the <video> tag is a useful trick.
        If the `src` prop changes, React will completely replace the old <video>
        element with a new one, avoiding potential issues with stateful media elements.
      */}
      <video key={src} width="100%" controls preload="metadata">
        <source src={src} type="video/mp4" />
        Your browser does not support the video tag. Please upgrade your browser.
      </video>
    </div>
  );
};

// This defines that the component expects a 'src' prop, and it must be a string.
VideoPlayer.propTypes = {
  src: PropTypes.string.isRequired,
};

export default VideoPlayer;