import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

/**
 * Convert a Zod schema to a prompt for LLM mock data generation
 */
export function zodSchemaToPrompt(
  schema: z.ZodType,
  context?: string
): string {
  // Convert Zod schema to JSON Schema
  const jsonSchema = zodToJsonSchema(schema as any);

  const schemaString = JSON.stringify(jsonSchema, null, 2);

  const prompt = `
Schema (JSON Schema format):
${schemaString}

${context ? `Context: ${context}` : ''}

Generate realistic mock data that adheres to this schema.
`;

  return prompt;
}
