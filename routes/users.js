const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');
const authenticateToken = require('../middleware/auth');
const validate = require('../middleware/schemavalidate');
const { registerUserSchema, loginUserSchema, updateUserSchema } = require('../middleware/schemas/userSchema');

router.post('/login', validate(loginUserSchema), UserController.login);
router.post('/signup', validate(registerUserSchema), UserController.signup);
router.get('/me', authenticateToken, UserController.getProfile);
router.put('/update', authenticateToken, validate(updateUserSchema), UserController.updateProfile);
router.delete('/', authenticateToken, UserController.deleteAccount);


module.exports = router;