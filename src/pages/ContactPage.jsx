import React, { useState } from 'react';
import './ContactPage.css'; // Import the stylesheet

// Import icons for contact details
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

const ContactPage = () => {
  // State to manage form inputs
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  // Handler for input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  // Handler for form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // **IMPORTANT**: In a real app, you would integrate a service like EmailJS,
    // Formspree, or a custom backend here to actually send the email.
    // For now, we'll just log the data to the console.
    console.log('Form data submitted:', formData);
    alert('Thank you for your message! We will get back to you soon.');
    // Optionally, reset the form
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="contact-page container">
      <header className="contact-header">
        <h1>Get in Touch</h1>
        <p>Have a project in mind? We'd love to hear from you. Let's create something amazing together.</p>
      </header>

      <div className="contact-container">
        <div className="contact-details">
          <h2>Contact Information</h2>
          <p>Fill up the form and our team will get back to you within 24 hours.</p>
          <div className="detail-item">
            <span className="detail-icon"><FaPhone /></span>
            <span>+91 9945002480</span>
          </div>
          <div className="detail-item">
            <span className="detail-icon"><FaEnvelope /></span>
            <span>contact@dasvfx.com</span>
          </div>
          <div className="detail-item">
            <span className="detail-icon"><FaMapMarkerAlt /></span>
            <span>Bangalore</span>
          </div>
        </div>

        <div className="contact-form-container">
          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="subject">Subject</label>
              <input type="text" id="subject" name="subject" value={formData.subject} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea id="message" name="message" value={formData.message} onChange={handleChange} required></textarea>
            </div>
            <button type="submit" className="submit-btn">Send Message</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;