import Anthropic from '@anthropic-ai/sdk';
import type { ProviderConfig } from '../types';
import { BaseLLMProvider } from './base';

/**
 * Anthropic Claude API provider
 */
export class AnthropicProvider extends BaseLLMProvider {
  name = 'anthropic';
  private client: Anthropic;

  constructor(config: ProviderConfig) {
    super(config);
    this.client = new Anthropic({
      apiKey: this.apiKey,
    });
  }

  async generateMockData<T>(
    prompt: string,
    count: number,
    _options?: Record<string, any>
  ): Promise<T[]> {
    const fullPrompt = this.buildPrompt(prompt, count);

    const message = await this.client.messages.create({
      model: this.model,
      max_tokens: this.maxTokens,
      temperature: this.temperature,
      messages: [
        {
          role: 'user',
          content: fullPrompt,
        },
      ],
    });

    // Extract text content
    const content = message.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response format from Claude');
    }

    // Parse JSON response
    try {
      const parsed = JSON.parse(content.text);
      if (!Array.isArray(parsed)) {
        throw new Error('Response is not an array');
      }
      return parsed;
    } catch (error) {
      throw new Error(`Failed to parse Claude response as JSON: ${error}`);
    }
  }
}
