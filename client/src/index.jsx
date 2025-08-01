import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // Import BrowserRouter
import App from './App';
import './index.css'; // Global styles
import { AuthProvider } from './context/AuthContext'; 
import { HashRouter, Routes, Route } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <HashRouter>
    <AuthProvider>
    <App/>

    </AuthProvider>
     
    </HashRouter>
  </React.StrictMode>
);