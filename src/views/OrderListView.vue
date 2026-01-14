<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { OrderService } from '../services/orderService';
import { useAuth } from '../composables/useAuth';
import type { Order } from '../models/order';

const orders = ref<Order[]>([]);
const searchOrderId = ref('');
const { currentUser } = useAuth();

const loadOrders = () => {
  if (!currentUser.value) return;
  
  const query = searchOrderId.value.trim();
  if (query === '') {
    orders.value = OrderService.getOrdersForCurrentUser();
  } else {
    const order = OrderService.findOrderById(query);
    orders.value = order ? [order] : [];
  }
};

onMounted(() => {
  loadOrders();
});
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
      <h1 class="text-3xl font-bold text-blue-900">我的订单</h1>
      
      <div class="flex w-full md:w-auto gap-2">
        <div class="relative flex-1 md:w-80">
          <input 
            v-model="searchOrderId" 
            type="text" 
            placeholder="按订单号精确查询..." 
            class="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            @keyup.enter="loadOrders"
          />
          <div v-if="searchOrderId" @click="searchOrderId = ''; loadOrders()" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        </div>
        <button 
          @click="loadOrders"
          class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-bold transition shadow-sm active:scale-95"
        >
          查询
        </button>
      </div>
    </div>
    
    <div v-if="orders.length === 0" class="text-center py-16 bg-white rounded-xl border border-gray-100 shadow-sm">
      <div class="mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      </div>
      <p class="text-gray-500 text-lg">{{ searchOrderId ? '未找到符合条件的订单' : '暂无订单记录' }}</p>
      <div class="mt-4 space-x-4">
        <button v-if="searchOrderId" @click="searchOrderId = ''; loadOrders()" class="text-blue-600 hover:underline">显示全部订单</button>
        <router-link to="/schedules" class="text-blue-600 hover:underline">去浏览船期</router-link>
      </div>
    </div>
    
    <div v-else class="space-y-4">
      <div v-for="order in orders" :key="order.orderId" class="bg-white border rounded-lg shadow-sm p-6">
        <div class="flex justify-between items-start border-b pb-4 mb-4">
          <div>
            <span class="text-sm text-gray-500 block">订单号</span>
            <span class="font-mono font-bold text-lg">{{ order.orderId }}</span>
          </div>
          <div class="text-right">
            <span class="text-sm text-gray-500 block">下单时间</span>
            <span class="text-gray-900">{{ new Date(order.orderTime).toLocaleString() }}</span>
          </div>
        </div>
        
        <div class="bg-blue-50 p-4 rounded-md">
          <h3 class="font-bold text-lg mb-2 text-blue-900">
            {{ order.scheduleSnapshot.originPort }} <span class="text-gray-400">→</span> {{ order.scheduleSnapshot.destinationPort }}
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span class="block text-gray-500">出发时间 (ETD)</span>
              <span class="font-medium">{{ new Date(order.scheduleSnapshot.etd).toLocaleString() }}</span>
            </div>
            <div>
              <span class="block text-gray-500">承运商</span>
              <span class="font-medium font-mono lowercase">{{ order.scheduleSnapshot.carrier }}</span>
            </div>
            <div>
              <span class="block text-gray-500">船名</span>
              <span class="font-medium">{{ order.scheduleSnapshot.vesselName }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
