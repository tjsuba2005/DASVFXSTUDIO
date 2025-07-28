// src/pages/NotFoundPage.jsx

import React from 'react';
import { Link } from 'react-router-dom'; // Good practice to link back home

function NotFoundPage() {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>404 - Page Not Found</h1>
      <p>Sorry, the page you are looking for does not exist.</p>
      <Link to="/HomePage.jsx">Go back to the Homepage</Link>
    </div>
  );
}

// Don't forget this crucial line!
export default NotFoundPage;