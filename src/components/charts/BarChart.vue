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

const props = defineProps<{
  title: string;
  data: { date: string; value: number }[];
}>();

const chartRef = ref<HTMLDivElement>();
let chart: echarts.ECharts | null = null;

function initChart() {
  if (!chartRef.value) return;
  chart = echarts.init(chartRef.value, darkTheme);

  const option: echarts.EChartsOption = {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      backgroundColor: tooltipStyle.backgroundColor,
      borderColor: tooltipStyle.borderColor,
      textStyle: tooltipStyle.textStyle,
    },
    grid: { top: 20, right: 20, bottom: 30, left: 50 },
    xAxis: {
      type: 'category',
      data: props.data.map((d) => d.date),
      axisLine: { lineStyle: { color: 'rgba(139, 92, 246, 0.2)' } },
      axisLabel: { color: '#8b949e', fontSize: 11 },
    },
    yAxis: {
      type: 'value',
      splitLine: { lineStyle: { color: 'rgba(139, 92, 246, 0.05)' } },
      axisLabel: {
        color: '#8b949e',
        formatter: (v: number) => (v >= 1000 ? `${(v / 1000).toFixed(0)}k` : `${v}`),
      },
    },
    series: [
      {
        type: 'bar',
        data: props.data.map((d) => d.value),
        itemStyle: {
          borderRadius: [4, 4, 0, 0],
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#8b5cf6' },
            { offset: 1, color: 'rgba(139, 92, 246, 0.2)' },
          ]),
        },
        barWidth: '50%',
        emphasis: {
          itemStyle: { color: '#a78bfa' },
        },
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
  () => props.data,
  () => chart?.setOption({ series: [{ data: props.data.map((d) => d.value) }] }),
  {
    deep: true,
  },
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
