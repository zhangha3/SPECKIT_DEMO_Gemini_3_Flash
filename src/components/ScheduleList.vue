<script setup lang="ts">
import type { Schedule } from '@/models/schedule';
import type { Port } from '@/models/port';

interface Props {
  schedules: Schedule[];
  ports: Port[];
}

const props = defineProps<Props>();

const formatLocalTime = (etd: string, portCode: string) => {
  const port = props.ports.find(p => p.code === portCode);
  if (!port) return etd;

  try {
    const date = new Date(etd);
    // Format to local time string based on timezone
    const localStr = date.toLocaleString('zh-CN', {
      timeZone: port.timezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
    
    const tzName = port.timezone.split('/').pop()?.replace('_', ' ') || port.timezone;
    return `${localStr} (${tzName})`;
  } catch (e) {
    return etd;
  }
};
</script>

<template>
  <div class="grid gap-6">
    <div 
      v-for="s in schedules" 
      :key="s.id" 
      class="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden group"
    >
      <div class="flex flex-col lg:flex-row lg:items-center">
        <!-- Logo & Vessel Info -->
        <div class="p-6 bg-slate-50 lg:w-64 border-b lg:border-b-0 lg:border-r border-slate-100 flex flex-col items-center text-center justify-center">
          <div class="w-16 h-16 bg-white rounded-xl shadow-inner border border-slate-100 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <span class="text-2xl font-black text-indigo-600 italic">{{ s.carrier.substring(0, 1) }}</span>
          </div>
          <h3 class="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors uppercase text-sm tracking-tight">{{ s.vesselName }}</h3>
          <p class="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">{{ s.carrier }}</p>
        </div>

        <!-- Route Info -->
        <div class="flex-1 p-6 flex flex-col md:flex-row items-center gap-8 justify-between">
          <div class="flex-1 flex items-center gap-10 w-full justify-center md:justify-start">
            <!-- Origin -->
            <div class="text-center md:text-left min-w-[100px]">
              <div class="text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-widest">Origin</div>
              <div class="text-2xl font-black text-slate-900 leading-none">{{ s.originPort }}</div>
              <div class="text-sm text-slate-500 mt-1 truncate max-w-[120px]">
                {{ ports.find(p => p.code === s.originPort)?.name_cn || 'Unknown' }}
              </div>
            </div>

            <!-- Path -->
            <div class="flex-1 flex flex-col items-center gap-2 max-w-[180px] min-w-[80px]">
              <span class="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full ring-1 ring-indigo-100 uppercase tracking-tighter">
                {{ s.duration }} DAYS
              </span>
              <div class="w-full h-[2px] bg-gradient-to-r from-slate-100 via-indigo-300 to-slate-100 relative">
                <div class="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-slate-300"></div>
                <div class="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
                <div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-indigo-400">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 fill-current rotate-90" viewBox="0 0 20 20">
                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                  </svg>
                </div>
              </div>
            </div>

            <!-- Destination -->
            <div class="text-center md:text-left min-w-[100px]">
              <div class="text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-widest">Destination</div>
              <div class="text-2xl font-black text-slate-900 leading-none">{{ s.destinationPort }}</div>
              <div class="text-sm text-slate-500 mt-1 truncate max-w-[120px]">
                {{ ports.find(p => p.code === s.destinationPort)?.name_cn || 'Unknown' }}
              </div>
            </div>
          </div>

          <!-- ETD Stats -->
          <div class="md:w-64 w-full pt-6 md:pt-0 md:pl-8 md:border-l border-slate-100 flex flex-col justify-center">
             <div class="text-[10px] font-bold text-slate-400 mb-2 uppercase tracking-widest text-center md:text-right">Estimated Departure (Local)</div>
             <div class="bg-indigo-600 text-white px-4 py-2.5 rounded-xl text-[13px] font-mono font-bold whitespace-nowrap text-center shadow-lg shadow-indigo-100">
               {{ formatLocalTime(s.etd, s.originPort) }}
             </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
