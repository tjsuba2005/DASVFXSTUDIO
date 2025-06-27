// src/pages/VideoPlayerPage.jsx

import React from 'react';

// This is the component function
function VideoPlayerPage() {
  return (
    <div>
      <h1>My Video Player</h1>
      {/* You will add your <video> tag here */}
      <video width="750" height="500" controls>
        <source src="/background-video.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
}

// THIS LINE IS CRUCIAL
export default VideoPlayerPage;