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
      backgroundColor: tooltipStyle.backgroundColor,
      borderColor: tooltipStyle.borderColor,
      textStyle: tooltipStyle.textStyle,
    },
    grid: { top: 20, right: 20, bottom: 30, left: 50 },
    xAxis: {
      type: 'category',
      data: props.data.map((d) => d.date),
      axisLine: { lineStyle: { color: 'rgba(0, 180, 216, 0.2)' } },
      axisLabel: { color: '#8b949e', fontSize: 11 },
    },
    yAxis: {
      type: 'value',
      splitLine: { lineStyle: { color: 'rgba(0, 180, 216, 0.05)' } },
      axisLabel: { color: '#8b949e' },
    },
    series: [
      {
        type: 'line',
        data: props.data.map((d) => d.value),
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
        lineStyle: { width: 3, color: '#00b4d8' },
        itemStyle: { color: '#00b4d8' },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(0, 180, 216, 0.3)' },
            { offset: 1, color: 'rgba(0, 180, 216, 0.02)' },
          ]),
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
  () => {
    chart?.setOption({
      xAxis: { data: props.data.map((d) => d.date) },
      series: [{ data: props.data.map((d) => d.value) }],
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
