<template>
  <div class="chart-wrapper">
    <SectionTitle :title="title" />
    <div ref="chartRef" class="chart-body" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, onUnmounted } from 'vue';
import * as echarts from 'echarts';
import SectionTitle from '@/components/common/SectionTitle.vue';
import { darkTheme, tooltipStyle } from '@/utils/echarts';
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
    tooltip: {
      backgroundColor: tooltipStyle.backgroundColor,
      borderColor: tooltipStyle.borderColor,
      textStyle: tooltipStyle.textStyle,
    },
    radar: {
      center: ['50%', '55%'],
      radius: '65%',
      indicator: props.indicators,
      axisName: { color: '#8b949e', fontSize: 11 },
      splitArea: {
        areaStyle: { color: ['rgba(139, 92, 246, 0.05)', 'rgba(139, 92, 246, 0.1)'] },
      },
      axisLine: { lineStyle: { color: 'rgba(139, 92, 246, 0.2)' } },
      splitLine: { lineStyle: { color: 'rgba(139, 92, 246, 0.1)' } },
    },
    series: [
      {
        type: 'radar',
        data: [
          {
            value: props.values,
            name: '当前表现',
            areaStyle: { color: 'rgba(245, 158, 11, 0.2)' },
            lineStyle: { color: '#f59e0b', width: 2 },
            itemStyle: { color: '#f59e0b' },
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
@import '@/styles/variables.less';

.chart-wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: @bg-card;
  border: 1px solid @border-color;
  border-radius: 8px;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: @gradient-primary;
    opacity: 0.5;
  }
}
.chart-body {
  flex: 1;
  min-height: 0;
  position: relative;
}
</style>
