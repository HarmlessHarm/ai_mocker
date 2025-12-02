import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import type { User } from '../schemas/user.schema';
import type { Product } from '../schemas/product.schema';

const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * Load pre-generated mock data
 */
function loadMockData<T>(filename: string): T[] {
  try {
    const filePath = join(__dirname, 'generated', `${filename}.json`);
    const content = readFileSync(filePath, 'utf-8');
    const parsed = JSON.parse(content);
    return parsed.data as T[];
  } catch (error) {
    console.error(`Failed to load ${filename}.json:`, error);
    return [];
  }
}

// Load and export mock data with proper types
export const mockUsers: User[] = loadMockData<User>('users');
export const mockProducts: Product[] = loadMockData<Product>('products');
