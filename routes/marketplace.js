const express = require('express');
const router = express.Router();
const marketplaceController = require('../controllers/marketplaceController');
const authenticateToken = require('../middleware/auth');
const validate = require('../middleware/schemavalidate');
const { parseImage } = require('../middleware/multer');
const { handleCloudUpload } = require('../middleware/supabaseUpload');
const { createMarketplaceSchema, marketplaceIDParamSchema } = require('../middleware/schemas/marketPlaceSchema');

// Horizontal Route Definitions
router.get('/', marketplaceController.getAllItems);
router.post('/', authenticateToken, parseImage('image'), handleCloudUpload('Images', 'MarketplaceItems'), validate(createMarketplaceSchema), marketplaceController.createItem);
router.get('/:id', validate(marketplaceIDParamSchema, 'params'), marketplaceController.getItemById);
router.put('/:id', authenticateToken, parseImage('image'), handleCloudUpload('Images', 'MarketplaceItems'), validate(marketplaceIDParamSchema, 'params'), validate(createMarketplaceSchema), marketplaceController.updateItem);
router.delete('/:id', authenticateToken, validate(marketplaceIDParamSchema, 'params'), marketplaceController.deleteItem);

module.exports = router;