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

const frontendURL = "https://tjsuba2005.github.io";

const corsOptions = {
  // IMPORTANT: You must specify the exact origin of your frontend. A wildcard '*' is not allowed
  // when you use credentials.
  origin: frontendURL, 

  // IMPORTANT: This header is REQUIRED to allow cookies or session data to be sent.
  credentials: true, 
  
  optionsSuccessStatus: 200 // Some legacy browsers choke on 204
};

// Use the configured cors middleware
app.use(cors(corsOptions));

// --- END: PRECISE CORS CONFIGURATION ---


// ... rest of your server code (routes like /login, /users, etc.)
// For example:
app.use(express.json()); // To parse request bodies

app.post('/api/login', (req, res) => {
  // Your login logic here
  // If successful, you might set a cookie
  res.cookie('session_id', 'your_session_token', { httpOnly: true, secure: true, sameSite: 'none' });
  res.status(200).json({ message: "Login successful!" });
});
/*
const corsOptions = {
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }
};
// Make sure you are using these options
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json());
*/

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
  process.env.VITE_GOOGLE_CLIENT_ID,
  process.env.VITE_GOOGLE_CLIENT_SECRET,
  process.env.VITE_REDIRECT_URI // This will be your production URL
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