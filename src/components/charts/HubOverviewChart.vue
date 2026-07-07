<template>
  <div class="chart-wrapper">
    <SectionTitle :title="title" />
    <div ref="chartRef" class="chart-body" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, onUnmounted, nextTick } from 'vue';
import * as echarts from 'echarts';
import SectionTitle from '@/components/common/SectionTitle.vue';
import type { HubNode } from '@/types/dashboard';

const props = defineProps<{
  title: string;
  data: HubNode[];
}>();

const chartRef = ref<HTMLDivElement>();
let chart: echarts.ECharts | null = null;

const statusColors: Record<string, string> = {
  good: '#00d4aa',
  warning: '#fac858',
  danger: '#ee6666',
};

function buildSeriesOptions() {
  return [
    {
      type: 'scatter',
      coordinateSystem: 'cartesian2d',
      data: [[50, 50]],
      symbolSize: 80,
      itemStyle: {
        color: new echarts.graphic.RadialGradient(0.5, 0.5, 1, [
          { offset: 0, color: '#00d4aa' },
          { offset: 0.5, color: '#0099cc' },
          { offset: 1, color: '#004466' },
        ]),
        shadowBlur: 40,
        shadowColor: 'rgba(0, 212, 170, 0.6)',
      },
      label: {
        show: true,
        position: 'bottom' as const,
        distance: 15,
        color: '#00d4aa',
        fontSize: 16,
        fontWeight: 'bold' as const,
        formatter: '数据中枢',
      },
      zlevel: 10,
    },
    {
      type: 'scatter',
      coordinateSystem: 'cartesian2d',
      data: [[50, 50]],
      symbolSize: 200,
      itemStyle: {
        color: new echarts.graphic.RadialGradient(0.5, 0.5, 1, [
          { offset: 0, color: 'rgba(0, 212, 170, 0.1)' },
          { offset: 1, color: 'transparent' },
        ]),
      },
      zlevel: 0,
    },
    {
      type: 'scatter',
      coordinateSystem: 'cartesian2d',
      data: [[50, 50]],
      symbolSize: 150,
      itemStyle: {
        color: new echarts.graphic.RadialGradient(0.5, 0.5, 1, [
          { offset: 0, color: 'rgba(0, 153, 204, 0.08)' },
          { offset: 1, color: 'transparent' },
        ]),
      },
      zlevel: 0,
    },
    {
      type: 'lines',
      coordinateSystem: 'cartesian2d',
      data: props.data.map((node) => ({
        coords: [
          [50, 50],
          [node.coord[0], node.coord[1]],
        ],
      })),
      lineStyle: {
        color: 'rgba(0, 212, 170, 0.3)',
        width: 2,
        curveness: 0.15,
      },
      effect: {
        show: true,
        color: '#00d4aa',
        trailLength: 0.8,
        period: 3,
      },
      zlevel: 5,
    },
    {
      type: 'effectScatter',
      coordinateSystem: 'cartesian2d',
      data: props.data.map((node) => ({
        value: [node.coord[0], node.coord[1]],
        name: node.name,
        symbolSize: node.value * 0.8 + 30,
        itemStyle: {
          color: new echarts.graphic.RadialGradient(0.5, 0.5, 1, [
            { offset: 0, color: statusColors[node.status] },
            { offset: 1, color: `${statusColors[node.status]}40` },
          ]),
          shadowBlur: 20,
          shadowColor: `${statusColors[node.status]}80`,
          borderRadius: 8,
        },
        label: {
          show: true,
          position: 'bottom' as const,
          distance: 5,
          color: '#e6edf3',
          fontSize: 12,
        },
        status: node.status,
        description: node.description,
      })),
      rippleEffect: {
        brushType: 'stroke' as const,
        scale: 2,
        period: 2,
      },
      zlevel: 8,
    },
  ] as unknown as echarts.EChartsOption['series'];
}

function initChart() {
  if (!chartRef.value) return;
  if (chart) {
    chart.dispose();
  }
  chart = echarts.init(chartRef.value);

  const option: echarts.EChartsOption = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(10, 30, 50, 0.95)',
      borderColor: 'rgba(0, 212, 170, 0.3)',
      borderWidth: 1,
      padding: [12, 16],
      textStyle: {
        color: '#e6edf3',
        fontSize: 13,
      },
      formatter: (params: unknown) => {
        const p = params as {
          name: string;
          value?: number;
          data?: { status?: string; description?: string };
        };
        const statusText: Record<string, string> = {
          good: '<span style="color:#00d4aa">运行正常</span>',
          warning: '<span style="color:#fac858">需要关注</span>',
          danger: '<span style="color:#ee6666">异常告警</span>',
        };
        return `
          <div style="font-weight:bold;font-size:14px;margin-bottom:8px;color:#00d4aa">${p.name}</div>
          <div style="margin-bottom:4px">状态：${statusText[p.data?.status || ''] || '未知'}</div>
          <div style="margin-bottom:4px">活跃度：${p.value || 0}</div>
          <div style="color:#8b949e;font-size:12px">${p.data?.description || ''}</div>
        `;
      },
    },
    xAxis: {
      type: 'value',
      show: false,
      min: 0,
      max: 100,
    },
    yAxis: {
      type: 'value',
      show: false,
      min: 0,
      max: 100,
    },
    grid: {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
    },
    series: buildSeriesOptions(),
  };

  chart.setOption(option);
}

function handleResize() {
  nextTick(() => {
    chart?.resize();
  });
}

onMounted(() => {
  nextTick(() => {
    initChart();
  });
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
  chart?.dispose();
});

watch(
  () => props.data,
  () => {
    if (!chart) return;
    const seriesOption = buildSeriesOptions();
    nextTick(() => {
      chart?.setOption({ series: seriesOption }, { notMerge: false });
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
  position: relative;

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
}
</style>
