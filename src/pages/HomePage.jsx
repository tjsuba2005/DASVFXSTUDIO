// src/pages/HomePage.jsx

import React from 'react';
import VideoPlayer from '../components/VideoPlayer/VideoPlayer.jsx';
import '../pages/HomePage.css';

// Showreels data remains the same
const showreels = [
  {
    id: 1,
    title: 'Showreel 2024 - Compositing & FX',
    description: 'A collection of my best compositing work, featuring seamless integration and dynamic visual effects.',
    src: '/video/showreel_01.mp4'
  },
  {
    id: 2,
    title: 'Showreel 2023 - 3D & Animation',
    description: 'Highlighting my skills in 3D modeling, texturing, and character animation for various projects.',
    src: '/video/showreel_02.mp4'
  },
   {
    id: 3,
    title: 'Showreel 2023 - 3D & Animation',
    description: 'Highlighting my skills in 3D modeling, texturing, and character animation for various projects.',
    src: '/video/showreel_03.mp4'
  },
  {
    id: 4,
    title: 'Showreel 2023 - 3D & Animation',
    description: 'Highlighting my skills in 3D modeling, texturing, and character animation for various projects.',
    src: '/video/showreel_04.mp4'
  },
  {
    id: 5,
    title: 'Showreel 2023 - 3D & Animation',
    description: 'Highlighting my skills in 3D modeling, texturing, and character animation for various projects.',
    src: '/video/showreel_05.mp4'
  },
  {
    id: 6,
    title: 'Showreel 2023 - 3D & Animation',
    description: 'Highlighting my skills in 3D modeling, texturing, and character animation for various projects.',
    src: '/video/showreel_06.mp4'
  },
  {
    id: 7,
    title: 'Showreel 2023 - 3D & Animation',
    description: 'Highlighting my skills in 3D modeling, texturing, and character animation for various projects.',
    src: '/video/showreel_07.mp4'
  },
  {
    id: 8,
    title: 'Showreel 2023 - 3D & Animation',
    description: 'Highlighting my skills in 3D modeling, texturing, and character animation for various projects.',
    src: '/video/showreel_08.mp4'
  },
  {
    id: 9,
    title: 'Showreel 2023 - 3D & Animation',
    description: 'Highlighting my skills in 3D modeling, texturing, and character animation for various projects.',
    src: '/video/showreel_09.mp4'
  },
   {
    id: 10,
    title: 'Showreel 2023 - 3D & Animation',
    description: 'Highlighting my skills in 3D modeling, texturing, and character animation for various projects.',
    src: '/video/showreel_10.mp4'
  },
    {
    id: 11,
    title: 'Showreel 2023 - 3D & Animation',
    description: 'Highlighting my skills in 3D modeling, texturing, and character animation for various projects.',
    src: '/video/showreel_11.mp4'
  },
    {
    id: 12,
    title: 'Showreel 2023 - 3D & Animation',
    description: 'Highlighting my skills in 3D modeling, texturing, and character animation for various projects.',
    src: '/video/showreel_12.mp4'
  },
   {
    id: 13,
    title: 'Showreel 2023 - 3D & Animation',
    description: 'Highlighting my skills in 3D modeling, texturing, and character animation for various projects.',
    src: '/video/showreel_13.mp4'
  },
   {
    id: 14,
    title: 'Showreel 2023 - 3D & Animation',
    description: 'Highlighting my skills in 3D modeling, texturing, and character animation for various projects.',
    src: '/video/showreel_14.mp4'
  }
  
];

const HomePage = () => {
  return (
    
      
    <div className="home-page container">     
 <section className="showreel-gallery">       
        <div className="reels-container">
          {showreels.map((reel) => (
            <article key={reel.id} className="showreel-item">
              <h3>{reel.title}</h3>           
              <VideoPlayer src={reel.src} />
            </article>
          ))}
        </div>
      </section>
      {/* ================================================================ */}
      {/* NEW 2-COLUMN SECTION: PHILOSOPHY + COMPANY PROFILE             */}
      {/* This new 'about-section' will use Flexbox to create columns.   */}
      {/* ================================================================ */}
      <section className="about-section">
        {/* --- Column 1: Philosophy --- */}
        <div className="philosophy-content">
          <h2>Our Bedrock</h2>
          <p>
            Visual effects (VFX) have evolved beyond being mere special effects; they have become an integral part of storytelling, shaping visuals and propelling narratives forward in films.
          </p>
          <p>
            For media professionals, producers, and VFX studios, choosing the right VFX partner is crucial to a project's success.
          </p>
          <p>
           DAS VFX specializes in everything from creating fantastical creatures to seamlessly enhancing live-action footage, transforming the ordinary to extraordinary.
          </p>
        </div>

        
      </section>
      {/* ================================================================ */}
      {/* SHOWREEL GALLERY SECTION                                       */}
      {/* The showreels are now wrapped in a 'reels-container' for flexbox.*/}
      {/* ================================================================ */}
     
    </div>
  );
};

export default HomePage;