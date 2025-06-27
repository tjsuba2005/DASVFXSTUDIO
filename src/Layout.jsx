import React from 'react';
import { Outlet } from 'react-router-dom'; // Import Outlet

// Import your shared components
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';

// Import the CSS for the layout's background
import './Layout.css'; 

const Layout = () => {
  return (
    // This div is our main container and will have the background image
    <div className="layout-container">
      <Navbar />

      {/* The Outlet component renders the current child route's element */}
      <main>
        <Outlet />
      </main>
      
      <Footer />
    </div>
  );
};

export default Layout;