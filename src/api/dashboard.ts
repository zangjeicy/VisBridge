import type {
  DashboardData,
  OverviewData,
  TrendPoint,
  CategoryItem,
  ScatterPoint,
  PerformanceData,
  HubNode,
} from '@/types/dashboard';
import { request } from './request';

export const dashboardApi = {
  getOverview: () => request<OverviewData>('/api/dashboard/overview'),
  getSalesTrend: () => request<TrendPoint[]>('/api/dashboard/sales-trend'),
  getUserGrowth: () => request<TrendPoint[]>('/api/dashboard/user-growth'),
  getCategorySales: () => request<CategoryItem[]>('/api/dashboard/category-sales'),
  getOrderScatter: () => request<ScatterPoint[]>('/api/dashboard/order-scatter'),
  getPerformanceRadar: () => request<PerformanceData>('/api/dashboard/performance-radar'),
  getHubNodes: () => request<HubNode[]>('/api/dashboard/hub-nodes'),

  fetchAll: async (): Promise<DashboardData> => {
    const [
      overview,
      salesTrend,
      userGrowth,
      categorySales,
      orderScatter,
      performanceRadar,
      hubNodes,
    ] = await Promise.all([
      dashboardApi.getOverview(),
      dashboardApi.getSalesTrend(),
      dashboardApi.getUserGrowth(),
      dashboardApi.getCategorySales(),
      dashboardApi.getOrderScatter(),
      dashboardApi.getPerformanceRadar(),
      dashboardApi.getHubNodes(),
    ]);
    return {
      overview,
      salesTrend,
      userGrowth,
      categorySales,
      orderScatter,
      performanceRadar,
      hubNodes,
    };
  },
};
