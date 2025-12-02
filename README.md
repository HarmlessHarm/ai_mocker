# 🤖 AI Mocker POC

Generate realistic mock data from Zod schemas using LLM APIs, ready for use with MSW.js (Mock Service Worker).

This POC demonstrates how to:
- Define data schemas using Zod
- Generate mock data using Anthropic Claude or Google Gemini APIs
- Pre-generate at build time (no runtime API costs)
- Serve mocked data via MSW.js
- Use type-safe API clients in a Vue.js application

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- pnpm (recommended) or npm
- API key for Anthropic Claude or Google Gemini

### Installation

```bash
# Install dependencies
pnpm install

# Copy .env file and add your API keys
cp .env.example .env
# Edit .env and add ANTHROPIC_API_KEY or GEMINI_API_KEY
```

### Generate Mock Data

```bash
# Generate mock users and products
pnpm generate:mocks
```

This script will:
1. Use the defined Zod schemas
2. Call your configured LLM provider
3. Validate responses against schemas
4. Save JSON files to `examples/msw-service/src/mocks/generated/`

### Run the Vue App

```bash
# Start development server
pnpm --filter vue-app dev
```

Open http://localhost:5173 in your browser. You'll see:
- A list of generated users
- A grid of generated products
- All data served by MSW.js (no real API calls)

## 📁 Project Structure

```
ai_mocker/
├── packages/
│   └── ai-mocker/           # Core package for LLM-based mock generation
│       ├── src/
│       │   ├── types.ts      # Core type definitions
│       │   ├── config.ts     # Configuration handling
│       │   ├── generator.ts  # Main AIMocker class
│       │   ├── providers/    # LLM provider implementations
│       │   ├── schema/       # Zod schema utilities
│       │   ├── storage/      # File storage for generated data
│       │   └── utils/        # Helper utilities
│       └── ...
│
├── examples/
│   ├── msw-service/         # MSW service with generated data
│   │   ├── src/
│   │   │   ├── schemas/     # Zod schemas for User and Product
│   │   │   ├── handlers/    # MSW request handlers
│   │   │   ├── mocks/       # Generated mock data
│   │   │   └── browser.ts   # MSW worker setup
│   │   ├── scripts/
│   │   │   └── generate-mocks.ts  # Generation script
│   │   └── ...
│   │
│   └── vue-app/             # Vue.js demo application
│       ├── src/
│       │   ├── api/         # Typed API client
│       │   ├── components/  # Vue components
│       │   ├── main.ts      # App entry point with MSW setup
│       │   └── style.css    # Global styles
│       └── ...
│
└── ...
```

## 🎯 How It Works

### 1. Define Schemas

Create Zod schemas that describe your data:

```typescript
import { z } from 'zod';

export const UserSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  email: z.string().email(),
  // ... more fields
});
```

### 2. Generate Mock Data

Use the `AIMocker` class to generate data:

```typescript
import { AIMocker } from 'ai-mocker';

const mocker = new AIMocker({
  provider: {
    name: 'anthropic', // or 'gemini'
  },
  verbose: true,
});

await mocker.generate('users', {
  schema: UserSchema,
  count: 20,
  context: 'Generate diverse user profiles for a SaaS app',
});
```

### 3. Use with MSW.js

Load pre-generated data in your handlers:

```typescript
import { mockUsers } from '../mocks/data';
import { http, HttpResponse } from 'msw';

export const userHandlers = [
  http.get('/api/users', () => {
    return HttpResponse.json(mockUsers);
  }),
];
```

### 4. Consume in Frontend

Use the typed API client:

```typescript
import { fetchUsers } from '../api/client';

const users = await fetchUsers(); // Fully typed!
```

## 🔑 Environment Variables

```bash
# LLM Provider API Keys
ANTHROPIC_API_KEY=sk-ant-...
GEMINI_API_KEY=...

# Which provider to use (msw-service)
PROVIDER=anthropic
```

## 📦 Supported LLM Providers

- **Anthropic Claude** (`claude-3-5-sonnet-20241022`)
  - Most capable, great for structured data
  - Set `ANTHROPIC_API_KEY`

- **Google Gemini** (`gemini-1.5-pro`)
  - Good quality, native JSON mode
  - Set `GEMINI_API_KEY`

## 🔄 Development Workflow

1. **Edit schemas** in `examples/msw-service/src/schemas/`
2. **Run generation** with `pnpm generate:mocks`
3. **Check generated files** in `examples/msw-service/src/mocks/generated/`
4. **Update handlers** if needed
5. **Test in Vue app** at http://localhost:5173

## 📚 API Reference

### AIMocker Class

```typescript
// Create instance
const mocker = new AIMocker(config);

// Generate mock data
const result = await mocker.generate(name, options);

// Load pre-generated data
const loaded = await mocker.load<T>(name);
```

### Configuration

```typescript
interface AIMockerConfig {
  provider: {
    name: 'anthropic' | 'gemini';
    apiKey?: string;  // Uses env vars if not provided
    model?: string;   // Uses provider default if not set
    temperature?: number;
    maxTokens?: number;
  };
  outputDir?: string;  // Default: './mocks/generated'
  verbose?: boolean;   // Default: false
}
```

### Generation Options

```typescript
interface GenerationOptions<T extends z.ZodType> {
  schema: T;           // Zod schema to validate against
  count?: number;      // Number of items (default: 10)
  context?: string;    // Additional context for LLM
  seed?: string;       // Optional seed for reproducibility
}
```

## ✨ Features

✅ Type-safe mock data generation
✅ Pre-generate at build time (no runtime API costs)
✅ Validates LLM responses against Zod schemas
✅ Supports multiple LLM providers
✅ Easy to extend with new providers
✅ Production-ready MSW.js integration
✅ Full TypeScript support
✅ Beautiful Vue demo app

## 🛠️ Building the Package

```bash
# Build core package
pnpm --filter ai-mocker build

# Build all
pnpm build
```

## 🧪 Testing

```bash
# Run tests
pnpm test

# Watch mode
pnpm test -- --watch
```

## 📝 Notes

- Generated mock data is saved as JSON with metadata
- Validation errors are collected and reported
- MSW.js intercepts all requests - no real API calls
- Data can be modified at runtime (handlers maintain state)
- Perfect for development and testing

## 🚀 Future Enhancements

- OpenAI provider support
- Incremental generation (update existing data)
- Custom prompt templates
- Schema relationships and foreign keys
- Interactive CLI with prompts
- Published npm package
- Performance optimizations for large datasets

## 📄 License

MIT

## 🤝 Contributing

This is a POC for demonstration purposes. Feel free to fork and extend!
