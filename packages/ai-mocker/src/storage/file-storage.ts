import { promises as fs } from 'fs';
import { join } from 'path';
import type { StorageProvider, GenerationResult } from '../types';

/**
 * File-based storage for generated mock data
 */
export class FileStorage implements StorageProvider {
  private outputDir: string;

  constructor(outputDir: string = './mocks/generated') {
    this.outputDir = outputDir;
  }

  /**
   * Save generated data to JSON file
   */
  async save<T>(name: string, result: GenerationResult<T>): Promise<void> {
    // Create directory if it doesn't exist
    await fs.mkdir(this.outputDir, { recursive: true });

    const filePath = join(this.outputDir, `${name}.json`);
    const content = JSON.stringify(result, null, 2);

    await fs.writeFile(filePath, content, 'utf-8');
  }

  /**
   * Load generated data from JSON file
   */
  async load<T>(name: string): Promise<GenerationResult<T>> {
    const filePath = join(this.outputDir, `${name}.json`);

    try {
      const content = await fs.readFile(filePath, 'utf-8');
      return JSON.parse(content) as GenerationResult<T>;
    } catch (error) {
      throw new Error(
        `Failed to load mock data from ${filePath}: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }
}
