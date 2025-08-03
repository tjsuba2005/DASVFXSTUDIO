// ===================================================================
// --- Refactored & Hardened server.js ---
// ===================================================================

import dotenv from 'dotenv';
import express from 'express';
import { google } from 'googleapis';
import cors from 'cors';
import session from 'express-session';
dotenv.config();
// --- 1. Environment & Initial Setup ---

// Load environment variables from a .env file


const app = express();
const PORT = process.env.PORT || 5000;
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

// --- 2. Core Middleware ---

// Enable CORS with dynamic origin checking and credentials support
const allowedOrigins = [
  process.env.FRONTEND_URL_DEV,   // e.g., 'http://localhost:5173'
  process.env.FRONTEND_URL_PROD,  // e.g., 'https://tjsuba2005.github.io'
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('This origin is not allowed by CORS'));
    }
  },
  credentials: true, // IMPORTANT: Allows session cookies to be sent from the frontend
}));

// Parse JSON request bodies
app.use(express.json());

// Configure and enable session management
app.use(session({
  secret: process.env.SESSION_SECRET, // Secret used to sign the session ID cookie
  resave: false,                      // Don't save session if unmodified
  saveUninitialized: false,           // Don't create a session until something is stored
  cookie: {
    secure: IS_PRODUCTION,            // Use secure cookies in production (requires HTTPS)
    httpOnly: true,                   // Prevents client-side JS from reading the cookie
    maxAge: 1000 * 60 * 60 * 24,      // Cookie expires in 24 hours
  }
}));


// --- 3. Google OAuth2 Client & Scopes ---

// The redirect URI must be a BACKEND route that is authorized in Google Cloud Console
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI // e.g., http://localhost:5000/auth/google/callback
);

const scopes = [
  'https://www.googleapis.com/auth/userinfo.profile',
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/drive.readonly',
];


// --- 4. Authentication Routes ---

// Route to generate the Google Auth URL for the frontend
app.get('/auth/google', (req, res) => {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline', // Required to get a refresh token for long-term access
    prompt: 'consent',      // Good for development to always see the consent screen
    scope: scopes,
  });
  res.json({ url: authUrl });
});

// Callback route that Google redirects to after successful authentication
app.get('/auth/google/callback', async (req, res) => {
  const { code } = req.query;
  if (!code) {
    return res.status(400).send('Authentication failed: No authorization code provided.');
  }

  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // Get user profile information
    const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
    const { data: userInfo } = await oauth2.userinfo.get();

    // Store essential info in the session
    req.session.tokens = tokens;
    req.session.user = {
      name: userInfo.name,
      email: userInfo.email,
      picture: userInfo.picture,
    };

    // Save session before redirecting to prevent race conditions
    req.session.save(() => {
      // Redirect the user's browser back to the frontend application
      const frontendUrl = IS_PRODUCTION 
        ? process.env.FRONTEND_URL_PROD 
        : process.env.FRONTEND_URL_DEV;
      res.redirect(`${frontendUrl}/portfolio`);
    });

  } catch (error) {
    console.error('Error during Google OAuth callback:', error.message);
    res.status(500).redirect(`${process.env.FRONTEND_URL_DEV || '/'}/login-error`);
  }
});

// Route for the frontend to check the current user's authentication status
app.get('/api/auth/status', (req, res) => {
  if (req.session.user) {
    res.status(200).json({ isAuthenticated: true, user: req.session.user });
  } else {
    res.status(200).json({ isAuthenticated: false, user: null });
  }
});

// Route to log the user out by destroying the session
app.post('/api/auth/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: 'Logout failed. Please try again.' });
    }
    res.clearCookie('connect.sid'); // Default session cookie name
    res.status(200).json({ message: 'Logout successful' });
  });
});


// --- 5. Protected API Routes ---

// Middleware to verify if a user is authenticated
const isAuthenticated = (req, res, next) => {
  if (req.session.user) {
    return next(); // User is logged in, proceed to the route handler
  }
  res.status(401).json({ message: 'Unauthorized: You must be logged in to access this resource.' });
};

// Example protected route
app.get('/api/videos', isAuthenticated, async (req, res) => {
  try {
    // IMPORTANT: For each API call, re-hydrate the client with the session tokens
    oauth2Client.setCredentials(req.session.tokens);

    const drive = google.drive({ version: 'v3', auth: oauth2Client });
    
    // Your logic to fetch videos from Google Drive
    // const response = await drive.files.list({...});
    // const videos = response.data.files;
    
    res.json({ message: "This is a protected route. Successfully authorized to fetch videos.", videos: [] });

  } catch (error) {
    console.error("Error fetching from Google Drive API:", error.message);
    res.status(500).json({ message: "Failed to fetch data from Google Drive." });
  }
});
// In server.js

app.use(cors({
  origin: (origin, callback) => {
    // --- START DEBUGGING ---
    console.log("--- CORS CHECK ---");
    console.log("Request Origin:", origin);
    console.log("Allowed Origins:", allowedOrigins);
    // --- END DEBUGGING ---

    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      console.log("Result: Origin ALLOWED");
      callback(null, true);
    } else {
      console.log("Result: Origin BLOCKED");
      callback(new Error('This origin is not allowed by CORS'));
    }
  },
  credentials: true,
}));

// --- 6. Start Server ---

app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
  console.log(`   Mode: ${IS_PRODUCTION ? 'production' : 'development'}`);
});