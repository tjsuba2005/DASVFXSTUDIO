// ===================================================================
// --- Final, Hardened, and Deployable server.js ---
// ===================================================================

import dotenv from 'dotenv';
import express from 'express';
import { google } from 'googleapis';
import cors from 'cors';
import session from 'express-session';

dotenv.config();

const app = express();

// --- Middleware Setup ---

// CHANGE 1: Define allowed origins for both development and production.
// In your server.js file

const allowedOrigins = [
  'http://localhost:5173',        // Your local frontend for development
  'https://tjsuba2005.github.io'    // Your deployed frontend on GitHub Pages
];

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests if their origin is in our trusted list
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('This origin is not allowed by CORS'));
    }
  },
  credentials: true, // <-- THIS IS THE CRITICAL LINE YOU ARE MISSING
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

// Make sure you are using these options
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET, // Use a strong secret in production
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// --- Google OAuth2 Client Configuration ---

// CHANGE 2: Simplify environment variable names (no VITE_ prefix needed on backend).
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI // This will be your production URL
);

const scopes = [
  'https://www.googleapis.com/auth/drive.readonly',
  'https://www.googleapis.com/auth/drive.file',
  'https://www.googleapis.com/auth/userinfo.profile',
  'https://www.googleapis.com/auth/drive'
];

// --- Authentication Routes ---

app.get('/auth/google', (req, res) => {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: scopes,
  });
  res.json({ url: authUrl });
});

app.get('/auth/google/callback', async (req, res) => {
  const { code } = req.query;
  try {
    const { tokens } = await oauth2Client.getToken(code);
    req.session.tokens = tokens;

    oauth2Client.setCredentials(tokens);
    const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
    const { data: userInfo } = await oauth2.userinfo.get();
    req.session.user = {
        displayName: userInfo.name,
        email: userInfo.email,
        picture: userInfo.picture
    };

   req.session.save(() => {
    const frontendUrl = process.env.NODE_ENV === 'production' 
      ? 'https://tjsuba2005.github.io/DASVFXSTUDIO/portfolio' // <-- ADD /DASVFXSTUDIO/ here
      : 'http://localhost:5173/portfolio';
    res.redirect(frontendUrl);
});
  } catch (error) {
    console.error('Error getting tokens:', error.message);
    res.status(500).send('Authentication failed during callback.');
  }
});

// ... (The rest of your routes: /api/auth/status, /auth/logout, /api/videos, etc. can stay the same) ...
// ... They are well-written and will work correctly with this setup. ...

// Your isAuthenticated middleware and API routes are correct. I'm omitting them for brevity.
// Make sure to paste them back in here if you are copying this whole file.


// --- Start the Server ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    // CHANGE 4: More generic startup message suitable for production.
    console.log(`✅ Server is running on port ${PORT}`);
});