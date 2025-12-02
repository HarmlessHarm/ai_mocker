import type { z } from 'zod';

/**
 * LLM Provider configuration
 */
export interface ProviderConfig {
  name: 'anthropic' | 'gemini';
  apiKey?: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

/**
 * Main AIMocker configuration
 */
export interface AIMockerConfig {
  provider: ProviderConfig;
  outputDir?: string;
  verbose?: boolean;
}

/**
 * Options for mock data generation
 */
export interface GenerationOptions<T extends z.ZodType> {
  schema: T;
  count?: number;
  context?: string;
  seed?: string;
}

/**
 * Result of mock data generation
 */
export interface GenerationResult<T> {
  data: T[];
  metadata: {
    provider: string;
    model: string;
    generatedAt: string;
    count: number;
    validationErrors?: string[];
  };
}

/**
 * Abstract LLM Provider interface
 */
export interface LLMProvider {
  name: string;
  generateMockData<T>(
    prompt: string,
    count: number,
    options?: Record<string, any>
  ): Promise<T[]>;
}

/**
 * Storage interface for persisting generated data
 */
export interface StorageProvider {
  save<T>(name: string, result: GenerationResult<T>): Promise<void>;
  load<T>(name: string): Promise<GenerationResult<T>>;
}
