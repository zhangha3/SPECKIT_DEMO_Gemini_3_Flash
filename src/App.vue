<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navbar -->
    <nav class="bg-white shadow">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex">
            <div class="flex-shrink-0 flex items-center">
              <span class="text-xl font-bold text-blue-600">PortConnect</span>
            </div>
            <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
              <router-link 
                to="/" 
                class="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                :class="[route.path === '/' ? 'border-blue-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700']"
              >
                港口查询
              </router-link>
              <router-link 
                to="/schedules" 
                class="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                :class="[route.path === '/schedules' ? 'border-blue-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700']"
              >
                船期查询
              </router-link>
              <router-link 
                v-if="isAuthenticated"
                to="/orders" 
                class="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                :class="[route.path === '/orders' ? 'border-blue-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700']"
              >
                我的订单
              </router-link>
              <router-link 
                v-if="isAuthenticated"
                to="/funds" 
                class="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                :class="[route.path === '/funds' ? 'border-blue-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700']"
              >
                资金账户
              </router-link>
              <router-link 
                v-if="isAuthenticated"
                to="/stats" 
                class="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                :class="[route.path === '/stats' ? 'border-blue-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700']"
              >
                数据统计
              </router-link>
            </div>
          </div>
          <div class="flex items-center">
            <template v-if="isAuthenticated">
              <span class="text-sm text-gray-700 mr-4">Hi, {{ currentUser?.username }}</span>
              <button @click="logout" class="text-sm text-gray-500 hover:text-gray-700">退出</button>
            </template>
            <template v-else>
              <router-link to="/login" class="text-sm text-blue-600 hover:text-blue-800">登录</router-link>
            </template>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <div class="py-10">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </div>
  </div>
</template>
<script setup lang="ts">
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useAuth } from './composables/useAuth';
import { StorageService } from './services/storageService';

const route = useRoute();
const { isAuthenticated, currentUser, logout } = useAuth();

onMounted(async () => {
  await StorageService.initializeSeeds();
});
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
