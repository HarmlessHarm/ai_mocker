# 🤖 ai-mocker

Generate mock data from Zod schemas using LLM APIs (Claude, Gemini, etc.)

## Features

- **Type-Safe**: Leverage Zod schemas for both generation and validation
- **Provider Agnostic**: Supports Anthropic Claude, Google Gemini, easily extensible
- **Build-Time Generation**: Generate mock data once, use it forever (no runtime API costs)
- **Validation**: Automatically validates LLM responses against your schemas
- **Simple API**: One-liner to generate mock data
- **Full TypeScript Support**: Complete type inference from Zod schemas

## Installation

```bash
npm install ai-mocker zod
```

## Quick Start

### 1. Define Your Schema

```typescript
import { z } from 'zod';

export const UserSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  email: z.string().email(),
  age: z.number().int().min(18).max(100),
  role: z.enum(['admin', 'user', 'guest']),
  createdAt: z.string().datetime(),
});

export type User = z.infer<typeof UserSchema>;
```

### 2. Generate Mock Data

```typescript
import { AIMocker } from 'ai-mocker';
import { UserSchema } from './schemas';

const mocker = new AIMocker({
  provider: {
    name: 'anthropic',
    apiKey: process.env.ANTHROPIC_API_KEY,
  },
  outputDir: './mocks/generated',
  verbose: true,
});

// Generate mock data
const result = await mocker.generate('users', {
  schema: UserSchema,
  count: 20,
  context: 'Generate diverse user profiles for a SaaS application',
});

console.log(result.data); // Array of 20 valid User objects
```

### 3. Use Generated Data

```typescript
// Later, load the pre-generated data
const { data: users } = await mocker.load<User>('users');

// Use in your API mocks, tests, etc.
console.log(users[0].name); // Fully typed!
```

## Configuration

### AIMockerConfig

```typescript
interface AIMockerConfig {
  provider: {
    name: 'anthropic' | 'gemini';
    apiKey?: string;        // Defaults to env variables
    model?: string;         // Uses provider default
    temperature?: number;   // 0-1 (default: 0.7)
    maxTokens?: number;     // (default: 4096)
  };
  outputDir?: string;       // Where to save generated data (default: './mocks/generated')
  verbose?: boolean;        // Enable logging (default: false)
}
```

### Environment Variables

```bash
# For Anthropic Claude
ANTHROPIC_API_KEY=sk-ant-...

# For Google Gemini
GEMINI_API_KEY=...
```

## API Reference

### AIMocker Class

#### Constructor

```typescript
const mocker = new AIMocker(config: AIMockerConfig);
```

#### generate()

Generate mock data from a Zod schema.

```typescript
async generate<T extends z.ZodType>(
  name: string,
  options: GenerationOptions<T>
): Promise<GenerationResult<z.infer<T>>>
```

**Parameters:**
- `name`: Identifier for the generated data (used as filename)
- `options.schema`: Zod schema to generate data for
- `options.count`: Number of items to generate (default: 10)
- `options.context`: Additional context for the LLM (optional)
- `options.seed`: Seed for reproducibility (optional)

**Returns:** GenerationResult with data array and metadata

**Example:**

```typescript
const result = await mocker.generate('users', {
  schema: UserSchema,
  count: 50,
  context: 'Generate realistic user profiles with diverse demographics',
});

console.log(result.data);        // User[]
console.log(result.metadata);    // { provider, model, generatedAt, count, validationErrors }
```

#### load()

Load pre-generated mock data.

```typescript
async load<T>(name: string): Promise<GenerationResult<T>>
```

**Parameters:**
- `name`: Identifier of the data to load

**Returns:** Previously generated data and metadata

**Example:**

```typescript
const { data, metadata } = await mocker.load<User>('users');
console.log(data.length); // Number of items
console.log(metadata.generatedAt); // When it was generated
```

## Providers

### Anthropic Claude

Uses the Claude API for generation. Excellent for structured data generation.

```typescript
const mocker = new AIMocker({
  provider: {
    name: 'anthropic',
    apiKey: process.env.ANTHROPIC_API_KEY,
    model: 'claude-3-5-sonnet-20241022', // default
    temperature: 0.7,
  },
});
```

### Google Gemini

Uses the Google Gemini API with native JSON mode.

```typescript
const mocker = new AIMocker({
  provider: {
    name: 'gemini',
    apiKey: process.env.GEMINI_API_KEY,
    model: 'gemini-1.5-pro', // default
  },
});
```

## Advanced Usage

### Custom Provider

Implement the `LLMProvider` interface to support other LLM APIs:

```typescript
import { BaseLLMProvider, LLMProvider } from 'ai-mocker';

class MyProvider extends BaseLLMProvider {
  name = 'my-provider';

  async generateMockData<T>(
    prompt: string,
    count: number,
    options?: Record<string, any>
  ): Promise<T[]> {
    // Your implementation
  }
}

// Use it
const mocker = new AIMocker({
  provider: { name: 'my-provider' },
});
```

### Schema Conversion

Convert Zod schemas to JSON Schema for inspection:

```typescript
import { zodSchemaToPrompt } from 'ai-mocker';

const prompt = zodSchemaToPrompt(UserSchema, 'Additional context here');
console.log(prompt); // See how the schema is formatted for LLM
```

### Validation

Validate raw data against a schema:

```typescript
import { validateAgainstSchema } from 'ai-mocker';

const rawData = [{ id: 'abc', name: 'John', email: 'john@example.com', ... }];
const { valid, errors } = validateAgainstSchema(rawData, UserSchema);

console.log(valid);  // Validated items
console.log(errors); // Validation errors
```

## Data Format

Generated data is saved as JSON with metadata:

```json
{
  "data": [
    { "id": "...", "name": "...", ... },
    { "id": "...", "name": "...", ... }
  ],
  "metadata": {
    "provider": "anthropic",
    "model": "claude-3-5-sonnet-20241022",
    "generatedAt": "2025-12-02T21:00:00Z",
    "count": 20,
    "validationErrors": []
  }
}
```

## Performance Tips

1. **Batch Generation**: Generate larger counts in one call (faster, cheaper)
2. **Reuse Data**: Generate once, load many times
3. **Cache Results**: Use version control for generated data
4. **Adjust Temperature**: Lower temperature (0.3-0.5) for consistency, higher (0.8-1.0) for variety

## Error Handling

```typescript
try {
  const result = await mocker.generate('users', {
    schema: UserSchema,
    count: 100,
  });
} catch (error) {
  if (error instanceof Error) {
    console.error('Generation failed:', error.message);
  }
}
```

## Types

All types are fully exported and can be imported:

```typescript
import type {
  AIMockerConfig,
  ProviderConfig,
  GenerationOptions,
  GenerationResult,
  LLMProvider,
  StorageProvider,
} from 'ai-mocker';
```

## FAQ

**Q: Will this incur API costs every time I run my app?**
A: No! Data is generated at build time and saved to JSON files. Runtime uses cached data.

**Q: What if the LLM generates invalid data?**
A: Invalid items are filtered out and errors are reported. You'll see how many items passed validation.

**Q: Can I use this in production?**
A: This POC uses pre-generated data, so yes - there are no runtime API dependencies.

**Q: How do I integrate with MSW.js?**
A: Load the generated data and use it in your MSW handlers. See the examples/ folder.

**Q: Can I control randomness?**
A: Set the `temperature` parameter (0-1). Lower = more consistent, higher = more varied.

## License

MIT
