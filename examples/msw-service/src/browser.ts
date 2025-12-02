import { setupWorker } from 'msw/browser';
import { userHandlers } from './handlers/user.handlers';
import { productHandlers } from './handlers/product.handlers';

/**
 * Setup MSW worker for browser environment
 * This worker will intercept all network requests matching the handlers
 */
export const worker = setupWorker(...userHandlers, ...productHandlers);
