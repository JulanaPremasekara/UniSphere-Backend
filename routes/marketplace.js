const express = require('express');
const router = express.Router();

// 1. Change the variable name to 'marketplaceController' to avoid the clash
const marketplaceController = require('../controllers/marketplaceController');

// 2. Import your middlewares
const { parseImage } = require('../middleware/multer');
const { handleCloudUpload } = require('../middleware/supabaseUpload');
const validate = require('../middleware/schemavalidate');
const { createMarketplaceSchema } = require('../middleware/schemas/marketPlaceSchema');

// --- ROUTES ---

// GET All Items
router.get('/', marketplaceController.getAllItems);

// POST New Item
// Note: Middleware order is CRITICAL here to avoid Validation errors
router.post('/', 
    parseImage('image'),                               // 1. Parse multipart form
    handleCloudUpload('Images', 'MarketplaceItems'),   // 2. Upload to Supabase
    validate(createMarketplaceSchema),                 // 3. Validate req.body
    marketplaceController.createItem                   // 4. Save to DB
);

// GET Single Item by ID
router.get('/:id', marketplaceController.getItemById);

// UPDATE Item
router.put('/:id', 
    parseImage('image'), 
    handleCloudUpload('Images', 'MarketplaceItems'), 
    validate(createMarketplaceSchema), 
    marketplaceController.updateItem
);

// DELETE Item
router.delete('/:id', marketplaceController.deleteItem);

module.exports = router;