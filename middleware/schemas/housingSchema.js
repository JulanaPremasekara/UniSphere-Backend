const { z } = require('zod');

const baseHousingSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  address: z.string().min(1, 'Address is required'),
  roomType: z.enum(['Single', 'Shared', 'Apartment']).optional(),
  rentPrice: z.number({ required_error: 'Rent price is required' }).positive(),
  deposit: z.number().nonnegative().optional(),
  availableFrom: z.string().or(z.date()).optional(),
  availabilityStatus: z.enum(['Available', 'Not Available']).optional(),
  furnished: z.boolean().optional(),
  wifi: z.boolean().optional(),
  parking: z.boolean().optional(),
  images: z.array(z.string()).min(1, 'At least one image is required'),
  contactName: z.string().min(1, 'Contact name is required'),
  contactPhone: z.string().optional(),
  contactEmail: z.string().email('Invalid email format').optional(),
});

const createHousingSchema = baseHousingSchema.refine(data => data.contactPhone || data.contactEmail, {
  message: 'At least one contact method (phone or email) is required',
  path: ['contactPhone'],
});

const updateHousingSchema = baseHousingSchema.partial();

module.exports = {
  createHousingSchema,
  updateHousingSchema,
};
