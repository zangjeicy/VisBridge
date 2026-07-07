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
  data: { name: string; value: number }[];
}>();

const chartRef = ref<HTMLDivElement>();
let chart: echarts.ECharts | null = null;

function initChart() {
  if (!chartRef.value) return;
  chart = echarts.init(chartRef.value, darkTheme);

  const option: echarts.EChartsOption = {
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} ({d}%)',
      backgroundColor: tooltipStyle.backgroundColor,
      borderColor: tooltipStyle.borderColor,
      textStyle: tooltipStyle.textStyle,
    },
    legend: {
      orient: 'vertical',
      right: 10,
      top: 'center',
      textStyle: { color: '#8b949e', fontSize: 11 },
    },
    series: [
      {
        type: 'pie',
        radius: ['45%', '75%'],
        center: ['35%', '50%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 4,
          borderColor: '#0a1628',
          borderWidth: 3,
        },
        label: { show: false },
        emphasis: {
          label: { show: true, fontSize: 14, fontWeight: 'bold', color: '#e6edf3' },
          scaleSize: 10,
        },
        data: props.data,
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
  () => chart?.setOption({ series: [{ data: props.data }] }),
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
