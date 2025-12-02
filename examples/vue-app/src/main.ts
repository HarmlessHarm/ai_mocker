import { createApp } from 'vue';
import App from './App.vue';
import { worker } from 'msw-service/browser';
import './style.css';

/**
 * Start MSW in development environment, then mount the app
 */
async function main() {
  // Start MSW worker in development
  if (import.meta.env.DEV) {
    try {
      await worker.start({
        onUnhandledRequest: 'warn',
      });
      console.log('✓ MSW started successfully');
    } catch (error) {
      console.error('Failed to start MSW:', error);
    }
  }

  // Mount Vue app
  const app = createApp(App);
  app.mount('#app');
}

main();
