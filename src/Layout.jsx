import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';
import './Layout.css'; // Make sure this CSS file is imported

const Layout = () => {
  return (
    // The VideoBackground component is likely your root, which is fine.
    // The fix applies to the scrollable wrapper inside it.
    <div className="main-layout-wrapper"> {/* This is our flex container */}
      <Navbar />

      <main> {/* This is our flex-grow item */}
        <Outlet />
      </main>

      <Footer /> {/* This will be pushed to the bottom */}
    </div>
  );
};
// Note: If you have the VideoBackground component wrapping this, that's also fine.
// The key is that the direct parent of Navbar, main, and Footer has these flex styles.

export default Layout;