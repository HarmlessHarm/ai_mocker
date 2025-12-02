import { z } from 'zod';

/**
 * User schema for generating mock user data
 */
export const UserSchema = z.object({
  id: z.string().uuid().describe('Unique user identifier'),
  name: z.string().min(1).max(100).describe('User full name'),
  email: z.string().email().describe('User email address'),
  age: z.number().int().min(18).max(100).describe('User age'),
  role: z
    .enum(['admin', 'user', 'guest'])
    .describe('User role in the system'),
  createdAt: z.string().datetime().describe('User creation timestamp'),
});

export type User = z.infer<typeof UserSchema>;
