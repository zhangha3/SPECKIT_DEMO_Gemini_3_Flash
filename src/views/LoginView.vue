<script setup lang="ts">
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuth } from '../composables/useAuth';

const username = ref('');
const password = ref('');
const error = ref('');
const loading = ref(false);

const { login } = useAuth();
const router = useRouter();
const route = useRoute();

const handleLogin = async () => {
  if (!username.value || !password.value) {
    error.value = '请输入用户名和密码';
    return;
  }
  
  loading.value = true;
  error.value = '';
  
  try {
    const success = await login(username.value, password.value);
    if (success) {
      // Redirect to the page they tried to visit, or home
      const redirectPath = (route.query.redirect as string) || '/';
      router.push(redirectPath);
    } else {
      error.value = '登录失败，请检查用户名或密码 (User1/pass1)';
    }
  } catch (e) {
    error.value = '登录过程中发生错误';
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="flex items-center justify-center min-h-[50vh]">
    <div class="w-full max-w-md bg-white rounded-lg shadow-md p-8 border border-gray-200">
      <h2 class="text-2xl font-bold text-center text-blue-900 mb-6">用户登录</h2>
      
      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label for="username" class="block text-sm font-medium text-gray-700 mb-1">用户名</label>
          <input 
            id="username" 
            v-model="username" 
            type="text" 
            placeholder="User1"
            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700 mb-1">密码</label>
          <input 
            id="password" 
            v-model="password" 
            type="password" 
            placeholder="pass1"
            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div v-if="error" class="text-red-600 text-sm bg-red-50 p-2 rounded">
          {{ error }}
        </div>
        
        <button 
          type="submit" 
          :disabled="loading"
          class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ loading ? '登录中...' : '登录' }}
        </button>
      </form>
      
      <div class="mt-4 text-center text-sm text-gray-500">
        Demo账号: <span class="font-bold">User1</span> / <span class="font-bold">pass1</span>
      </div>
    </div>
  </div>
</template>
