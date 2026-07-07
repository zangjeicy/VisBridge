<template>
  <DashboardLayout>
    <div class="home-view">
      <div class="overview-row">
        <NumberCard
          v-for="card in overviewCards"
          :key="card.label"
          :label="card.label"
          :value="card.value"
          :value-type="card.valueType"
          :trend="card.trend"
        />
      </div>

      <div class="chart-row">
        <LineChart title="月度销售趋势" :data="store.salesTrend" />
        <BarChart title="月度用户增长" :data="store.userGrowth" />
      </div>

      <div class="chart-row three-col">
        <PieChart title="品类销售分布" :data="store.categorySales" />
        <ScatterChart title="客单价与订单量关系" :data="store.orderScatter" />
        <RadarChart
          v-if="store.performanceRadar"
          title="综合绩效雷达"
          :indicators="store.performanceRadar.indicators"
          :values="store.performanceRadar.values"
        />
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import DashboardLayout from '@/layouts/DashboardLayout.vue';
import NumberCard from '@/components/common/NumberCard.vue';
import LineChart from '@/components/charts/LineChart.vue';
import BarChart from '@/components/charts/BarChart.vue';
import PieChart from '@/components/charts/PieChart.vue';
import ScatterChart from '@/components/charts/ScatterChart.vue';
import RadarChart from '@/components/charts/RadarChart.vue';
import { useDashboardStore } from '@/stores/dashboard';
import { useDataRefresh } from '@/composables/useDataRefresh';
import { logger } from '@/logger';

const store = useDashboardStore();

useDataRefresh(() => {
  logger.info('HomeView', 'Auto refresh triggered');
  store.fetchAllData();
}, 30000);

onMounted(() => {
  store.fetchAllData();
});

const overviewCards = computed(() => {
  const overview = store.overview;
  if (!overview) return [];
  return [
    { label: '用户总数', value: overview.totalUsers, valueType: 'number' as const, trend: 12.5 },
    { label: '订单总量', value: overview.totalOrders, valueType: 'number' as const, trend: 8.3 },
    { label: '总收入', value: overview.revenue, valueType: 'currency' as const, trend: -3.2 },
    { label: '转化率', value: overview.conversionRate, valueType: 'percent' as const, trend: 5.7 },
  ];
});
</script>

<style scoped lang="less">
@import '@/styles/variables.less';

.home-view {
  display: flex;
  flex-direction: column;
  gap: @spacing-md;
  height: 100%;
  overflow: hidden;
}

.overview-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: @spacing-md;
}

.chart-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: @spacing-md;
  flex: 1;
  min-height: 0;

  &.three-col {
    grid-template-columns: 1fr 1fr 1fr;
  }
}
</style>
