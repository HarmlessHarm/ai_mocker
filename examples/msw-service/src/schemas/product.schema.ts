import { z } from 'zod';

/**
 * Product schema for generating mock product data
 */
export const ProductSchema = z.object({
  id: z.string().uuid().describe('Unique product identifier'),
  name: z.string().min(1).max(200).describe('Product name'),
  description: z.string().max(1000).describe('Product description'),
  price: z.number().positive().describe('Product price in USD'),
  category: z
    .enum(['electronics', 'clothing', 'books', 'food', 'home', 'sports'])
    .describe('Product category'),
  inStock: z.boolean().describe('Whether the product is in stock'),
  rating: z
    .number()
    .min(0)
    .max(5)
    .describe('Product rating from 0-5'),
  createdAt: z.string().datetime().describe('Product creation timestamp'),
});

export type Product = z.infer<typeof ProductSchema>;
