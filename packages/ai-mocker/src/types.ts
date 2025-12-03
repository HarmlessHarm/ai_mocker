import type { z } from 'zod';

/**
 * Available Claude models
 */
export type ClaudeModel =
  | 'claude-3-5-sonnet-20241022'
  | 'claude-3-5-sonnet-20240620'
  | 'claude-3-opus-20240229'
  | 'claude-3-sonnet-20240229'
  | 'claude-3-haiku-20240307';

/**
 * Available Gemini models
 */
export type GeminiModel =
  | 'gemini-1.5-pro'
  | 'gemini-1.5-pro-002'
  | 'gemini-1.5-flash'
  | 'gemini-1.5-flash-002'
  | 'gemini-1.0-pro';

/**
 * LLM Provider configuration with typed models
 */
export type ProviderConfig =
  | {
      name: 'anthropic';
      apiKey?: string;
      model?: ClaudeModel;
      temperature?: number;
      maxTokens?: number;
    }
  | {
      name: 'gemini';
      apiKey?: string;
      model?: GeminiModel;
      temperature?: number;
      maxTokens?: number;
    };

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
