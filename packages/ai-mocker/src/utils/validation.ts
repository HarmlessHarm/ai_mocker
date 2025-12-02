import { z } from 'zod';

/**
 * Validation result containing validated data and any errors
 */
export interface ValidationResult<T> {
  valid: T[];
  errors: string[];
}

/**
 * Validate raw LLM response against a Zod schema
 */
export function validateAgainstSchema<T extends z.ZodType>(
  data: unknown[],
  schema: T
): ValidationResult<z.infer<T>> {
  const valid: z.infer<T>[] = [];
  const errors: string[] = [];

  for (let i = 0; i < data.length; i++) {
    try {
      const validated = schema.parse(data[i]);
      valid.push(validated);
    } catch (error) {
      const errorMsg =
        error instanceof z.ZodError
          ? error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ')
          : String(error);
      errors.push(`Item ${i}: ${errorMsg}`);
    }
  }

  return { valid, errors };
}
