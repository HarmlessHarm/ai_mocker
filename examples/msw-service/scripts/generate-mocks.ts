import { AIMocker } from 'ai-mocker';
import { UserSchema } from '../src/schemas/user.schema';
import { ProductSchema } from '../src/schemas/product.schema';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config({ path: path.join(path.dirname(fileURLToPath(import.meta.url)), '../.env') });

async function main() {
  const provider = (process.env.PROVIDER || 'anthropic') as 'anthropic' | 'gemini';

  const mocker = new AIMocker({
    provider: {
      name: provider,
      // API keys will be read from environment variables
    },
    outputDir: './src/mocks/generated',
    verbose: true,
  });

  try {
    // Generate users
    console.log('\n📝 Generating users...');
    await mocker.generate('users', {
      schema: UserSchema,
      count: 20,
      context:
        'Generate diverse user profiles for a SaaS application. Include different roles and realistic data.',
    });

    // Generate products
    console.log('\n📦 Generating products...');
    await mocker.generate('products', {
      schema: ProductSchema,
      count: 50,
      context:
        'Generate realistic products for an e-commerce store. Vary the categories and prices to be realistic.',
    });

    console.log('\n✅ Mock generation complete!');
  } catch (error) {
    console.error('\n❌ Error generating mocks:', error);
    process.exit(1);
  }
}

main();
