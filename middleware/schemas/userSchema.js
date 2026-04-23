const { z } = require('zod');

const registerUserSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional().or(z.literal('')),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  year: z.string().optional(),
  major: z.string().optional(),
});

const loginUserSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

const updateUserSchema = z.object({
  name: z.string().optional(),
  phone: z.string().optional().or(z.literal('')),
  year: z.string().optional(),
  major: z.string().optional(),
  password: z.string().min(6, 'Password must be at least 6 characters').optional(),
});

module.exports = {
  registerUserSchema,
  loginUserSchema,
  updateUserSchema,
};
