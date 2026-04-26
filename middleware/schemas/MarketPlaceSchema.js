const { z } = require('zod');

const createMarketplaceSchema = z.object({
    title: z.string().min(3).max(100),
    price: z.string().min(1), 
    description: z.string().min(5).max(1000),
    location: z.string().optional().default('Main Campus'),
    condition: z.string().optional().default('Used'),
    contactNumber: z.string().min(10), // NEW
    image: z.string().optional().nullable(),
});

const marketplaceIDParamSchema = z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ID format'),
});

module.exports = { createMarketplaceSchema, marketplaceIDParamSchema };