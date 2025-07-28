import React from 'react';
import './ServicesPage.css'; // Import the stylesheet

// Import icons from react-icons
import { FaMagic, FaCube, FaFilm, FaDesktop, FaProjectDiagram, FaCloudsmith } from 'react-icons/fa';

// Array of service data to make it easy to manage
const services = [
  {
    icon: <FaMagic />,
    title: "Visual Effects (VFX)",
    description: "From particle simulations to dynamic effects, we create stunning visuals that bring your vision to life."
  },
  {
    icon: <FaCube />,
    title: "3D Modeling & Texturing",
    description: "High-quality, photorealistic 3D models for film, games, and advertising. We handle everything from concept to final render."
  },
  {
    icon: <FaFilm />,
    title: "Compositing & Rotoscoping",
    description: "Seamless integration of CG elements with live-action footage. Meticulous rotoscoping for clean and precise results."
  },
  {
    icon: <FaDesktop />,
    title: "Motion Graphics & Animation",
    description: "Engaging 2D and 3D motion graphics for title sequences, explainers, and promotional content."
  },
  {
    icon: <FaProjectDiagram />,
    title: "VFX Supervision",
    description: "On-set and post-production supervision to ensure a smooth workflow and the highest quality final product."
  },
  {
    icon: <FaCloudsmith />,
    title: "Virtual Production",
    description: "Leveraging real-time rendering technologies to create immersive virtual sets and environments."
  }
];

const ServicesPage = () => {
  return (
    <div className="services-page container">
      <header className="services-header">
        <h1>Our Services</h1>
        <p>We offer a comprehensive suite of visual effects services, tailored to meet the unique demands of any project, big or small.</p>
      </header>

      <div className="services-grid">
        {services.map((service, index) => (
          <div className="service-card" key={index}>
            <div className="service-icon">{service.icon}</div>
            <h3>{service.title}</h3>
            <p>{service.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServicesPage;