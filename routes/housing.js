const express = require('express');
const router = express.Router();

const HousingController = require('../controllers/housingController');
const authenticateToken = require('../middleware/auth');
const validate = require('../middleware/schemavalidate');
const { parseImages } = require('../middleware/multer');
const { handleCloudUpload } = require('../middleware/supabaseUpload');
const parseFormData = require('../middleware/parseFormData');

const {
  createHousingSchema,
  updateHousingSchema,
  HosuingParamSchema
} = require('../middleware/schemas/housingSchema');

// 🔹 CREATE
router.post(
  '/',
  authenticateToken,
  parseImages('images',5),
  handleCloudUpload('Images', 'Housing'),

  // ✅ convert form-data types
  parseFormData({
    booleans: ['furnished', 'wifi', 'parking'],
    numbers: ['rentPrice', 'deposit']
  }),

  // ✅ convert single image → images array
  (req, res, next) => {
    if (req.body.image && !req.body.images) {
      req.body.images = [req.body.image];
      delete req.body.image;
    }
    next();
  },

  validate(createHousingSchema),
  HousingController.createHousing
);

// 🔹 GET ALL
router.get('/', HousingController.getAllHousing);

// 🔹 GET BY ID
router.get(
  '/:id',
  validate(HosuingParamSchema, 'params'),
  HousingController.getHousingById
);

// 🔹 UPDATE
router.put(
  '/:id',
  authenticateToken,
  parseImages('images',5),
  handleCloudUpload('Images', 'Housing'),

  parseFormData({
    booleans: ['furnished', 'wifi', 'parking'],
    numbers: ['rentPrice', 'deposit']
  }),

  (req, res, next) => {
    if (req.body.image && !req.body.images) {
      req.body.images = [req.body.image];
      delete req.body.image;
    }
    next();
  },

  validate(HosuingParamSchema, 'params'),
  validate(updateHousingSchema),
  HousingController.updateHousing
);

// 🔹 DELETE
router.delete(
  '/:id',
  authenticateToken,
  validate(HosuingParamSchema, 'params'),
  HousingController.deleteHousing
);

module.exports = router;