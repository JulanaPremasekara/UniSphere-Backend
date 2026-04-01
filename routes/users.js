const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');
const jwt = require('jsonwebtoken');

// Middleware to protect routes
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ success: false, message: "No token provided" });

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET || 'fallback_secret_key_123', (err, user) => {
    if (err) return res.status(403).json({ success: false, message: "Invalid token" });
    req.user = user;
    next();
  });
};

router.post('/login', UserController.login);
router.post('/signup', UserController.signup);
// Private/Protected route
router.get('/me', authenticateToken, UserController.getProfile);

module.exports = router;