import { http, HttpResponse } from 'msw';
import { mockProducts } from '../mocks/data';
import type { Product } from '../schemas/product.schema';

let products = [...mockProducts];

export const productHandlers = [
  /**
   * GET /api/products - Get all products
   */
  http.get('/api/products', ({ request }) => {
    const url = new URL(request.url);
    const category = url.searchParams.get('category');

    if (category) {
      const filtered = products.filter((p) => p.category === category);
      return HttpResponse.json(filtered);
    }

    return HttpResponse.json(products);
  }),

  /**
   * GET /api/products/:id - Get a specific product
   */
  http.get('/api/products/:id', ({ params }) => {
    const { id } = params;
    const product = products.find((p) => p.id === id);

    if (!product) {
      return HttpResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    return HttpResponse.json(product);
  }),

  /**
   * POST /api/products - Create a new product
   */
  http.post('/api/products', async ({ request }) => {
    const body = await request.json() as Partial<Product>;

    const newProduct: Product = {
      id: crypto.randomUUID(),
      name: body.name || 'New Product',
      description: body.description || 'Product description',
      price: body.price || 29.99,
      category: body.category || 'electronics',
      inStock: body.inStock ?? true,
      rating: body.rating || 4.5,
      createdAt: new Date().toISOString(),
    };

    products.push(newProduct);

    return HttpResponse.json(newProduct, { status: 201 });
  }),

  /**
   * PUT /api/products/:id - Update a product
   */
  http.put('/api/products/:id', async ({ params, request }) => {
    const { id } = params;
    const body = await request.json() as Partial<Product>;

    const productIndex = products.findIndex((p) => p.id === id);
    if (productIndex === -1) {
      return HttpResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    const updated = { ...products[productIndex], ...body, id };
    products[productIndex] = updated;

    return HttpResponse.json(updated);
  }),

  /**
   * DELETE /api/products/:id - Delete a product
   */
  http.delete('/api/products/:id', ({ params }) => {
    const { id } = params;
    const productIndex = products.findIndex((p) => p.id === id);

    if (productIndex === -1) {
      return HttpResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    products.splice(productIndex, 1);

    return HttpResponse.json({ success: true });
  }),
];
