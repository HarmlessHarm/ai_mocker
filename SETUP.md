# 🚀 Setup & Testing Guide

This guide walks you through setting up and testing the AI Mocker POC.

## Prerequisites

- Node.js 18+
- pnpm (recommended) or npm
- Anthropic API key OR Google Gemini API key

## Step 1: Install Dependencies

```bash
cd /home/harm/projects/pocs/ai_mocker

# Install all dependencies (pnpm recommended for monorepo)
pnpm install

# If using npm instead
npm install
```

**What this does:**
- Installs all workspace dependencies
- Builds the monorepo structure
- Prepares packages and examples

## Step 2: Set Up Environment Variables

```bash
# Copy the example env file
cp .env.example .env

# Edit .env and add your API key
# Choose one provider:
#   - ANTHROPIC_API_KEY for Claude
#   - GEMINI_API_KEY for Gemini
```

**Your .env should look like:**

```env
ANTHROPIC_API_KEY=sk-ant-v0-xxxxx  # Replace with your key
# OR
GEMINI_API_KEY=AIzaSy_xxxxx        # Replace with your key
```

Also copy for the MSW service:

```bash
cp examples/msw-service/.env.example examples/msw-service/.env

# Edit and add the same API key there
```

## Step 3: Build the Core Package

```bash
# Build the ai-mocker package
pnpm --filter ai-mocker build

# Or build everything
pnpm build
```

**What to expect:**
- TypeScript compilation
- `packages/ai-mocker/dist/` folder created with `.js`, `.d.ts` files
- No errors should appear

## Step 4: Generate Mock Data

```bash
# Run the generation script
pnpm generate:mocks

# Or manually:
pnpm --filter msw-service generate
```

**What to expect:**
- Script will start with "📝 Generating users..."
- Wait for LLM API calls (may take 30-60 seconds)
- See "✅ Mock generation complete!"
- Two JSON files created:
  - `examples/msw-service/src/mocks/generated/users.json`
  - `examples/msw-service/src/mocks/generated/products.json`

**If it fails:**
- Check your API key is set correctly
- Verify API has quota remaining
- Check internet connection
- Review error message for specific details

## Step 5: Verify Generated Data

```bash
# Check the generated files
cat examples/msw-service/src/mocks/generated/users.json

# You should see:
# {
#   "data": [
#     { "id": "uuid", "name": "...", "email": "..." },
#     ...
#   ],
#   "metadata": { ... }
# }
```

The JSON structure should have:
- ✅ `data` array with 20 users and 50 products
- ✅ `metadata` object with provider info
- ✅ All required fields (id, name, email, etc.)
- ✅ Proper types (emails are valid, ages are 18-100, etc.)

## Step 6: Run the Vue App

```bash
# Start the development server
pnpm --filter vue-app dev

# Or manually
cd examples/vue-app
pnpm dev
```

**What to expect:**
- Terminal shows: "Local: http://localhost:5173/"
- Browser opens automatically (or visit manually)
- ✓ Console shows "MSW started successfully"
- ✓ Two tabs visible: "👥 Users" and "📦 Products"
- ✓ Users tab shows a table with 20 users
- ✓ Products tab shows a grid with 50 products

**If data doesn't appear:**
1. Check browser console for errors
2. Verify `users.json` and `products.json` exist
3. Check Network tab - requests should be intercepted by MSW (no real API calls)
4. Refresh the page

## Step 7: Test Interactivity (Optional)

In the Vue app console (browser DevTools):

```typescript
// Try the API client
import * as api from '../api/client.js'

// Fetch all users
const users = await api.fetchUsers()
console.log(users)

// Fetch specific user
const user = await api.fetchUserById(users[0].id)
console.log(user)

// Create a new user
const newUser = await api.createUser({
  name: 'Test User',
  email: 'test@example.com',
  age: 30
})
console.log(newUser)
```

All these should work because MSW intercepts the requests!

## Troubleshooting

### "Module not found" errors

```bash
# Rebuild dependencies
pnpm install --force

# Clear build artifacts
rm -rf packages/*/dist examples/*/dist

# Rebuild
pnpm build
```

### "API key not found" error

```bash
# Verify .env file exists
ls -la .env examples/msw-service/.env

# Check key is set
echo $ANTHROPIC_API_KEY
# or
echo $GEMINI_API_KEY

# If empty, source your .env
export $(cat .env | xargs)
pnpm generate:mocks
```

### "Failed to parse response" from LLM

This means the LLM didn't return valid JSON. Try:
1. Check your API key is correct
2. Check you have API quota
3. Try the other provider (switch `PROVIDER` in .env)
4. Run again (sometimes rate limited)

### Port 5173 already in use

```bash
# Use different port
pnpm --filter vue-app dev -- --port 5174
```

### TypeScript errors

```bash
# Clear TypeScript cache
pnpm --filter ai-mocker build -- --force

# Verify types
npx tsc --noEmit
```

## What Each Package Does

### `packages/ai-mocker`
- Core library for LLM-based mock generation
- Implements `AIMocker` class
- Supports Claude and Gemini providers
- Validates responses against Zod schemas

### `examples/msw-service`
- Defines User and Product schemas
- Contains generation script
- Sets up MSW handlers
- Exports browser worker

### `examples/vue-app`
- Demo Vue 3 + Vite application
- Shows how to use generated data
- Demonstrates type-safe API client
- Beautiful UI with Tailwind-inspired styling

## Next Steps

✅ **You now have a fully functional POC!**

To extend it:

1. **Add more schemas**
   - Create new `.schema.ts` files in `msw-service/src/schemas/`
   - Add them to the generation script

2. **Customize mock data**
   - Edit the `context` parameter in `generate-mocks.ts`
   - Adjust `count` for more/fewer items

3. **Add more API endpoints**
   - Create new handlers in `msw-service/src/handlers/`
   - Add to `browser.ts` setup

4. **Publish the package**
   - Configure npm credentials
   - Run `npm publish` from `packages/ai-mocker`

5. **Use in other projects**
   - Install: `npm install ai-mocker`
   - Import and use as shown in examples

## Quick Reference

```bash
# Installation
pnpm install

# Setup
cp .env.example .env
# Edit .env with your API key

# Development
pnpm generate:mocks     # Generate mock data
pnpm --filter vue-app dev  # Run demo app

# Building
pnpm build              # Build all packages
pnpm --filter ai-mocker build  # Build just core package

# Testing
pnpm test              # Run tests (when added)
```

## Success Checklist

- ✅ Dependencies installed
- ✅ API key configured
- ✅ Core package builds
- ✅ Mock data generated
- ✅ Generated JSON files exist and are valid
- ✅ Vue app starts
- ✅ MSW starts (console message)
- ✅ Users and Products display
- ✅ Data looks realistic

## Questions?

Refer to:
- `README.md` - Overview and features
- `packages/ai-mocker/README.md` - Package API docs
- `examples/msw-service/src/` - Implementation examples
- `examples/vue-app/src/` - Vue app examples

Happy mocking! 🤖
