<template>
  <div class="overflow-hidden bg-white shadow sm:rounded-md">
    <ul role="list" class="divide-y divide-gray-200">
      <li v-for="port in ports" :key="port.code" class="hover:bg-gray-50 transition-colors">
        <div class="px-4 py-4 sm:px-6">
          <div class="flex items-center justify-between">
            <div class="flex flex-col">
              <div class="flex items-center">
                <p class="text-sm font-bold text-blue-600 truncate mr-2">{{ port.code }}</p>
                <div class="flex items-center text-sm text-gray-900">
                  <span class="font-medium">{{ port.name_cn }}</span>
                  <span class="mx-1 font-light text-gray-400">/</span>
                  <span class="text-gray-600">{{ port.name_en }}</span>
                </div>
              </div>
              <div class="mt-2 flex items-center text-xs text-gray-500">
                 <svg class="mr-1.5 h-3 w-3 flex-shrink-0 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V9a2 2 0 002 2h4.714a7.001 7.001 0 00-11.382-2.973zM13 3.046a6.97 6.97 0 00-3 .954V5.5A1.5 1.5 0 018.5 7H6v1.4a3 3 0 00.134 1.176c.451 1.455 1.77 2.424 3.366 2.424h.5a2 2 0 012 2v2.462a7.001 7.001 0 004-9.416z" clip-rule="evenodd" />
                </svg>
                {{ port.country }}
              </div>
            </div>
            <div class="flex flex-col items-end">
              <div class="flex items-center text-xs text-gray-500">
                <svg class="mr-1.5 h-3 w-3 flex-shrink-0 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                {{ port.timezone }}
              </div>
            </div>
          </div>
        </div>
      </li>
    </ul>
    <div v-if="ports.length === 0" class="px-4 py-12 text-center text-gray-500 italic">
      未找到符合条件的港口
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Port } from '@/models/port';

defineProps<{
  ports: Port[];
}>();
</script>
