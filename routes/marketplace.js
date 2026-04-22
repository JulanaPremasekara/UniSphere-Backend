const express = require('express');
const router = express.Router();
const marketplaceController = require('../controllers/marketplaceController');


// URL: /api/marketplace
router.get('/', marketplaceController.getAllItems);
router.post('/', marketplaceController.createItem); // NEW: Create

// URL: /api/marketplace/:id
router.get('/:id', marketplaceController.getItemById); // NEW: Get Specific
router.put('/:id', marketplaceController.updateItem);
// Backend: routes/marketplace.js
// URL: /api/marketplace/:id
router.get('/:id', marketplaceController.getItemById);
router.put('/:id', marketplaceController.updateItem);
router.delete('/:id', marketplaceController.deleteItem); // Simple & Clean

module.exports = router;

module.exports = router;