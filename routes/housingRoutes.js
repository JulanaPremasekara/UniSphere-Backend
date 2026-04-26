const express = require('express');
const router = express.Router();
const housingController = require('../controllers/housingController');
const authenticateToken = require('../middleware/auth');
const validate = require('../middleware/schemavalidate');
const { createHousingSchema, updateHousingSchema } = require('../middleware/schemas/housingSchema');

// @route   POST /api/housing
router.post('/', authenticateToken, validate(createHousingSchema), housingController.createHousing);

// @route   GET /api/housing
router.get('/', housingController.getAllHousing);

// @route   GET /api/housing/:id
router.get('/:id', housingController.getHousingById);

// @route   PUT /api/housing/:id
router.put('/:id', authenticateToken, validate(updateHousingSchema), housingController.updateHousing);

// @route   DELETE /api/housing/:id
router.delete('/:id', authenticateToken, housingController.deleteHousing);

module.exports = router;
