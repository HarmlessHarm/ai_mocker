import { GoogleGenerativeAI } from '@google/generative-ai';
import type { ProviderConfig } from '../types';
import { BaseLLMProvider } from './base';

/**
 * Google Gemini API provider
 */
export class GeminiProvider extends BaseLLMProvider {
  name = 'gemini';
  private client: GoogleGenerativeAI;

  constructor(config: ProviderConfig) {
    super(config);
    this.client = new GoogleGenerativeAI(this.apiKey);
  }

  async generateMockData<T>(
    prompt: string,
    count: number,
    _options?: Record<string, any>
  ): Promise<T[]> {
    const fullPrompt = this.buildPrompt(prompt, count);

    const model = this.client.getGenerativeModel({
      model: this.model,
      generationConfig: {
        temperature: this.temperature,
        maxOutputTokens: this.maxTokens,
        responseMimeType: 'application/json',
      },
    });

    const result = await model.generateContent(fullPrompt);
    const response = result.response.text();

    // Parse JSON response
    try {
      const parsed = JSON.parse(response);
      if (!Array.isArray(parsed)) {
        throw new Error('Response is not an array');
      }
      return parsed;
    } catch (error) {
      throw new Error(`Failed to parse Gemini response as JSON: ${error}`);
    }
  }
}
