<template>
  <div class="mb-6">
    <div class="relative flex items-center">
      <input
        type="text"
        v-model="localQuery"
        @keyup.enter="handleSearch"
        placeholder="搜索港口代码 (如 CNSHA) 或名称..."
        class="block w-full px-4 py-3 pl-10 text-sm border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500 text-gray-900"
      />
      <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
        </svg>
      </div>
      <button
        @click="handleSearch"
        class="absolute right-2.5 bottom-1.5 bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-md text-sm px-4 py-1.5 text-white transition-colors"
      >
        查询
      </button>
    </div>
    <p class="mt-2 text-xs text-gray-500">
      提示：输入 5 位代码可触发精确查询
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps<{
  modelValue: string;
}>();

const emit = defineEmits(['update:modelValue', 'search']);

const localQuery = ref(props.modelValue);

// 当外部 modelValue 改变时同步（虽然这里主要是单向流）
watch(() => props.modelValue, (newVal) => {
  localQuery.value = newVal;
});

const handleSearch = () => {
  emit('update:modelValue', localQuery.value);
  emit('search', localQuery.value);
};
</script>
