<template>
  <div class="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
    <div class="max-w-4xl mx-auto">
      <header class="mb-8 text-center">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">全球航运港口查询</h1>
        <p class="text-gray-600">查询全球范围内的 UN/LOCODE 港口信息</p>
      </header>

      <main>
        <div v-if="loading" class="text-center py-12">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
          <p class="mt-4 text-gray-600">正在加载港口数据...</p>
        </div>

        <div v-else-if="error" class="bg-red-50 border-l-4 border-red-400 p-4 mb-8">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm text-red-700">
                {{ error }}
              </p>
            </div>
          </div>
        </div>

        <div v-else>
          <SearchBar v-model="searchQuery" @search="currentPage = 1" />
          
          <div class="mt-8">
            <h2 class="text-lg font-semibold text-gray-700 mb-4 flex items-center">
              查询结果
              <span class="ml-3 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {{ filteredPorts.length }}
              </span>
            </h2>
            <PortList :ports="paginatedPorts" />
            <Pagination 
              v-if="filteredPorts.length > pageSize"
              :totalItems="filteredPorts.length" 
              :pageSize="pageSize" 
              v-model:currentPage="currentPage" 
            />
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { usePorts } from '@/composables/usePorts';
import SearchBar from '@/components/SearchBar.vue';
import PortList from '@/components/PortList.vue';
import Pagination from '@/components/Pagination.vue';

const { 
  loading, 
  error, 
  loadPorts, 
  searchQuery, 
  filteredPorts, 
  paginatedPorts, 
  currentPage, 
  pageSize 
} = usePorts();

onMounted(() => {
  loadPorts();
});
</script>
