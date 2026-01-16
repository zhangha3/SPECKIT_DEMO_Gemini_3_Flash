<script setup lang="ts">
import { onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useSchedules } from '@/composables/useSchedules';
import { usePorts } from '@/composables/usePorts';
import { useAuth } from '@/composables/useAuth';
import PortAutocomplete from '@/components/PortAutocomplete.vue';
import ScheduleList from '@/components/ScheduleList.vue';
import HotSchedules from '@/components/HotSchedules.vue';
import Pagination from '@/components/Pagination.vue';

const router = useRouter();
const { 
  loading: schedulesLoading, 
  error: schedulesError,
  successMessage,
  queryParams, 
  paginatedSchedules, 
  totalSchedules, 
  loadSchedules,
  purchaseSchedule,
  error: actionError 
} = useSchedules();
const { ports, loadPorts } = usePorts();
const { isAuthenticated } = useAuth();

onMounted(async () => {
  await Promise.all([
    loadSchedules(),
    loadPorts()
  ]);
});

// 当查询条件改变时（除了分页），重置页码到第一页
watch(
  () => [queryParams.value.originPort, queryParams.value.destinationPort, queryParams.value.etdStart, queryParams.value.etdEnd],
  () => {
    queryParams.value.page = 1;
  }
);

const handleReset = () => {
  queryParams.value = {
    originPort: '',
    destinationPort: '',
    etdStart: '',
    etdEnd: '',
    page: 1,
    pageSize: 10
  };
};

const handlePurchase = async (scheduleId: string) => {
  if (!isAuthenticated.value) {
    router.push({
      path: '/login',
      query: { redirect: '/schedules' }
    });
    return;
  }
  
  if (confirm('确认购买此舱位？')) {
    await purchaseSchedule(scheduleId);
  }
};

const handleHotRouteSelect = (route: { origin: string, destination: string }) => {
  queryParams.value.originPort = route.origin;
  queryParams.value.destinationPort = route.destination;
  // Scroll to top of search form
  window.scrollTo({ top: 0, behavior: 'smooth' });
};
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <!-- Search Header -->
      <div class="p-6 border-b border-slate-100 bg-slate-50">
        <h1 class="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h5a1 1 0 011 1v10a1 1 0 01-1 1h-1" />
          </svg>
          全球航运船期查询
        </h1>
        <p class="mt-1 text-slate-500 text-sm italic">快速检索全球 20+ 个核心港口，30+ 条实时船期动态</p>
      </div>

      <!-- Search Form -->
      <div class="p-6">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-end">
          <PortAutocomplete 
            v-model="queryParams.originPort" 
            label="起运港 (Origin)" 
            placeholder="输入港口名称或代码..."
          />
          <PortAutocomplete 
            v-model="queryParams.destinationPort" 
            label="目的港 (Destination)" 
            placeholder="输入港口名称或代码..."
          />
          <div class="flex flex-col gap-1">
            <label class="block text-sm font-medium text-slate-700 text-left">ETD 起始 (From)</label>
            <input 
              v-model="queryParams.etdStart" 
              type="date" 
              class="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow text-sm"
            />
          </div>
          <div class="flex flex-col gap-1">
            <label class="block text-sm font-medium text-slate-700 text-left">ETD 结束 (To)</label>
            <input 
              v-model="queryParams.etdEnd" 
              type="date" 
              class="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow text-sm"
            />
          </div>
        </div>

        <div class="mt-6 flex justify-end gap-3">
          <button 
            @click="handleReset"
            class="px-5 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
          >
            重置
          </button>
          <button 
            class="px-5 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 shadow-sm shadow-indigo-100 transition-colors"
          >
            立即查询
          </button>
        </div>
      </div>
    </div>

    <!-- Results Section -->
    <div class="mt-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
      <div class="lg:col-span-3">
        <!-- Purchase Feedback -->
        <div v-if="successMessage" class="mb-6 p-4 bg-green-50 text-green-700 rounded-lg border border-green-200 flex justify-between items-center shadow-sm">
          <div class="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707-1.414a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
            <span class="font-bold">{{ successMessage }}</span>
          </div>
          <router-link to="/orders" class="text-sm font-bold underline hover:text-green-800">查看我的订单 &rarr;</router-link>
        </div>
        <div v-if="actionError" class="mb-6 p-4 bg-rose-50 text-rose-700 rounded-lg border border-rose-200 flex items-center gap-3 shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div class="flex-1">
            <p class="font-bold">{{ actionError }}</p>
            <p v-if="actionError.includes('余额不足')" class="text-sm mt-1">请前往资金管理页面进行充值。</p>
          </div>
          <router-link v-if="actionError.includes('余额不足')" to="/funds" class="px-3 py-1 bg-rose-600 text-white rounded text-xs font-bold hover:bg-rose-700 transition">
            立即充值
          </router-link>
        </div>

        <div v-if="schedulesLoading" class="flex justify-center py-12">
          <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
        </div>
        <div v-else-if="schedulesError" class="bg-red-50 text-red-700 p-4 rounded-lg text-center">
          {{ schedulesError }}
        </div>
        <div v-else>
          <div v-if="paginatedSchedules.length > 0">
             <div class="bg-white border border-slate-200 p-4 rounded-xl text-slate-700 mb-6 flex justify-between items-center px-8 shadow-sm">
               <span class="text-sm">已为您找到 <span class="font-bold text-indigo-600 text-base">{{ totalSchedules }}</span> 条符合条件的船期记录</span>
               <span class="text-[10px] uppercase font-bold text-slate-400 tracking-widest bg-slate-50 px-3 py-1 rounded-full border border-slate-100">Sorted by ETD Ascending</span>
             </div>
             
             <ScheduleList 
               :schedules="paginatedSchedules" 
               :ports="ports" 
               @purchase="handlePurchase"
             />

             <Pagination 
               v-model:current-page="queryParams.page"
               :total-items="totalSchedules"
               :page-size="queryParams.pageSize"
             />
          </div>
          <div v-else-if="queryParams.originPort || queryParams.destinationPort" class="py-20 bg-white rounded-xl border border-dashed border-slate-300 text-center shadow-inner">
            <div class="mx-auto w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <p class="text-slate-600 font-medium">未找到符合条件的船期</p>
            <p class="text-slate-400 text-sm mt-1">建议您尝试扩大日期范围或更改目的港。</p>
          </div>
          <div v-else class="py-24 bg-white rounded-xl border border-dashed border-slate-300 text-center shadow-inner">
            <div class="mx-auto w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <p class="text-slate-700 font-semibold text-lg">开启您的航运搜索</p>
            <p class="text-slate-500 max-w-sm mx-auto">请在上方输入起运港或目的港开始您的船期检索任务。</p>
          </div>
        </div>
      </div>

      <!-- Sidebar -->
      <div class="space-y-6">
        <HotSchedules :ports="ports" @select-route="handleHotRouteSelect" />
        
        <div class="bg-indigo-900 rounded-2xl p-6 text-white shadow-lg shadow-indigo-200 relative overflow-hidden group">
          <div class="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-32 w-32" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h4 class="font-black text-xl mb-2">数字化航运</h4>
          <p class="text-indigo-200 text-xs leading-relaxed mb-4">通过智能算法分析，为您优先展示高性价比、高准点率的优质航线。</p>
          <button class="w-full py-2 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-bold transition">了解计算逻辑 &rarr;</button>
        </div>
      </div>
    </div>
  </div>
</template>


