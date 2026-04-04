const express = require('express');
const router = express.Router();
const LostController = require('../controllers/lostController');
const authenticateToken = require('../middleware/auth');
const { createLostSchema, LostIDParamSchema } = require('../middleware/schemas/lostSchema');
const validate = require('../middleware/schemavalidate');

router.post('/', authenticateToken, validate(createLostSchema), LostController.createLost);
// router.get('/', LostController.getAllLostItems);
// router.get('/:id', validate(LostIDParamSchema, 'params'), LostController.getLostItemById);
// router.put('/:id', authenticateToken, validate(LostIDParamSchema, 'params'), validate(createLostSchema), LostController.updateLostItem);
// router.delete('/:id', authenticateToken, validate(LostIDParamSchema, 'params'), LostController.deleteLostItem);

module.exports = router;