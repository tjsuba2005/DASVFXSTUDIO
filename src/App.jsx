// You no longer need to import CSS for the background here
import { Routes, Route } from 'react-router-dom';

// Import your Layout component
import Layout from './components/Layout'; 

// Import all your page components
import HomePage from './pages/HomePage';
import PortfolioPage from './pages/PortfolioPage';
import ServicesPage from './pages/ServicesPage';
import ContactPage from './pages/ContactPage';
import AboutUs from './pages/AboutUs';
import VideoPlayerPage from './pages/VideoPlayerPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout/>}>
        <Route index element={<HomePage />} />
        <Route path="portfolio" element={<PortfolioPage />} />
        <Route path="services" element={<ServicesPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="aboutus" element={<AboutUs />} />
        <Route path="video" element={<VideoPlayerPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;