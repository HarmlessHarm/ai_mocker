import type { z } from 'zod';
import type {
  AIMockerConfig,
  GenerationOptions,
  GenerationResult,
  LLMProvider,
  StorageProvider,
} from './types';
import { validateConfig } from './config';
import { createProvider } from './providers';
import { FileStorage } from './storage/file-storage';
import { zodSchemaToPrompt } from './schema/zod-to-prompt';
import { validateAgainstSchema } from './utils/validation';

/**
 * Main class for generating mock data from Zod schemas using LLM APIs
 */
export class AIMocker {
  private config: AIMockerConfig;
  private provider: LLMProvider;
  private storage: StorageProvider;

  constructor(config: AIMockerConfig) {
    validateConfig(config);
    this.config = config;
    this.provider = createProvider(config.provider);
    this.storage = new FileStorage(config.outputDir || './mocks/generated');
  }

  /**
   * Generate mock data from a Zod schema
   */
  async generate<T extends z.ZodType>(
    name: string,
    options: GenerationOptions<T>
  ): Promise<GenerationResult<z.infer<T>>> {
    const { schema, count = 10, context } = options;

    if (this.config.verbose) {
      console.log(`[ai-mocker] Generating ${count} items for "${name}"...`);
    }

    // Convert schema to prompt
    const prompt = zodSchemaToPrompt(schema, context);

    // Generate raw data using LLM
    let rawData: unknown[];
    try {
      rawData = await this.provider.generateMockData(prompt, count);
    } catch (error) {
      throw new Error(
        `Failed to generate mock data: ${error instanceof Error ? error.message : String(error)}`
      );
    }

    // Validate against schema
    const { valid, errors } = validateAgainstSchema(rawData, schema);

    if (this.config.verbose && errors.length > 0) {
      console.warn(
        `[ai-mocker] Validation warnings for "${name}": ${errors.length} items failed validation`
      );
      if (errors.length <= 5) {
        errors.forEach((e) => console.warn(`  ${e}`));
      }
    }

    // Create result object
    const result: GenerationResult<z.infer<T>> = {
      data: valid,
      metadata: {
        provider: this.provider.name,
        model: this.config.provider.model || 'unknown',
        generatedAt: new Date().toISOString(),
        count: valid.length,
        validationErrors: errors.length > 0 ? errors : undefined,
      },
    };

    // Save to storage
    await this.storage.save(name, result);

    if (this.config.verbose) {
      console.log(
        `[ai-mocker] Generated ${valid.length}/${count} valid items for "${name}"`
      );
    }

    return result;
  }

  /**
   * Load pre-generated mock data
   */
  async load<T>(name: string): Promise<GenerationResult<T>> {
    if (this.config.verbose) {
      console.log(`[ai-mocker] Loading mock data for "${name}"...`);
    }

    return this.storage.load<T>(name);
  }
}
