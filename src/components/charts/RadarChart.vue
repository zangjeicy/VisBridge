<template>
  <div class="chart-wrapper dashboard-card">
    <SectionTitle :title="title" />
    <div ref="chartRef" class="chart-body"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, onUnmounted } from 'vue';
import * as echarts from 'echarts';
import SectionTitle from '@/components/common/SectionTitle.vue';
import { darkTheme } from '@/utils/echarts';
import type { RadarIndicator } from '@/types/dashboard';

const props = defineProps<{
  title: string;
  indicators: RadarIndicator[];
  values: number[];
}>();

const chartRef = ref<HTMLDivElement>();
let chart: echarts.ECharts | null = null;

function initChart() {
  if (!chartRef.value) return;
  chart = echarts.init(chartRef.value, darkTheme);

  const option: echarts.EChartsOption = {
    tooltip: {},
    radar: {
      center: ['50%', '55%'],
      radius: '65%',
      indicator: props.indicators,
      axisName: { color: '#8b949e', fontSize: 11 },
      splitArea: {
        areaStyle: { color: ['rgba(84, 112, 198, 0.05)', 'rgba(84, 112, 198, 0.1)'] },
      },
    },
    series: [
      {
        type: 'radar',
        data: [
          {
            value: props.values,
            name: '当前表现',
            areaStyle: { color: 'rgba(145, 204, 117, 0.2)' },
            lineStyle: { color: '#91cc75', width: 2 },
            itemStyle: { color: '#91cc75' },
          },
        ],
      },
    ],
  };

  chart.setOption(option);
}

function handleResize() {
  chart?.resize();
}

onMounted(() => {
  initChart();
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
  chart?.dispose();
});

watch(
  () => [props.indicators, props.values],
  () => {
    chart?.setOption({
      radar: { indicator: props.indicators },
      series: [{ data: [{ value: props.values, name: '当前表现' }] }],
    });
  },
  { deep: true },
);
</script>

<style scoped lang="less">
.chart-wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.chart-body {
  flex: 1;
  min-height: 0;
}
</style>
