// src/components/AuthSuccess.jsx

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function AuthSuccess() {
    const navigate = useNavigate();

    useEffect(() => {
        // You can optionally make a call to your backend here to confirm the user
        console.log("Authentication successful!");

        // Redirect to the home page after a short delay
        setTimeout(() => {
            navigate('/'); // This will redirect to your HomePage
        }, 1000); // 1-second delay
    }, [navigate]);

    return (
        <div style={{ padding: '50px', textAlign: 'center' }}>
            <h2>Authentication Successful!</h2>
            <p>Redirecting you to the main page...</p>
        </div>
    );
}

export default AuthSuccess;