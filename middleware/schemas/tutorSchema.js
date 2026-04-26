const { z } = require('zod');

// Schema for creating/updating a tutor profile
const createTutorSchema = z.object({
    name: z.string()
        .min(2, 'Name is too short')
        .max(50, 'Name must be at most 50 characters'),
    
    subject: z.string()
        .min(2, 'Subject is required')
        .max(40, 'Subject must be at most 40 characters'),
    
    phone: z.string()
        .min(10, 'Phone number must be at least 10 characters')
        .max(15, 'Phone number is too long'),
    
    price: z.string()
        .min(1, 'Price is required')
        .max(20, 'Price format is too long'),
    
    bio: z.string()
        .max(500, 'Bio must be at most 500 characters')
        .optional(),

    // NEW: Allow the image URL string injected by Supabase middleware
    image: z.string()
        .url('Invalid image URL format')
        .optional()
        .or(z.literal('')), // Allows empty string if no image is uploaded

    // IMPROVED: Handle string-to-boolean conversion for FormData
    isOnline: z.preprocess(
        (val) => val === 'true' || val === true, 
        z.boolean()
    ).optional(),
    
    rating: z.number()
        .min(0)
        .max(5)
        .optional()
});

// Schema for validating the MongoDB ID in params (e.g., /tutors/:id)
const TutorIDParamSchema = z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Tutor ID format'),
});

// Schema for updating the status only
const updateStatusSchema = z.object({
    isOnline: z.preprocess(
        (val) => val === 'true' || val === true, 
        z.boolean({ required_error: "Status is required" })
    ),
});

module.exports = {
    createTutorSchema,
    TutorIDParamSchema,
    updateStatusSchema
};