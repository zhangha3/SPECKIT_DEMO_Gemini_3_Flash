<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { StatsService, type StatsData } from '@/services/statsService';
import { Bar, Pie, Line } from 'vue-chartjs';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  PointElement,
  LineElement
} from 'chart.js';

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  PointElement,
  LineElement
);

const stats = ref<StatsData | null>(null);

onMounted(() => {
  stats.value = StatsService.getUserStats();
});

// Chart Data: Orders by Date (Last 7 days or all)
const lineChartData = computed(() => {
  if (!stats.value) return null;
  const labels = Object.keys(stats.value.ordersByDate).sort();
  const data = labels.map(label => stats.value!.ordersByDate[label]);
  
  return {
    labels,
    datasets: [{
      label: '每日下单量',
      data,
      borderColor: '#4f46e5',
      backgroundColor: 'rgba(79, 70, 229, 0.1)',
      fill: true,
      tension: 0.4
    }]
  };
});

// Chart Data: Orders by Carrier
const pieChartData = computed(() => {
  if (!stats.value) return null;
  const labels = Object.keys(stats.value.ordersByCarrier);
  const data = labels.map(label => stats.value!.ordersByCarrier[label]);
  const colors = [
    '#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'
  ];

  return {
    labels,
    datasets: [{
      data,
      backgroundColor: colors.slice(0, labels.length)
    }]
  };
});

// Chart Data: Orders by Route
const barChartData = computed(() => {
  if (!stats.value) return null;
  const labels = Object.keys(stats.value.ordersByRoute);
  const data = labels.map(label => stats.value!.ordersByRoute[label]);

  return {
    labels,
    datasets: [{
      label: '航线预订量',
      data,
      backgroundColor: '#6366f1'
    }]
  };
});

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom' as const
    }
  }
};
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="mb-8">
      <h1 class="text-3xl font-black text-slate-900 tracking-tight">数据统计工具</h1>
      <p class="text-slate-500 mt-2">基于您的历史订单数据生成的航运数字化分析报告</p>
    </div>

    <div v-if="stats" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <!-- Summary Cards -->
      <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
        <span class="text-sm font-bold text-slate-400 uppercase tracking-widest">总订单数</span>
        <div class="flex items-baseline gap-2 mt-4">
          <span class="text-4xl font-black text-slate-900">{{ stats.totalOrders }}</span>
          <span class="text-xs font-bold text-slate-400">单</span>
        </div>
      </div>
      <div class="bg-indigo-600 p-6 rounded-2xl border border-indigo-500 shadow-md flex flex-col justify-between text-white">
        <span class="text-sm font-bold text-white/60 uppercase tracking-widest">累计支出</span>
        <div class="flex items-baseline gap-2 mt-4">
          <span class="text-xs font-bold text-white/60">¥</span>
          <span class="text-4xl font-black text-white">{{ stats.totalSpent.toLocaleString() }}</span>
        </div>
      </div>
      <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
        <span class="text-sm font-bold text-slate-400 uppercase tracking-widest">合作承运商</span>
        <div class="flex items-baseline gap-2 mt-4">
          <span class="text-4xl font-black text-slate-900">{{ Object.keys(stats.ordersByCarrier).length }}</span>
          <span class="text-xs font-bold text-slate-400">家</span>
        </div>
      </div>
      <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
        <span class="text-sm font-bold text-slate-400 uppercase tracking-widest">覆盖航线</span>
        <div class="flex items-baseline gap-2 mt-4">
          <span class="text-4xl font-black text-slate-900">{{ Object.keys(stats.ordersByRoute).length }}</span>
          <span class="text-xs font-bold text-slate-400">条</span>
        </div>
      </div>
    </div>

    <!-- Charts -->
    <div v-if="stats && stats.totalOrders > 0" class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Time Series -->
      <div class="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
        <h3 class="font-bold text-slate-900 mb-6 flex items-center gap-2">
          <span class="w-2 h-6 bg-indigo-600 rounded-full"></span>
          下单趋势 (按日期)
        </h3>
        <div class="h-[300px]">
          <Line v-if="lineChartData" :data="lineChartData" :options="chartOptions" />
        </div>
      </div>

      <!-- Carrier Distribution -->
      <div class="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
        <h3 class="font-bold text-slate-900 mb-6 flex items-center gap-2">
          <span class="w-2 h-6 bg-indigo-600 rounded-full"></span>
          承运商占比情况
        </h3>
        <div class="h-[300px] flex justify-center">
          <Pie v-if="pieChartData" :data="pieChartData" :options="chartOptions" />
        </div>
      </div>

      <!-- Route Analysis -->
      <div class="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm lg:col-span-2">
        <h3 class="font-bold text-slate-900 mb-6 flex items-center gap-2">
          <span class="w-2 h-6 bg-indigo-600 rounded-full"></span>
          航线热度分布 (TOP Routes)
        </h3>
        <div class="h-[400px]">
          <Bar v-if="barChartData" :data="barChartData" :options="chartOptions" />
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="stats" class="bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl py-20 text-center">
      <div class="text-6xl mb-6">📊</div>
      <h3 class="text-xl font-bold text-slate-900">暂无分析数据</h3>
      <p class="text-slate-500 mt-2">完成首笔订单后，我们将为您自动生成分析图表。</p>
      <router-link to="/schedules" class="mt-8 inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-100">
        去预订舱位
      </router-link>
    </div>
  </div>
</template>
