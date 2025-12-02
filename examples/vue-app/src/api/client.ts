import type { User } from 'msw-service/src/schemas/user.schema';
import type { Product } from 'msw-service/src/schemas/product.schema';

const API_BASE = '/api';

/**
 * API Client for typed access to mocked endpoints
 */

// ===== USER ENDPOINTS =====

export async function fetchUsers(): Promise<User[]> {
  const response = await fetch(`${API_BASE}/users`);
  if (!response.ok) throw new Error('Failed to fetch users');
  return response.json();
}

export async function fetchUserById(id: string): Promise<User> {
  const response = await fetch(`${API_BASE}/users/${id}`);
  if (!response.ok) throw new Error(`Failed to fetch user ${id}`);
  return response.json();
}

export async function createUser(user: Partial<User>): Promise<User> {
  const response = await fetch(`${API_BASE}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user),
  });
  if (!response.ok) throw new Error('Failed to create user');
  return response.json();
}

export async function updateUser(id: string, user: Partial<User>): Promise<User> {
  const response = await fetch(`${API_BASE}/users/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user),
  });
  if (!response.ok) throw new Error(`Failed to update user ${id}`);
  return response.json();
}

export async function deleteUser(id: string): Promise<boolean> {
  const response = await fetch(`${API_BASE}/users/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error(`Failed to delete user ${id}`);
  return true;
}

// ===== PRODUCT ENDPOINTS =====

export async function fetchProducts(category?: string): Promise<Product[]> {
  const url = new URL(`${API_BASE}/products`, window.location.origin);
  if (category) {
    url.searchParams.set('category', category);
  }
  const response = await fetch(url.toString());
  if (!response.ok) throw new Error('Failed to fetch products');
  return response.json();
}

export async function fetchProductById(id: string): Promise<Product> {
  const response = await fetch(`${API_BASE}/products/${id}`);
  if (!response.ok) throw new Error(`Failed to fetch product ${id}`);
  return response.json();
}

export async function createProduct(product: Partial<Product>): Promise<Product> {
  const response = await fetch(`${API_BASE}/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product),
  });
  if (!response.ok) throw new Error('Failed to create product');
  return response.json();
}

export async function updateProduct(
  id: string,
  product: Partial<Product>
): Promise<Product> {
  const response = await fetch(`${API_BASE}/products/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product),
  });
  if (!response.ok) throw new Error(`Failed to update product ${id}`);
  return response.json();
}

export async function deleteProduct(id: string): Promise<boolean> {
  const response = await fetch(`${API_BASE}/products/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error(`Failed to delete product ${id}`);
  return true;
}
