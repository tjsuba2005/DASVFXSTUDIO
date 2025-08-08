// ===================================================================
// --- Final, Corrected, and Production-Ready server.js ---
// ===================================================================

// --- 1. Imports (Using modern ES Modules ONLY) ---
import dotenv from 'dotenv';
import express from 'express';
import { google } from 'googleapis';
import cors from 'cors';
import pg from 'pg';
import session from 'express-session';
import connectPgSimple from 'connect-pg-simple';

// --- 2. Environment & Initial Setup ---
dotenv.config(); // Load environment variables from .env file

const app = express();
const PORT = process.env.PORT || 5000;
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

// --- 3. Core Middleware (Order is CRITICAL) ---

// BEST PRACTICE: Use an environment variable for the frontend URL
const corsOptions = {
  origin: process.env.FRONTEND_URL, // This must be set in your Render environment
  methods: "GET,POST,PUT,DELETE",
  credentials: true,
};
app.use(cors(corsOptions));

// This middleware allows us to parse JSON bodies in requests
app.use(express.json());

// CRITICAL FIX: Trust the first proxy. Essential for Render/Heroku environments
// so that `req.secure` is correctly set for cookies.
app.set('trust proxy', 1);

// Setup for persistent sessions stored in PostgreSQL
const PgStore = connectPgSimple(session);
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  // Required for connecting to managed databases like on Render/Heroku
  ssl: IS_PRODUCTION ? { rejectUnauthorized: false } : false,
});

app.use(session({
  store: new PgStore({
    pool: pool,
    tableName: 'user_sessions', // Name of the table to store sessions
  }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: IS_PRODUCTION, // Cookie is only sent over HTTPS in production
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
  },
}));

// --- 4. Google OAuth2 Client & Scopes ---

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI // This is the /auth/google/callback route on THIS server
);

const scopes = [
  'https://www.googleapis.com/auth/userinfo.profile',
  'https://www.googleapis.com/auth/userinfo.email',
];

// --- 5. Routes (Defined AFTER all middleware) ---

// Health check route
app.get('/', (req, res) => {
  res.status(200).json({ message: '✅ API Server is running!' });
});

// Route to initiate Google authentication
app.get('/auth/google', (req, res) => {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: scopes,
  });
  // This correctly redirects the user's browser to Google
  res.redirect(authUrl);
});

// The Google callback route that Google redirects back to
app.get('/auth/google/callback', async (req, res) => {
  const { code } = req.query;
  if (!code) {
    return res.status(400).send('Authentication failed: No code provided.');
  }

  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
    const { data: userInfo } = await oauth2.userinfo.get();

    // In a real app, you would find or create a user in your database here.
    // We'll save the user info directly to the session.
    req.session.user = {
      name: userInfo.name,
      email: userInfo.email,
      picture: userInfo.picture,
    };

    // Use .save() to ensure session is saved before redirecting
    req.session.save((err) => {
      if (err) {
        console.error("ERROR: FAILED TO SAVE SESSION:", err);
        return res.status(500).send('Failed to save session.');
      }
      // Redirect back to the frontend after successful login
      res.redirect(process.env.FRONTEND_URL);
    });

  } catch (error) {
    console.error("FATAL ERROR IN GOOGLE CALLBACK:", error.message);
    // Redirect to the frontend with an error flag
    res.redirect(`${process.env.FRONTEND_URL}/?error=auth_failed`);
  }
});

// Route to check authentication status from the frontend
app.get('/api/auth/status', (req, res) => {
  if (req.session.user) {
    res.status(200).json({ isAuthenticated: true, user: req.session.user });
  } else {
    // It's not an error to be unauthenticated, just return status false
    res.status(200).json({ isAuthenticated: false, user: null });
  }
});

// Route to log out
app.post('/api/auth/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: 'Logout failed.' });
    }
    res.clearCookie('connect.sid'); // The default session cookie name
    res.status(200).json({ message: 'Logout successful' });
  });
});

// --- 6. Start Server ---
app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
  console.log(`   Mode: ${IS_PRODUCTION ? 'production' : 'development'}`);
});