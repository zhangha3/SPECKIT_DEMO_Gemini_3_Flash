<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { StatsService } from '@/services/statsService';
import type { Schedule } from '@/models/schedule';
import type { Port } from '@/models/port';

interface HotItem {
  schedule: Schedule;
  bookingCount: number;
}

const props = defineProps<{
  ports: Port[];
}>();

const emit = defineEmits(['select-route']);

const hotSchedules = ref<HotItem[]>([]);

onMounted(() => {
  hotSchedules.value = StatsService.getHotSchedules();
});

const handleSelect = (s: Schedule) => {
  emit('select-route', {
    origin: s.originPort,
    destination: s.destinationPort
  });
};

const getPortName = (code: string) => {
  return props.ports.find(p => p.code === code)?.name_cn || code;
};
</script>

<template>
  <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
    <div class="p-4 border-b border-slate-100 bg-slate-50 flex items-center gap-2">
      <div class="p-1.5 bg-rose-100 rounded-lg">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-rose-600" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.334-.398-1.817a1 1 0 00-1.487-.876 6.752 6.752 0 00-3.326 5.733c0 3.432 2.724 6.221 6.084 6.221s6.084-2.789 6.084-6.221c0-1.282-.399-2.526-1.057-3.546a1 1 0 00-1.456-.362c-1.047.707-1.554 1.798-1.554 2.915a1 1 0 01-1.996.07c0-1.353.111-2.704.332-4.004.14-.824.324-1.611.533-2.313.21-.706.416-1.21.574-1.472.046-.076.079-.125.097-.152a.25.25 0 01.033-.042z" clip-rule="evenodd" />
        </svg>
      </div>
      <h3 class="font-bold text-slate-900 text-sm">热门船期推荐</h3>
      <span class="text-[10px] text-slate-400 font-medium ml-auto">LAST 7 DAYS</span>
    </div>

    <div class="p-4 space-y-4">
      <div v-if="hotSchedules.length === 0" class="py-10 text-center">
        <p class="text-xs text-slate-400">暂无热门数据</p>
      </div>
      
      <div 
        v-for="(item, index) in hotSchedules" 
        :key="item.schedule.id" 
        @click="handleSelect(item.schedule)"
        class="flex items-start gap-4 p-3 rounded-xl hover:bg-indigo-50 transition-colors group relative cursor-pointer active:scale-[0.98]"
      >
        <!-- Rank Badge -->
        <div 
          class="absolute -left-1 -top-1 w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black shadow-sm z-10"
          :class="[
            index === 0 ? 'bg-amber-400 text-amber-900' : 
            index === 1 ? 'bg-slate-300 text-slate-700' : 
            'bg-orange-200 text-orange-800'
          ]"
        >
          {{ index + 1 }}
        </div>

        <div class="flex-1 min-w-0">
          <div class="flex items-center justify-between mb-1">
            <span class="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded uppercase">{{ item.schedule.carrier.substring(0, 3) }}</span>
            <span class="text-[10px] font-medium text-slate-400">{{ item.bookingCount }} 人已订</span>
          </div>
          <p class="text-xs font-bold text-slate-800 truncate">{{ item.schedule.vesselName }}</p>
          <div class="mt-2 flex items-center gap-2 text-[10px] text-slate-500 font-medium">
            <span class="truncate">{{ getPortName(item.schedule.originPort) }}</span>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 text-slate-300 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
            <span class="truncate">{{ getPortName(item.schedule.destinationPort) }}</span>
          </div>
          <div class="mt-2 flex items-baseline justify-between">
            <span class="text-xs font-black text-rose-600">¥{{ (item.schedule as any).price }}</span>
            <span class="text-[10px] text-slate-400">库存: {{ item.schedule.inventory }}</span>
          </div>
        </div>
      </div>
    </div>
    
    <div class="p-4 bg-slate-50 border-t border-slate-100 italic text-[10px] text-slate-400 text-center">
      提示: 热门数据每小时更新一次
    </div>
  </div>
</template>
