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
  data: { x: number; y: number; name: string }[];
}>();

const chartRef = ref<HTMLDivElement>();
let chart: echarts.ECharts | null = null;

function initChart() {
  if (!chartRef.value) return;
  chart = echarts.init(chartRef.value, darkTheme);

  const option: echarts.EChartsOption = {
    tooltip: {
      trigger: 'item',
      formatter: (p: unknown) => {
        const params = p as { data: number[] };
        return `客单价: ¥${params.data[0]}<br/>订单量: ${params.data[1]}`;
      },
      backgroundColor: tooltipStyle.backgroundColor,
      borderColor: tooltipStyle.borderColor,
      textStyle: tooltipStyle.textStyle,
    },
    grid: { top: 20, right: 20, bottom: 40, left: 60 },
    xAxis: {
      name: '客单价 (¥)',
      nameLocation: 'middle' as const,
      nameGap: 25,
      nameTextStyle: { color: '#8b949e' },
      axisLine: { lineStyle: { color: 'rgba(0, 180, 216, 0.2)' } },
      axisLabel: { color: '#8b949e' },
      splitLine: { lineStyle: { color: 'rgba(0, 180, 216, 0.05)' } },
    },
    yAxis: {
      name: '订单量',
      nameTextStyle: { color: '#8b949e' },
      axisLine: { lineStyle: { color: 'rgba(0, 180, 216, 0.2)' } },
      axisLabel: { color: '#8b949e' },
      splitLine: { lineStyle: { color: 'rgba(0, 180, 216, 0.05)' } },
    },
    series: [
      {
        type: 'scatter',
        data: props.data.map((d) => [d.x, d.y]),
        symbolSize: 8,
        itemStyle: {
          color: '#fac858',
          shadowBlur: 10,
          shadowColor: 'rgba(250, 200, 88, 0.5)',
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
  () => chart?.setOption({ series: [{ data: props.data.map((d) => [d.x, d.y]) }] }),
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
