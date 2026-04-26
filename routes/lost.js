const express = require('express');
const router = express.Router();
const LostController = require('../controllers/lostController');
const authenticateToken = require('../middleware/auth');
const { createLostSchema, LostIDParamSchema } = require('../middleware/schemas/lostSchema');
const validate = require('../middleware/schemavalidate');
const { parseImage } = require('../middleware/multer');
const { handleCloudUpload } = require('../middleware/supabaseUpload');

router.post('/', authenticateToken,parseImage('image'),handleCloudUpload('Images','LostItems'), validate(createLostSchema), LostController.createLost);
router.get('/', LostController.getAllLostItems);
router.get('/:id', validate(LostIDParamSchema, 'params'), LostController.getLostItemById);
router.put('/:id', authenticateToken, parseImage('image'), handleCloudUpload('Images','LostItems'), validate(LostIDParamSchema, 'params'), validate(createLostSchema), LostController.updateLost);
router.delete('/:id', authenticateToken, validate(LostIDParamSchema, 'params'), LostController.deleteLost);
router.patch("/:id/resolve", authenticateToken, LostController.resolveLost);


module.exports = router;


