import type { ProviderConfig, AIMockerConfig } from './types';

/**
 * Merge user config with environment variables
 */
export function resolveProviderConfig(config: ProviderConfig): ProviderConfig {
  const { name, apiKey, model, temperature, maxTokens } = config;

  // Determine API key source
  let resolvedApiKey = apiKey;
  if (!resolvedApiKey) {
    if (name === 'anthropic') {
      resolvedApiKey = process.env.ANTHROPIC_API_KEY;
    } else if (name === 'gemini') {
      resolvedApiKey = process.env.GEMINI_API_KEY;
    }
  }

  if (!resolvedApiKey) {
    throw new Error(
      `API key not found for provider "${name}". Set environment variable or provide apiKey in config.`
    );
  }

  // Determine default model
  let resolvedModel = model;
  if (!resolvedModel) {
    if (name === 'anthropic') {
      resolvedModel = 'claude-3-5-sonnet-20241022';
    } else if (name === 'gemini') {
      resolvedModel = 'gemini-1.5-pro';
    }
  }

  return {
    name,
    apiKey: resolvedApiKey,
    model: resolvedModel,
    temperature: temperature ?? 0.7,
    maxTokens: maxTokens ?? 4096,
  };
}

/**
 * Validate configuration
 */
export function validateConfig(config: AIMockerConfig): void {
  if (!config.provider) {
    throw new Error('Provider configuration is required');
  }

  const validProviders: ProviderConfig['name'][] = ['anthropic', 'gemini'];
  if (!validProviders.includes(config.provider.name)) {
    throw new Error(
      `Invalid provider "${config.provider.name}". Must be one of: ${validProviders.join(', ')}`
    );
  }
}
