import type { LLMProvider, ProviderConfig } from '../types';
import { resolveProviderConfig } from '../config';

/**
 * Abstract base class for LLM providers
 */
export abstract class BaseLLMProvider implements LLMProvider {
  abstract name: string;
  protected apiKey: string;
  protected model: string;
  protected temperature: number;
  protected maxTokens: number;

  constructor(config: ProviderConfig) {
    const resolved = resolveProviderConfig(config);
    this.apiKey = resolved.apiKey!;
    this.model = resolved.model!;
    this.temperature = resolved.temperature!;
    this.maxTokens = resolved.maxTokens!;
  }

  /**
   * Generate mock data as JSON array
   */
  abstract generateMockData<T>(
    prompt: string,
    count: number,
    options?: Record<string, any>
  ): Promise<T[]>;

  /**
   * Build a prompt for the LLM
   */
  protected buildPrompt(schemaPrompt: string, count: number): string {
    return `Generate ${count} realistic mock data objects that match this schema:

${schemaPrompt}

Requirements:
- Return ONLY a JSON array of ${count} objects
- Make the data realistic and diverse
- Follow the schema exactly
- Do not include any explanation or markdown formatting`;
  }
}
