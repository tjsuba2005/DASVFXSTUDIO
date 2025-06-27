// src/Layout.jsx

import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';
// Use either your VideoBackground or ImageBackground component
import VideoBackground from '../components/VideoBackground/VideoBackground'; 
import './Layout.css';

const Layout = () => {
  return (
    // The background component wraps EVERYTHING.
    <VideoBackground videoSrc="/video/background-video.mp4" imageSrc="/images/backgroundimg_01.jpeg" duration={5000}>
    
      {/* 
        This single div inside the background component will contain
        your entire page structure and will be the scrollable element.
      */}
      <div className="main-layout-wrapper">
        <Navbar />

        {/* The main content area that will grow */}
        <main>
          <Outlet />
        </main>

        {/* The footer is now correctly at the END of the content flow */}
        <Footer />
      </div>

    </VideoBackground>
  );
};

export default Layout;