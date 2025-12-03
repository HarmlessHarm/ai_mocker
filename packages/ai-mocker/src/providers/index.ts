import type { LLMProvider, ProviderConfig } from '../types';
import { AnthropicProvider } from './anthropic';
import { GeminiProvider } from './gemini';

/**
 * Create a provider instance based on configuration
 */
export function createProvider(config: ProviderConfig): LLMProvider {
  switch (config.name) {
    case 'anthropic':
      return new AnthropicProvider(config);
    case 'gemini':
      return new GeminiProvider(config);
    default:
      // This should never happen due to TypeScript's discriminated union
      const exhaustiveCheck: never = config;
      throw new Error(`Unknown provider: ${exhaustiveCheck}`);
  }
}

export { AnthropicProvider } from './anthropic';
export { GeminiProvider } from './gemini';
export { BaseLLMProvider } from './base';
