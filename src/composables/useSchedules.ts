import { ref, computed } from 'vue';
import type { Schedule, ScheduleQuery } from '@/models/schedule';
import { usePorts } from './usePorts';

export function useSchedules() {
  const allSchedules = ref<Schedule[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const { ports, loadPorts } = usePorts();

  const loadSchedules = async () => {
    if (allSchedules.value.length > 0) return;
    loading.value = true;
    error.value = null;
    try {
      // 必须确保港口数据已加载，以便进行一致性校验 (FR-007)
      await loadPorts();
      
      const response = await fetch('/src/assets/schedules.json');
      if (!response.ok) throw new Error('Load failed');
      const data = await response.json();
      allSchedules.value = data;
    } catch (e) {
      error.value = '船期数据加载失败，请稍后重试。';
    } finally {
      loading.value = false;
    }
  };

  const queryParams = ref<ScheduleQuery>({
    page: 1,
    pageSize: 10
  });

  const filteredSchedules = computed(() => {
    return allSchedules.value.filter(s => {
      // FR-007: 引用一致性硬约束。港口代码必须在港口主表中存在，否则过滤掉
      const originExists = ports.value.some(p => p.code === s.originPort);
      const destExists = ports.value.some(p => p.code === s.destinationPort);
      if (!originExists || !destExists) return false;

      // 必须输入起运港或目的港之一 (Q4:C)
      const hasOrigin = !!queryParams.value.originPort;
      const hasDest = !!queryParams.value.destinationPort;
      if (!hasOrigin && !hasDest) return false;
// ...existing code...

      const matchOrigin = !queryParams.value.originPort || s.originPort === queryParams.value.originPort;
      const matchDest = !queryParams.value.destinationPort || s.destinationPort === queryParams.value.destinationPort;

      // ETD 范围筛选
      const etdTime = new Date(s.etd).getTime();
      const matchStart = !queryParams.value.etdStart || etdTime >= new Date(queryParams.value.etdStart).getTime();
      const matchEnd = !queryParams.value.etdEnd || etdTime <= new Date(queryParams.value.etdEnd).getTime();

      return matchOrigin && matchDest && matchStart && matchEnd;
    }).sort((a, b) => new Date(a.etd).getTime() - new Date(b.etd).getTime()); // Q1:A ETD 降序
  });

  const paginatedSchedules = computed(() => {
    const start = (queryParams.value.page - 1) * queryParams.value.pageSize;
    const end = start + queryParams.value.pageSize;
    return filteredSchedules.value.slice(start, end);
  });

  const totalSchedules = computed(() => filteredSchedules.value.length);

  return {
    loading,
    error,
    queryParams,
    paginatedSchedules,
    totalSchedules,
    loadSchedules
  };
}
