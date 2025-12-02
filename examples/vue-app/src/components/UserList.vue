<template>
  <div class="user-list">
    <div class="header">
      <h2>Users</h2>
      <p v-if="!loading && users.length" class="count">
        Showing {{ users.length }} users
      </p>
    </div>

    <div v-if="loading" class="loading">Loading users...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else-if="users.length === 0" class="empty">No users found</div>

    <div v-else class="table-wrapper">
      <table class="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Age</th>
            <th>Role</th>
            <th>Created</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id" class="row">
            <td>{{ user.name }}</td>
            <td>{{ user.email }}</td>
            <td>{{ user.age }}</td>
            <td>
              <span class="badge" :class="user.role">{{ user.role }}</span>
            </td>
            <td class="date">{{ formatDate(user.createdAt) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { fetchUsers } from '../api/client';
import type { User } from 'msw-service/src/schemas/user.schema';

const users = ref<User[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);

async function loadUsers() {
  try {
    loading.value = true;
    error.value = null;
    users.value = await fetchUsers();
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to load users';
  } finally {
    loading.value = false;
  }
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

onMounted(() => {
  loadUsers();
});
</script>

<style scoped>
.user-list {
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

.table-wrapper {
  overflow-x: auto;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.table {
  width: 100%;
  border-collapse: collapse;
  background: white;
}

.table thead {
  background: #f9f9f9;
  border-bottom: 2px solid #e0e0e0;
}

.table th {
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: #333;
}

.table tbody tr {
  border-bottom: 1px solid #e0e0e0;
  transition: background-color 0.2s ease;
}

.table tbody tr:hover {
  background: #fafafa;
}

.table td {
  padding: 1rem;
  color: #666;
}

.badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
}

.badge.admin {
  background: #ffe0e0;
  color: #c33;
}

.badge.user {
  background: #e0e7ff;
  color: #667eea;
}

.badge.guest {
  background: #e0e0e0;
  color: #666;
}

.date {
  font-size: 0.9rem;
  color: #999;
}
</style>
