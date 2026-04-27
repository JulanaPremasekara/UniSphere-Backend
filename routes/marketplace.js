const express = require('express');
const router = express.Router();

// 1. Change the variable name to 'marketplaceController' to avoid the clash
const MarketplaceController = require('../controllers/marketplaceController');

// 2. Import your middlewares
const { parseImage } = require('../middleware/multer');
const { handleCloudUpload } = require('../middleware/supabaseUpload');
const authenticateToken = require('../middleware/auth');
const validate = require('../middleware/schemavalidate');
const { createMarketplaceSchema } = require('../middleware/schemas/MarketPlaceSchema');

// --- ROUTES ---

// GET All Items
router.get('/', MarketplaceController.getAllItems);

// POST New Item
// Note: Middleware order is CRITICAL here to avoid Validation errors
router.post('/', 
    authenticateToken,
    parseImage('image'),                               // 1. Parse multipart form
    handleCloudUpload('Images', 'MarketplaceItems'),   // 2. Upload to Supabase
    validate(createMarketplaceSchema),                 // 3. Validate req.body
    MarketplaceController.createItem                   // 4. Save to DB
);

// GET Single Item by ID
router.get('/:id', MarketplaceController.getItemById);

// UPDATE Item
router.put('/:id',
    authenticateToken, 
    parseImage('image'), 
    handleCloudUpload('Images', 'MarketplaceItems'), 
    validate(createMarketplaceSchema), 
    MarketplaceController.updateItem
);

// DELETE Item
router.delete('/:id',authenticateToken, MarketplaceController.deleteItem);

module.exports = router;
