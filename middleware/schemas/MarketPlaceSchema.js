const { z } = require('zod');

const createMarketplaceSchema = z.object({
    title: z.string()
        .min(3, 'Title must be at least 3 characters')
        .max(50, 'Title must be at most 50 characters'),
    
    // Price is sent as a string from the frontend, so we refine it
    price: z.string()
        .regex(/^\d+(\.\d{1,2})?$/, 'Price must be a valid number (e.g., 10.99)'),
    
    description: z.string()
        .min(10, 'Description should be more detailed')
        .max(500, 'Description must be at most 500 characters'),
    
    location: z.string()
        .max(30, 'Location name is too long')
        .default('Main Campus'),
    
    condition: z.enum(['New', 'Used', 'Like New'])
        .default('Used'),
    
    // Image is optional but must be a valid URL (Supabase URL)
    image: z.string().url('Invalid image URL').optional().nullable(),
});

const MarketplaceIDParamSchema = z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid MongoDB ID format'),
});

module.exports = {
    createMarketplaceSchema,
    MarketplaceIDParamSchema
};