import { z } from 'zod';

/**
 * Convert a Zod schema to a prompt for LLM mock data generation
 */
export function zodSchemaToPrompt(
  schema: z.ZodType,
  context?: string
): string {
  // Use Zod v4's native toJSONSchema support
  const jsonSchema = z.toJSONSchema(schema);

  const schemaString = JSON.stringify(jsonSchema, null, 2);

  const prompt = `
Schema (JSON Schema format):
${schemaString}

${context ? `Context: ${context}` : ''}

Generate realistic mock data that adheres to this schema.
`;

  return prompt;
}
