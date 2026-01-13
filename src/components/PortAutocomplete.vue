<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { usePorts } from '@/composables/usePorts';
import type { Port } from '@/models/port';

interface Props {
  modelValue: string;
  placeholder?: string;
  label?: string;
}

const props = defineProps<Props>();
const emit = defineEmits(['update:modelValue']);

const { loadPorts, searchPorts, ports } = usePorts();
const inputText = ref('');
const suggestions = ref<Port[]>([]);
const isOpen = ref(false);
const highlightedIndex = ref(-1);

// Sync modelValue back to inputText if it changes externally (e.g. reset)
watch(() => props.modelValue, (newVal) => {
  if (!newVal) {
    inputText.value = '';
    return;
  }
  // Avoid overwriting if we just selected it
  const currentPort = ports.value.find(p => p.code === newVal);
  if (currentPort && !inputText.value.includes(currentPort.code)) {
    inputText.value = `${currentPort.name_cn} (${currentPort.code})`;
  }
});

onMounted(async () => {
  await loadPorts();
  if (props.modelValue) {
    const port = ports.value.find(p => p.code === props.modelValue);
    if (port) {
      inputText.value = `${port.name_cn} (${port.code})`;
    }
  }
});

let debounceTimer: ReturnType<typeof setTimeout> | null = null;

const onInput = () => {
  if (debounceTimer) clearTimeout(debounceTimer);
  
  debounceTimer = setTimeout(() => {
    const query = inputText.value.trim();
    if (query.length < 2) {
      suggestions.value = [];
      isOpen.value = false;
      if (!query) {
        emit('update:modelValue', '');
      }
      return;
    }
    
    suggestions.value = searchPorts(query);
    isOpen.value = suggestions.value.length > 0;
    highlightedIndex.value = -1;
  }, 300);
};

const selectPort = (port: Port) => {
  inputText.value = `${port.name_cn} (${port.code})`;
  emit('update:modelValue', port.code);
  isOpen.value = false;
  suggestions.value = [];
};

const handleBlur = () => {
  setTimeout(() => {
    isOpen.value = false;
  }, 200);
};

const moveHighlight = (direction: 'up' | 'down') => {
  if (!isOpen.value) return;
  if (direction === 'down') {
    highlightedIndex.value = (highlightedIndex.value + 1) % suggestions.value.length;
  } else {
    highlightedIndex.value = (highlightedIndex.value - 1 + suggestions.value.length) % suggestions.value.length;
  }
};

const selectHighlighted = () => {
  if (isOpen.value && highlightedIndex.value >= 0) {
    selectPort(suggestions.value[highlightedIndex.value]);
  }
};
</script>

<template>
  <div class="relative w-full">
    <label v-if="label" class="block text-sm font-medium text-slate-700 mb-1 text-left">
      {{ label }}
    </label>
    <div class="relative">
      <input
        v-model="inputText"
        type="text"
        :placeholder="placeholder"
        class="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow text-sm"
        @input="onInput"
        @blur="handleBlur"
        @focus="onInput"
        @keydown.down.prevent="moveHighlight('down')"
        @keydown.up.prevent="moveHighlight('up')"
        @keydown.enter.prevent="selectHighlighted"
      />
      
      <!-- Dropdown -->
      <transition
        enter-active-class="transition duration-100 ease-out"
        enter-from-class="transform scale-95 opacity-0"
        enter-to-class="transform scale-100 opacity-100"
        leave-active-class="transition duration-75 ease-in"
        leave-from-class="transform scale-100 opacity-100"
        leave-to-class="transform scale-95 opacity-0"
      >
        <ul
          v-if="isOpen && suggestions.length > 0"
          class="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-xl max-h-60 overflow-y-auto py-1"
        >
          <li
            v-for="(port, index) in suggestions"
            :key="port.code"
            class="px-4 py-2.5 cursor-pointer flex justify-between items-center text-sm"
            :class="index === highlightedIndex ? 'bg-indigo-50 text-indigo-700' : 'text-slate-700 hover:bg-slate-50'"
            @mousedown="selectPort(port)"
          >
            <div class="flex flex-col">
              <span class="font-semibold">{{ port.name_cn }}</span>
              <span class="text-xs text-slate-500 italic">{{ port.name_en }}</span>
            </div>
            <span class="text-[10px] font-mono bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 text-slate-600">
              {{ port.code }}
            </span>
          </li>
        </ul>
      </transition>
    </div>
  </div>
</template>
