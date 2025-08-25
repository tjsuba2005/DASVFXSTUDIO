// src/App.js


// Make sure to import HashRouter here
import { HashRouter, Routes, Route } from 'react-router-dom';
// Import your Layout component
import Layout from './components/Layout'; 

// Import all your page components
import HomePage from './pages/HomePage';
import PortfolioPage from './pages/PortfolioPage';
import ServicesPage  from './pages/ServicesPage';
import ContactPage from './pages/ContactPage';
import AboutUs from './pages/AboutUs';
import NotFoundPage from './pages/NotFoundPage';

// Import the component for handling the auth callback
import AuthSuccessPage from './pages/AuthSuccessPage.jsx';

// --- NEW IMPORTS FOR ERROR BOUNDARY DEMO ---
import ErrorBoundary from './pages/ErrorBoundary.jsx';
import BuggyCounter from './components/BuggyCounter';
// ------------------------------.-------------

function App() {
  
  return (
    <HashRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
    <Routes>
      {/* This main route uses your Layout for all nested pages */}
      {/* Because the ErrorBoundary is inside this route, if a page crashes, the Layout (nav/footer) will remain visible. */}
      <Route path="/" element={<Layout/>}>
        <Route index element={<HomePage />} />
        <Route path="portfolio" element={<PortfolioPage />} />
        <Route path="services" element={<ServicesPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="aboutus" element={<AboutUs />} />
        
        {/* Route for the Google Auth callback */}
        <Route path="auth-success" element={<AuthSuccessPage />} />

        {/* --- NEW ROUTE TO TEST THE ERROR BOUNDARY --- */}
        {/* 
          Navigate to /buggy to see this in action.
          The BuggyCounter component will crash, but the ErrorBoundary will catch it
          and display a fallback UI. The main Layout (nav, footer, etc.) will not be affected.
          
          You can add a <Link to="/buggy">Test Error</Link> in your Layout component to easily navigate here.
        */}
        <Route 
          path="buggy" 
          element={
            <ErrorBoundary>
              <BuggyCounter />
            </ErrorBoundary>
          } 
        />
        {/* --------------------------------------------- */}
        
        {/* This is the catch-all route for any undefined paths */}
        <Route path="*" element={<NotFoundPage/>} />
      </Route>
    </Routes>
  </HashRouter>
  );
}

export default App;