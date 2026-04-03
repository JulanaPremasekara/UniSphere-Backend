const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');
const jwt = require('jsonwebtoken');

// Middleware to protect routes
const authenticateToken = require('../middleware/auth');

router.post('/login', UserController.login);
router.post('/signup', UserController.signup);
// Private/Protected route
router.get('/me', authenticateToken, UserController.getProfile);
router.put('/update', authenticateToken, UserController.updateProfile);
router.delete('/', authenticateToken, UserController.deleteAccount);

module.exports = router;