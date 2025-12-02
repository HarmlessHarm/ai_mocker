<template>
  <div class="product-list">
    <div class="header">
      <h2>Products</h2>
      <p v-if="!loading && products.length" class="count">
        Showing {{ products.length }} products
      </p>
    </div>

    <div v-if="loading" class="loading">Loading products...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else-if="products.length === 0" class="empty">No products found</div>

    <div v-else class="grid">
      <div v-for="product in products" :key="product.id" class="card">
        <div class="card-header">
          <h3>{{ product.name }}</h3>
          <span class="price">${{ product.price.toFixed(2) }}</span>
        </div>

        <p class="description">{{ product.description }}</p>

        <div class="meta">
          <span class="category">{{ product.category }}</span>
          <span class="rating">⭐ {{ product.rating.toFixed(1) }}</span>
        </div>

        <div class="footer">
          <span v-if="product.inStock" class="in-stock">✓ In Stock</span>
          <span v-else class="out-of-stock">✗ Out of Stock</span>
          <span class="date">{{ formatDate(product.createdAt) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { fetchProducts } from '../api/client';
import type { Product } from 'msw-service/src/schemas/product.schema';

const products = ref<Product[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);

async function loadProducts() {
  try {
    loading.value = true;
    error.value = null;
    products.value = await fetchProducts();
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to load products';
  } finally {
    loading.value = false;
  }
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

onMounted(() => {
  loadProducts();
});
</script>

<style scoped>
.product-list {
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.header {
  margin-bottom: 1.5rem;
}

.header h2 {
  margin: 0 0 0.5rem;
  color: #333;
  font-size: 1.8rem;
}

.count {
  margin: 0;
  color: #999;
  font-size: 0.9rem;
}

.loading,
.error,
.empty {
  padding: 2rem;
  text-align: center;
  font-size: 1rem;
  border-radius: 8px;
}

.loading {
  background: #f0f0f0;
  color: #666;
}

.error {
  background: #fee;
  color: #c33;
}

.empty {
  background: #efe;
  color: #3c3;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

.card {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
}

.card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
  gap: 1rem;
}

.card-header h3 {
  margin: 0;
  color: #333;
  font-size: 1.1rem;
  flex: 1;
}

.price {
  font-size: 1.5rem;
  font-weight: 700;
  color: #667eea;
  white-space: nowrap;
}

.description {
  margin: 0 0 1rem;
  color: #666;
  font-size: 0.9rem;
  line-height: 1.4;
  flex: 1;
}

.meta {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.category {
  display: inline-block;
  background: #e0e7ff;
  color: #667eea;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
}

.rating {
  font-size: 0.9rem;
  color: #ff9800;
  font-weight: 600;
}

.footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid #f0f0f0;
  font-size: 0.85rem;
}

.in-stock {
  color: #27ae60;
  font-weight: 600;
}

.out-of-stock {
  color: #e74c3c;
  font-weight: 600;
}

.date {
  color: #999;
}

@media (max-width: 768px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
</style>
