// ===================================================================
// --- Final, Hardened, and Complete server.js ---
// ===================================================================

import dotenv from 'dotenv';
import express from 'express';
import { google } from 'googleapis';
import cors from 'cors';
import session from 'express-session';

// Load environment variables from .env file
dotenv.config();

// Create the Express application
const app = express();


// --- Middleware Setup ---
// The order of middleware is very important.

// 1. Set up CORS options to be very explicit.
const corsOptions = {
  origin: 'http://localhost:5173', // Your React frontend's URL
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

// 2. Use the CORS middleware with these options.
app.use(cors(corsOptions));

// 3. Handle preflight requests for all routes.
app.options('*', cors(corsOptions));

// 4. Set up body-parser middleware.
app.use(express.json());

// 5. Set up session middleware.
app.use(session({
  secret: process.env.SESSION_SECRET || 'a-very-secret-key-for-development',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));


// --- Google OAuth2 Client Configuration ---
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.REDIRECT_URI
);
// ... top of your server.js


// --- UPDATE THIS ARRAY ---
const scopes = [
  'https://www.googleapis.com/auth/drive.readonly', // Keep this for clarity
  'https://www.googleapis.com/auth/drive.file',    // Good for file-specific operations
  'https://www.googleapis.com/auth/userinfo.profile',
  'https://www.googleapis.com/auth/drive' // <-- ADD THIS MORE GENERAL SCOPE
];



// ===================================================================
// --- Authentication Routes ---
// ===================================================================

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
        res.redirect('http://localhost:5173/portfolio');
    });
  } catch (error) {
    console.error('Error getting tokens:', error.message);
    res.status(500).send('Authentication failed during callback.');
  }
});

app.get('/api/auth/status', (req, res) => {
  if (req.session && req.session.tokens) {
    res.json({ isAuthenticated: true, user: req.session.user });
  } else {
    res.json({ isAuthenticated: false });
  }
});

app.get('/auth/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).send('Could not log out.');
        }
        res.clearCookie('connect.sid');
        res.status(200).json({ message: 'Logged out successfully' });
    });
});


// ===================================================================
// --- Protected API Routes ---
// ===================================================================

const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.tokens) {
    return next();
  }
  res.status(401).json({ error: 'Not authenticated. Please log in.' });
};

app.get('/api/videos', isAuthenticated, async (req, res) => {
  const PORTFOLIO_ROOT_FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID || '1R0frbTr4a3IMP2Jxl0rRHb_S6r5LdnmJ';

  oauth2Client.setCredentials(req.session.tokens);
  const drive = google.drive({ version: 'v3', auth: oauth2Client });

  try {
    const folderRes = await drive.files.list({
      q: `'${PORTFOLIO_ROOT_FOLDER_ID}' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false`,
      fields: 'files(id, name)',
    });

    const folderMap = new Map();
    folderRes.data.files?.forEach(folder => folderMap.set(folder.id, folder.name));
    
    const parentQueries = [`'${PORTFOLIO_ROOT_FOLDER_ID}' in parents`, ...Array.from(folderMap.keys()).map(id => `'${id}' in parents`)];
    const videoQuery = `(${parentQueries.join(' or ')}) and (mimeType contains 'video/' or mimeType contains 'image/') and trashed=false`;

    const videoRes = await drive.files.list({
      q: videoQuery,
      fields: 'files(id, name, thumbnailLink, parents)',
      pageSize: 200,
    });

    const videosWithCategory = videoRes.data.files?.map(file => ({
      id: file.id,
      name: file.name,
      thumbnailLink: file.thumbnailLink,
      category: folderMap.get(file.parents[0]) || 'DASVFX',
    })) || [];

    res.json(videosWithCategory);
  } catch (error) {
    console.error('The API returned an error:', error.message);
    res.status(500).json({ error: 'Error fetching files from Google Drive.' });
  }
});


app.get('/api/stream/:fileId', isAuthenticated, async (req, res) => {
    try {
        const { fileId } = req.params;
        oauth2Client.setCredentials(req.session.tokens);
        const drive = google.drive({ version: 'v3', auth: oauth2Client });

        const fileMetadataResponse = await drive.files.get({
            fileId: fileId,
            fields: 'size, mimeType',
        });

        res.setHeader('Content-Length', fileMetadataResponse.data.size);
        res.setHeader('Content-Type', fileMetadataResponse.data.mimeType);

        const googleResponse = await drive.files.get(
            { fileId: fileId, alt: 'media' },
            { responseType: 'stream' }
        );

        googleResponse.data.pipe(res);
    } catch (error) {
        console.error(`Error streaming file: ${error.message}`);
        res.status(500).json({ error: 'Failed to stream file.' });
    }
});


// --- Start the Server ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server started successfully on http://localhost:${PORT}`));