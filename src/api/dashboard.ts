import type {
  DashboardData,
  OverviewData,
  TrendPoint,
  CategoryItem,
  ScatterPoint,
  PerformanceData,
} from '@/types/dashboard';
import { request } from './request';

export const dashboardApi = {
  getOverview: () => request<OverviewData>('/api/dashboard/overview'),
  getSalesTrend: () => request<TrendPoint[]>('/api/dashboard/sales-trend'),
  getUserGrowth: () => request<TrendPoint[]>('/api/dashboard/user-growth'),
  getCategorySales: () => request<CategoryItem[]>('/api/dashboard/category-sales'),
  getOrderScatter: () => request<ScatterPoint[]>('/api/dashboard/order-scatter'),
  getPerformanceRadar: () => request<PerformanceData>('/api/dashboard/performance-radar'),

  fetchAll: async (): Promise<DashboardData> => {
    const [overview, salesTrend, userGrowth, categorySales, orderScatter, performanceRadar] =
      await Promise.all([
        dashboardApi.getOverview(),
        dashboardApi.getSalesTrend(),
        dashboardApi.getUserGrowth(),
        dashboardApi.getCategorySales(),
        dashboardApi.getOrderScatter(),
        dashboardApi.getPerformanceRadar(),
      ]);
    return { overview, salesTrend, userGrowth, categorySales, orderScatter, performanceRadar };
  },
};
