<template>
  <div id="app" class="container">
    <header class="header">
      <h1>🤖 AI Mocker Demo</h1>
      <p>Generated mock data via MSW.js using Zod schemas and LLM APIs</p>
    </header>

    <main class="main">
      <nav class="nav">
        <button
          @click="activeTab = 'users'"
          :class="{ active: activeTab === 'users' }"
        >
          👥 Users
        </button>
        <button
          @click="activeTab = 'products'"
          :class="{ active: activeTab === 'products' }"
        >
          📦 Products
        </button>
      </nav>

      <div class="content">
        <UserList v-if="activeTab === 'users'" />
        <ProductList v-if="activeTab === 'products'" />
      </div>
    </main>

    <footer class="footer">
      <p>All data is generated and served by MSW.js - no real API calls</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import UserList from './components/UserList.vue';
import ProductList from './components/ProductList.vue';

const activeTab = ref<'users' | 'products'>('users');
</script>

<style scoped>
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2rem;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.header h1 {
  margin: 0;
  font-size: 2.5rem;
}

.header p {
  margin: 0.5rem 0 0;
  opacity: 0.9;
  font-size: 1rem;
}

.main {
  flex: 1;
  padding: 2rem;
}

.nav {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  border-bottom: 2px solid #e0e0e0;
}

.nav button {
  padding: 0.75rem 1.5rem;
  background: none;
  border: none;
  font-size: 1rem;
  cursor: pointer;
  border-bottom: 3px solid transparent;
  transition: all 0.3s ease;
  color: #666;
}

.nav button:hover {
  color: #333;
}

.nav button.active {
  color: #667eea;
  border-bottom-color: #667eea;
}

.content {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.footer {
  text-align: center;
  padding: 2rem;
  color: #999;
  border-top: 1px solid #e0e0e0;
  font-size: 0.9rem;
}
</style>
