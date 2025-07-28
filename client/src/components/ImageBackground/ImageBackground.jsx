// src/components/ImageBackground/ImageBackground.jsx

import React from 'react';
import './ImageBackground.css';

/**
 * A reusable wrapper component to display a background image behind its children.
 *
 * @param {object} props
 * @param {string} props.src - The URL or path to the background image.
 * @param {React.ReactNode} props.children - The content to display on top of the background.
 * @param {string} [props.className] - Optional additional CSS classes for custom styling.
 */
const ImageBackground = ({ src, children, className = '' }) => {
  // We apply the background image directly via an inline style
  // so that the image source can be dynamic.
  const wrapperStyles = {
    backgroundImage: `url(${src})`,
  };

  return (
    <div
      className={`image-background-wrapper ${className}`}
      style={wrapperStyles}
    >
      {/* This overlay div adds a dark tint for better text readability */}
      <div className="image-overlay"></div>
      
      {/* The content is rendered in its own container to ensure it's on top */}
      <div className="content-on-top">
        {children}
      </div>
    </div>
  );
};

export default ImageBackground;