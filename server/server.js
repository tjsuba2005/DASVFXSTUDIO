// ===================================================================
// --- Final, Correctly Ordered, and Production-Ready server.js ---
// ===================================================================

import dotenv from 'dotenv';
import express from 'express';
import { google } from 'googleapis';
import cors from 'cors';
import pg from 'pg';
import session from 'express-session';
import connectPgSimple from 'connect-pg-simple';

// --- 1. Environment & Initial Setup ---
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

// --- 2. Core Middleware (Order is CRITICAL) ---
// 2. Define your CORS options

// UPDATED: Simplified and more reliable CORS configuration.
const corsOptions = {
origin: 'https://dasvfxstudio-git-main-subas-projects-4f8c0026.vercel.app',
  methods: "GET,POST,PUT,DELETE", // Allowed HTTP methods
  credentials: true,
};
app.use(cors(corsOptions));

app.use(express.json());
app.set('trust proxy', 1); // Essential for Render/Heroku proxy environments

// Setup for persistent sessions stored in PostgreSQL
const PgStore = connectPgSimple(session);
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: IS_PRODUCTION ? { rejectUnauthorized: false } : false, // SSL is required for production DB connections
});

app.use(session({
  store: new PgStore({
    pool: pool,
    tableName: 'user_sessions',
  }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: IS_PRODUCTION, // FIX: Use boolean true in production, false in development
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
  },
}));

// --- 3. Google OAuth2 Client & Scopes ---

// FIX: Using correct environment variables for the backend (no VITE_ prefix)
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

const scopes = [
  'https://www.googleapis.com/auth/userinfo.profile',
  'https://www.googleapis.com/auth/userinfo.email',
];

// --- 4. Routes (Defined AFTER all middleware) ---

// Health check route
app.get('/', (req, res) => {
  res.status(200).json({ message: '✅ API Server is running!' });
});

// FIX: Simplified route to directly redirect to Google's auth page
app.get('/auth/google', (req, res) => {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: scopes,
  });
  res.redirect(authUrl);
});

// The Google callback route
app.get('/auth/google/callback', async (req, res) => {
  const { code } = req.query;
  if (!code) {
    return res.status(400).send('Authentication failed: No authorization code provided.');
  }

  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
    const { data: userInfo } = await oauth2.userinfo.get();

    // In a real app, you would find or create a user in your database here.
    // For now, we'll save the user info directly to the session.
    req.session.tokens = tokens;
    req.session.user = {
      name: userInfo.name,
      email: userInfo.email,
      picture: userInfo.picture,
    };

    req.session.save((err) => {
      if (err) {
        console.error("ERROR: FAILED TO SAVE SESSION:", err);
        return res.status(500).send('Failed to save session.');
      }
      // Redirect back to the frontend's portfolio page after successful login
      const frontendUrl = IS_PRODUCTION ? process.env.FRONTEND_URL_PROD : process.env.FRONTEND_URL_DEV;
      res.redirect(frontendUrl);
    });
  } catch (error) {
    console.error("FATAL ERROR IN GOOGLE CALLBACK:", error.message);
    const frontendUrl = IS_PRODUCTION ? process.env.FRONTEND_URL_PROD : process.env.FRONTEND_URL_DEV;
    res.redirect(`${frontendUrl}/?error=auth_failed`);
  }
});

// Route to check authentication status
app.get('/api/auth/status', (req, res) => {
  if (req.session.user) {
    res.status(200).json({ isAuthenticated: true, user: req.session.user });
  } else {
    res.status(200).json({ isAuthenticated: false, user: null });
  }
});

// Route to log out
app.post('/api/auth/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: 'Logout failed. Please try again.' });
    }
    // The session cookie is managed by the store, but clearing it on the client is good practice.
    res.clearCookie('connect.sid');
    res.status(200).json({ message: 'Logout successful' });
  });
});

// --- 5. Start Server ---
app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
  console.log(`   Mode: ${IS_PRODUCTION ? 'production' : 'development'}`);
});