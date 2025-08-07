// ===================================================================
// --- Final, Correctly Ordered, and Debuggable server.js ---
// ===================================================================

import dotenv from 'dotenv';
import express from 'express';
import { google } from 'googleapis';
import cors from 'cors';
import pg from 'pg'; 
import session from 'express-session';
import connectPgSimple from 'connect-pg-simple';

// --- 1. Environment & Initial Setup ---

// CRITICAL: Load environment variables from .env file FIRST.
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

// --- 2. Core Middleware (Order is CRITICAL) ---

// CORS must come first to handle preflight requests.
// This is the version with debugging enabled.
const allowedOrigins = [
  process.env.FRONTEND_URL_DEV,   // e.g., 'http://localhost:5173'
  process.env.FRONTEND_URL_PROD,  // e.g., 'https://tjsuba2005.github.io'
];

app.use(cors({
  origin: (origin, callback) => {
    console.log("--- CORS PREFLIGHT CHECK ---");
    console.log("Request's Origin:", origin);
    console.log("Allowed Origins:", allowedOrigins);

    if (!origin || allowedOrigins.includes(origin)) {
      console.log("Result: ✅ Origin ALLOWED");
      callback(null, true);
    } else {
      console.log("Result: ❌ Origin BLOCKED");
      callback(new Error('This origin is not allowed by CORS'));
    }
  },
  credentials: true,
}));
// Then, the body parser for JSON.
app.use(express.json());
app.set('trust proxy', 1); 
// Initialize the session store with connect-pg-simple
const PgStore = connectPgSimple(session);

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Required for Render's internal connections
  }
});

// ...

// Update your session middleware to use the new store
app.use(session({
  store: new PgStore({
    pool: pool,                // Connection pool
    tableName: 'user_sessions'   // Use a custom table name
  }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: 'auto',
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24, // 1 day
  }
}));


// --- 3. Google OAuth2 Client & Scopes ---

const oauth2Client = new google.auth.OAuth2(
  process.env.VITE_GOOGLE_CLIENT_ID,
  process.env.VITE_GOOGLE_CLIENT_SECRET,
  process.env.VITE_GOOGLE_REDIRECT_URI
);

const scopes = [
  'https://www.googleapis.com/auth/userinfo.profile',
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/drive.readonly',
];


// --- 4. Routes (Defined AFTER all middleware) ---

// Health check route
app.get('/', (req, res) => {
  res.status(200).json({ message: '✅ API Server is running!' });
});

// Route to generate the Google Auth URL
app.get('/auth/google', (req, res) => {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: scopes,
  });
  res.json({ url: authUrl });
});

// The detailed Google callback route with step-by-step logging.
app.get('/auth/google/callback', async (req, res) => {
  console.log("--- 🕵️ GOOGLE CALLBACK INITIATED ---");
  const { code } = req.query;
  if (!code) {
    console.error("❌ ERROR: No authorization code provided by Google.");
    return res.status(400).send('Authentication failed: No authorization code provided.');
  }
  console.log("✅ STEP 1: Authorization code received:", code.substring(0, 20) + "...");

  try {
    const { tokens } = await oauth2Client.getToken(code);
    console.log("✅ STEP 2: Tokens received from Google.");
    oauth2Client.setCredentials(tokens);

    const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
    const { data: userInfo } = await oauth2.userinfo.get();
    console.log("✅ STEP 3: User info received:", userInfo.email);

    req.session.tokens = tokens;
    req.session.user = {
      name: userInfo.name,
      email: userInfo.email,
      picture: userInfo.picture,
    };
    console.log("✅ STEP 4: Session object created successfully.");

    req.session.save((err) => {
      if (err) {
        console.error("❌ ERROR: FAILED TO SAVE SESSION:", err);
        return res.status(500).send('Failed to save session.');
      }
      console.log("✅ STEP 5: Session saved. Redirecting to frontend.");
      const frontendUrl = IS_PRODUCTION ? process.env.FRONTEND_URL_PROD : process.env.FRONTEND_URL_DEV;
      res.redirect(`${frontendUrl}/portfolio`);
    });
  } catch (error) {
    console.error("❌ FATAL ERROR IN GOOGLE CALLBACK:", error.response ? error.response.data : error.message);
    res.status(500).redirect(`${process.env.FRONTEND_URL_DEV || '/'}/login-error?msg=server-error`);
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
    res.clearCookie('connect.sid');
    res.status(200).json({ message: 'Logout successful' });
  });
});

// Middleware to protect routes
const isAuthenticated = (req, res, next) => {
  if (req.session.user) {
    return next();
  }
  res.status(401).json({ message: 'Unauthorized: You must be logged in to access this resource.' });
};

// Example protected API route
app.get('/api/videos', isAuthenticated, async (req, res) => {
  try {
    oauth2Client.setCredentials(req.session.tokens);
    const drive = google.drive({ version: 'v3', auth: oauth2Client });
    res.json({ message: "This is a protected route. Successfully authorized.", videos: [] });
  } catch (error) {
    console.error("Error fetching from Google Drive API:", error.message);
    res.status(500).json({ message: "Failed to fetch data from Google Drive." });
  }
});


// --- 5. Start Server (This must be the LAST thing) ---

app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
  console.log(`   Mode: ${IS_PRODUCTION ? 'production' : 'development'}`);
});