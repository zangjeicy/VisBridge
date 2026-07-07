import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { DashboardData, OverviewData, TrendPoint, CategoryItem, ScatterPoint, PerformanceData } from '@/types/dashboard';
import { dashboardApi } from '@/api/dashboard';
import { logger } from '@/logger';

export const useDashboardStore = defineStore('dashboard', () => {
  const overview = ref<OverviewData | null>(null);
  const salesTrend = ref<TrendPoint[]>([]);
  const userGrowth = ref<TrendPoint[]>([]);
  const categorySales = ref<CategoryItem[]>([]);
  const orderScatter = ref<ScatterPoint[]>([]);
  const performanceRadar = ref<PerformanceData | null>(null);
  const loading = ref(false);
  const lastUpdateTime = ref('');
  const error = ref<string | null>(null);

  const hasData = computed(() => overview.value !== null);
  const totalCategorySales = computed(() =>
    categorySales.value.reduce((sum, item) => sum + item.value, 0),
  );

  async function fetchAllData() {
    loading.value = true;
    error.value = null;

    try {
      const data: DashboardData = await dashboardApi.fetchAll();
      overview.value = data.overview;
      salesTrend.value = data.salesTrend;
      userGrowth.value = data.userGrowth;
      categorySales.value = data.categorySales;
      orderScatter.value = data.orderScatter;
      performanceRadar.value = data.performanceRadar;
      lastUpdateTime.value = new Date().toLocaleTimeString('zh-CN');
      logger.info('DashboardStore', 'Data loaded successfully');
    } catch (err) {
      error.value = '数据加载失败';
      logger.error('DashboardStore', 'Failed to load data', err);
    } finally {
      loading.value = false;
    }
  }

  return {
    overview,
    salesTrend,
    userGrowth,
    categorySales,
    orderScatter,
    performanceRadar,
    loading,
    lastUpdateTime,
    error,
    hasData,
    totalCategorySales,
    fetchAllData,
  };
});
