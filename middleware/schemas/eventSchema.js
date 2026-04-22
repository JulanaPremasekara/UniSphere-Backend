const { z } = require('zod');

const createEventSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title too long'),
  startDate: z.string().datetime().or(z.date()),
  endDate: z.string().datetime().or(z.date()),
  location: z.string().min(1, 'Location is required'),
  description: z.string().optional(),
  tags: z.array(z.string()).optional(),
  image: z.string().url().optional().or(z.string().regex(/^data:image\//).optional()),
});

const updateEventSchema = createEventSchema.partial();

const eventIdParamSchema = z.object({
  id: z.string().regex(/^EV\d+$/, 'Invalid Event ID format'),
});

module.exports = {
  createEventSchema,
  updateEventSchema,
  eventIdParamSchema,
};
