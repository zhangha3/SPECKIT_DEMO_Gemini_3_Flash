<template>
  <div class="container mx-auto p-4">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- 余额概览 -->
      <div class="md:col-span-1 bg-white rounded-lg shadow-md p-6">
        <h2 class="text-xl font-bold mb-4">当前余额</h2>
        <div class="text-4xl font-mono text-blue-600 mb-2">
          ¥ {{ currentUser?.funds || 0 }}
        </div>
        <div class="text-sm text-gray-500">币种: 人民币 (CNY)</div>
      </div>

      <!-- 操作面板 -->
      <div class="md:col-span-2 bg-white rounded-lg shadow-md p-6">
        <div class="flex border-b mb-4">
          <button 
            @click="activeTab = 'topup'"
            :class="['px-4 py-2 font-medium', activeTab === 'topup' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500']"
          >充值</button>
          <button 
            @click="activeTab = 'refund'"
            :class="['px-4 py-2 font-medium', activeTab === 'refund' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500']"
          >退款</button>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">金额 (CNY)</label>
            <input 
              v-model.number="form.amount"
              type="number" 
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="请输入金额"
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">资金密码</label>
            <input 
              v-model="form.password"
              type="password"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="默认密码 123456"
            >
          </div>
          <div v-if="error" class="text-red-500 text-sm">{{ error }}</div>
          <div v-if="success" class="text-green-500 text-sm">{{ success }}</div>
          <button 
            type="submit" 
            :disabled="loading"
            class="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400"
          >
            {{ loading ? '处理中...' : (activeTab === 'topup' ? '立即充值' : '申请退款') }}
          </button>
        </form>
      </div>

      <!-- 交易日志 -->
      <div class="md:col-span-3 bg-white rounded-lg shadow-md p-6">
        <h2 class="text-xl font-bold mb-4">交易日志</h2>
        
        <!-- 过滤器 -->
        <div class="flex flex-wrap gap-4 mb-4 bg-gray-50 p-3 rounded">
          <div>
            <label class="text-sm text-gray-600 mr-2">类型:</label>
            <select v-model="filter.type" class="rounded border-gray-300 text-sm">
              <option value="">全部</option>
              <option value="TOP_UP">充值</option>
              <option value="REFUND">退款</option>
              <option value="PAYMENT">购买支付</option>
            </select>
          </div>
          <div>
            <label class="text-sm text-gray-600 mr-2">时间搜索:</label>
            <input v-model="filter.date" type="date" class="rounded border-gray-300 text-sm">
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">时间</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">交易类型</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">变动金额</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">变动后余额</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">相关订单</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="log in filteredLogs" :key="log.id">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ formatDate(log.timestamp) }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">
                  <span :class="[
                    'px-2 py-1 rounded-full text-xs font-medium',
                    log.type === 'TOP_UP' ? 'bg-green-100 text-green-800' :
                    log.type === 'REFUND' ? 'bg-red-100 text-red-800' :
                    'bg-blue-100 text-blue-800'
                  ]">
                    {{ getTypeText(log.type) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-bold" :class="log.type === 'TOP_UP' ? 'text-green-600' : 'text-red-600'">
                  {{ log.type === 'TOP_UP' ? '+' : '-' }} ¥ {{ log.amount }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-mono">¥ {{ log.balanceAfter }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-blue-500">{{ log.orderId || '-' }}</td>
              </tr>
              <tr v-if="filteredLogs.length === 0">
                <td colspan="5" class="px-6 py-10 text-center text-gray-500">暂无交易记录</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import { useAuth } from '@/composables/useAuth';
import { FundService } from '@/services/fundService';

const { currentUser } = useAuth();
const activeTab = ref('topup');
const loading = ref(false);
const error = ref('');
const success = ref('');

const form = reactive({
  amount: 0,
  password: ''
});

const filter = reactive({
  type: '',
  date: ''
});

const filteredLogs = computed(() => {
  if (!currentUser.value?.transactionLogs) return [];
  
  return currentUser.value.transactionLogs.filter(log => {
    const matchType = !filter.type || log.type === filter.type;
    const matchDate = !filter.date || log.timestamp.includes(filter.date);
    return matchType && matchDate;
  });
});

const handleSubmit = async () => {
  error.value = '';
  success.value = '';
  loading.value = true;

  try {
    const result = activeTab.value === 'topup' 
      ? await FundService.topUp(form.amount, form.password)
      : await FundService.refund(form.amount, form.password);

    if (result.success) {
      success.value = '操作成功！';
      form.amount = 0;
      form.password = '';
    } else {
      error.value = result.error || '操作失败';
    }
  } catch (e) {
    error.value = '系统繁忙，请稍后再试';
  } finally {
    loading.value = false;
  }
};

const formatDate = (isoStr: string) => {
  return new Date(isoStr).toLocaleString();
};

const getTypeText = (type: string) => {
  const map: Record<string, string> = {
    'TOP_UP': '充值',
    'REFUND': '退款',
    'PAYMENT': '购买支付'
  };
  return map[type] || type;
};
</script>
