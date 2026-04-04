const {z} = require('zod');

const createLostSchema = z.object({
    title:z.string().max(30,'Title must be at most 30 characters'),
    location:z.string().max(30,'Location must be at most 30 characters'),
    features:z.string().max(200,'Features must be at most 200 characters'),
    status:z.enum(['lost', 'found']),
    image:z.string().url().optional(),
});

const LostIDParamSchema = z.object({
    id:z.number().int().positive('ID must be a positive integer'),
})

module.exports = {
    createLostSchema,
    LostIDParamSchema
}