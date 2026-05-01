const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');
const authenticateToken = require('../middleware/auth');
const validate = require('../middleware/schemavalidate');
const { registerUserSchema, loginUserSchema, updateUserSchema } = require('../middleware/schemas/userSchema');
const { parseImage } = require('../middleware/multer');
const { handleCloudUpload } = require('../middleware/supabaseUpload');

router.post('/login', validate(loginUserSchema), UserController.login);
router.post('/signup', validate(registerUserSchema), UserController.signup);
router.get('/me', authenticateToken, UserController.getProfile);
router.put('/update', authenticateToken, parseImage('image'), handleCloudUpload('Images', 'Profiles'), validate(updateUserSchema), UserController.updateProfile);
router.delete('/profile-image', authenticateToken, UserController.deleteProfileImage);
router.delete('/', authenticateToken, UserController.deleteAccount);
router.get('/:id', authenticateToken, UserController.getUserbyID);


module.exports = router;