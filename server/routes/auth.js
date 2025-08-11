import express from 'express';
import passport from 'passport';

const router = express.Router();

// ROUTE 1: The route that starts the Google login flow
// This is the one that's currently missing.
// When a user visits /api/auth/google, passport takes over and redirects to Google.
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);


// ROUTE 2: The callback route that Google redirects to after successful login
// Passport handles the token exchange and then we decide where to redirect the user.
router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: 'http://localhost:5173/login-failed', // Your frontend failure page
    successRedirect: 'http://localhost:5173/dashboard',   // Your frontend success page
  })
);

// ROUTE 3: A route to check the current auth status
router.get('/status', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ isAuthenticated: true, user: req.user });
  } else {
    res.json({ isAuthenticated: false, user: null });
  }
});

// ROUTE 4: The logout route
router.post('/logout', (req, res, next) => {
  req.logout(function(err) {
    if (err) { return next(err); }
    // Optionally destroy the session
    req.session.destroy(() => {
        res.clearCookie('connect.sid'); // Clear the session cookie
        res.status(200).json({ message: 'Logged out successfully' });
    });
  });
});


export default router;