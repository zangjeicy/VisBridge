export interface OverviewData {
  totalUsers: number;
  totalOrders: number;
  revenue: number;
  conversionRate: number;
}

export interface TrendPoint {
  date: string;
  value: number;
}

export interface CategoryItem {
  name: string;
  value: number;
}

export interface ScatterPoint {
  x: number;
  y: number;
  name: string;
}

export interface HubNode {
  id: string;
  name: string;
  value: number;
  coord: [number, number];
  status: 'good' | 'warning' | 'danger';
  description: string;
}

export interface RadarIndicator {
  name: string;
  max: number;
}

export interface PerformanceData {
  indicators: RadarIndicator[];
  values: number[];
}

export interface DashboardData {
  overview: OverviewData;
  salesTrend: TrendPoint[];
  userGrowth: TrendPoint[];
  categorySales: CategoryItem[];
  orderScatter: ScatterPoint[];
  performanceRadar: PerformanceData;
  hubNodes: HubNode[];
}
