import { ref, computed } from 'vue';
import type { Port } from '@/models/port';

export function usePorts() {
  const ports = ref<Port[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const searchQuery = ref('');

  const loadPorts = async () => {
    loading.value = true;
    error.value = null;
    try {
      const response = await fetch('/src/assets/ports.json');
      if (!response.ok) {
        throw new Error('Load failed');
      }
      const data = await response.json();
      ports.value = data;
    } catch (e) {
      error.value = '数据加载失败，请稍后重试。';
      ports.value = [];
    } finally {
      loading.value = false;
    }
  };

  const filteredPorts = computed(() => {
    const query = searchQuery.value.trim().toUpperCase();
    if (!query) return ports.value;

    // 如果正好是 5 位，尝试精确匹配代码
    if (query.length === 5) {
      const exactMatch = ports.value.find(p => p.code.toUpperCase() === query);
      if (exactMatch) return [exactMatch];
    }

    // 否则执行模糊查询（代码、中文名、英文名）
    return ports.value.filter(p => 
      p.code.toUpperCase().includes(query) ||
      p.name_cn.toUpperCase().includes(query) ||
      p.name_en.toUpperCase().includes(query)
    ).sort((a, b) => a.code.localeCompare(b.code));
  });

  const currentPage = ref(1);
  const pageSize = ref(5);

  const paginatedPorts = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value;
    const end = start + pageSize.value;
    return filteredPorts.value.slice(start, end);
  });

  return {
    ports,
    loading,
    error,
    searchQuery,
    filteredPorts,
    paginatedPorts,
    currentPage,
    pageSize,
    loadPorts
  };
}
