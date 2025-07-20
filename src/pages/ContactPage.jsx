// src/pages/ContactPage.jsx

import React from 'react';
import './ContactPage.css'; // We will create this CSS file next

// For icons, you can use a library like react-icons
// Example: import { FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

const ContactPage = () => {
  return (
    <div className="contact-page-wrapper">
      
      <header className="contact-header">
        <h1>Get in Touch</h1>
        <p>Have a project in mind? We'd love to hear from you. Let's create something amazing together.</p>
      </header>

      {/* This container will hold our two columns */}
      <div className="contact-content-container">

        {/* --- COLUMN 1: Contact Information --- */}
        <div className="contact-info-column">
          <h2>Contact Information</h2>
          <p className="info-subtitle">Fill up the form and our team will get back to you within 24 hours.</p>
          <ul className="info-list">
            <li>
              {/* <FaPhone className="info-icon" /> */}
              <span>+91 9945002480</span>
            </li>
            <li>
              {/* <FaEnvelope className="info-icon" /> */}
              <span>contact@dasvfx.com</span>
            </li>
            <li>
              {/* <FaMapMarkerAlt className="info-icon" /> */}
              <span>Bangalore</span>
            </li>
          </ul>
        </div>

        {/* --- COLUMN 2: Contact Form --- */}
        <div className="contact-form-column">
          <form>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input type="text" id="name" name="name" required autoComplete="name"/>
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input type="email" id="email" name="email" required autoComplete="email"/>
            </div>
            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea id="message" name="message" rows="5" required autoComplete="message"></textarea>
            </div>
            <button type="submit" className="submit-button">Send Message</button>
          </form>
        </div>
        
      </div>
    </div>
  );
};

export default ContactPage;