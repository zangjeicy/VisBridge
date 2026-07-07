import { http, HttpResponse } from 'msw';

/* ====== 实时模拟状态机 ====== */
function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randDelta(delta: number) {
  return (Math.random() - 0.5) * 2 * delta;
}

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

// ---- 总览指标 ----
const overview = {
  totalUsers: 12846,
  totalOrders: 8842,
  revenue: 3456789.5,
  conversionRate: 0.1264,
};

function tickOverview() {
  overview.totalUsers += randInt(1, 5);
  overview.totalOrders += randInt(1, 3);
  overview.revenue += randInt(300, 1200);
  overview.revenue = Math.round(overview.revenue * 100) / 100;
  overview.conversionRate += randDelta(0.0015);
  overview.conversionRate = clamp(Math.round(overview.conversionRate * 10000) / 10000, 0.05, 0.25);
}

// ---- 销售趋势基线 ----
const salesBaselines = [
  38000, 36000, 42000, 48000, 52000, 58000, 49000, 45000, 55000, 60000, 53000, 46000,
];

function tickSalesBaselines() {
  for (let i = 0; i < salesBaselines.length; i++) {
    salesBaselines[i] += randDelta(600);
    salesBaselines[i] = clamp(Math.round(salesBaselines[i]), 20000, 80000);
  }
}

// ---- 用户增长基线 ----
const userGrowthBaselines = [
  8500, 9200, 9800, 10500, 11200, 12000, 12700, 13500, 14300, 15000, 15700, 16200,
];

function tickUserGrowthBaselines() {
  for (let i = 0; i < userGrowthBaselines.length; i++) {
    userGrowthBaselines[i] += randInt(3, 15);
    userGrowthBaselines[i] = clamp(userGrowthBaselines[i], 7000, 25000);
  }
}

// ---- 品类基线 ----
const categoryBases = [
  { name: '电子产品', base: 850000 },
  { name: '服装鞋帽', base: 620000 },
  { name: '食品饮料', base: 480000 },
  { name: '家居用品', base: 350000 },
  { name: '图书音像', base: 210000 },
  { name: '其他', base: 150000 },
];

function tickCategoryBases() {
  for (const item of categoryBases) {
    item.base += randInt(100, 3000);
    item.base = clamp(item.base, 100000, 1200000);
  }
}

// ---- 散点数据 ----
const scatterPoints = Array.from({ length: 60 }, () => ({
  x: Math.random() * 500 + 100,
  y: Math.random() * 5000 + 1000,
}));

function tickScatter() {
  for (const pt of scatterPoints) {
    pt.x += randDelta(12);
    pt.y += randDelta(200);
    pt.x = clamp(pt.x, 50, 600);
    pt.y = clamp(pt.y, 500, 6500);
  }
}

// ---- 雷达绩效基线 ----
const radarValues = [85, 72, 58, 63, 91];

function tickRadar() {
  for (let i = 0; i < radarValues.length; i++) {
    radarValues[i] += randDelta(2);
    radarValues[i] = clamp(Math.round(radarValues[i]), 30, 98);
  }
}

// ---- 中枢节点基线 ----
const hubNodeBases = [
  {
    id: 'course',
    baseline: 90,
    statusRange: { good: [80, 100], warning: [60, 79], danger: [0, 59] },
  },
  {
    id: 'project',
    baseline: 86,
    statusRange: { good: [80, 100], warning: [60, 79], danger: [0, 59] },
  },
  {
    id: 'exam',
    baseline: 76,
    statusRange: { good: [80, 100], warning: [60, 79], danger: [0, 59] },
  },
  {
    id: 'community',
    baseline: 65,
    statusRange: { good: [80, 100], warning: [50, 79], danger: [0, 49] },
  },
  {
    id: 'resource',
    baseline: 60,
    statusRange: { good: [80, 100], warning: [50, 79], danger: [0, 49] },
  },
  {
    id: 'system',
    baseline: 96,
    statusRange: { good: [80, 100], warning: [60, 79], danger: [0, 59] },
  },
  {
    id: 'report',
    baseline: 72,
    statusRange: { good: [80, 100], warning: [50, 79], danger: [0, 49] },
  },
  {
    id: 'notification',
    baseline: 84,
    statusRange: { good: [80, 100], warning: [60, 79], danger: [0, 59] },
  },
];

const hubMeta: Record<string, { name: string; description: string; coord: [number, number] }> = {
  course: { name: '课程学习', description: '课程访问与学习进度保持高活跃', coord: [50, 18] },
  project: { name: '项目实战', description: '实战任务提交量稳定增长', coord: [78, 30] },
  exam: { name: '考试测评', description: '部分科目通过率需要提升', coord: [85, 55] },
  community: { name: '社区互动', description: '讨论活跃度持续上升', coord: [78, 75] },
  resource: { name: '资源中心', description: '下载量偏低，需优化推荐策略', coord: [50, 85] },
  system: { name: '系统监控', description: '服务器运行稳定，响应及时', coord: [22, 75] },
  report: { name: '数据分析', description: '报表生成正常，数据准确', coord: [15, 55] },
  notification: { name: '消息通知', description: '推送到达率保持在较高水平', coord: [22, 30] },
};

function tickHubNodes() {
  for (const node of hubNodeBases) {
    node.baseline += randDelta(2.5);
    node.baseline = clamp(Math.round(node.baseline), 20, 100);
  }
}

function determineStatus(value: number): 'good' | 'warning' | 'danger' {
  if (value >= 80) return 'good';
  if (value >= 55) return 'warning';
  return 'danger';
}

// 全局 tick 计数器
let tickCount = 0;

function tickAll() {
  tickCount++;
  tickOverview();
  if (tickCount % 2 === 0) tickSalesBaselines();
  tickUserGrowthBaselines();
  tickCategoryBases();
  tickScatter();
  tickRadar();
  tickHubNodes();
}

/* ====== MSW Handlers ====== */
export const handlers = [
  http.get('/api/dashboard/overview', () => {
    tickAll();
    return HttpResponse.json({
      code: 200,
      data: {
        totalUsers: overview.totalUsers,
        totalOrders: overview.totalOrders,
        revenue: overview.revenue,
        conversionRate: overview.conversionRate,
      },
    });
  }),

  http.get('/api/dashboard/sales-trend', () => {
    const months = [
      '1月',
      '2月',
      '3月',
      '4月',
      '5月',
      '6月',
      '7月',
      '8月',
      '9月',
      '10月',
      '11月',
      '12月',
    ];
    return HttpResponse.json({
      code: 200,
      data: months.map((date, i) => ({
        date,
        value: salesBaselines[i] + randInt(-800, 800),
      })),
    });
  }),

  http.get('/api/dashboard/user-growth', () => {
    const months = [
      '1月',
      '2月',
      '3月',
      '4月',
      '5月',
      '6月',
      '7月',
      '8月',
      '9月',
      '10月',
      '11月',
      '12月',
    ];
    return HttpResponse.json({
      code: 200,
      data: months.map((date, i) => ({
        date,
        value: userGrowthBaselines[i] + randInt(-100, 100),
      })),
    });
  }),

  http.get('/api/dashboard/category-sales', () => {
    return HttpResponse.json({
      code: 200,
      data: categoryBases.map((c) => ({
        name: c.name,
        value: Math.round(c.base + randDelta(5000)),
      })),
    });
  }),

  http.get('/api/dashboard/order-scatter', () => {
    return HttpResponse.json({
      code: 200,
      data: scatterPoints.map((pt, i) => ({
        x: Math.round(pt.x + randDelta(5)),
        y: Math.round(pt.y + randDelta(100)),
        name: `订单${i + 1}`,
      })),
    });
  }),

  http.get('/api/dashboard/performance-radar', () => {
    return HttpResponse.json({
      code: 200,
      data: {
        indicators: [
          { name: '销售额', max: 100 },
          { name: '客流量', max: 100 },
          { name: '转化率', max: 100 },
          { name: '复购率', max: 100 },
          { name: '好评率', max: 100 },
        ],
        values: radarValues.map((v) => Math.round(v + randDelta(1))),
      },
    });
  }),

  http.get('/api/dashboard/hub-nodes', () => {
    return HttpResponse.json({
      code: 200,
      data: hubNodeBases.map((node) => {
        const meta = hubMeta[node.id];
        const value = clamp(Math.round(node.baseline + randDelta(1.5)), 20, 100);
        return {
          id: node.id,
          name: meta?.name ?? node.id,
          value,
          coord: meta?.coord ?? ([50, 50] as [number, number]),
          status: determineStatus(value),
          description: meta?.description ?? '',
        };
      }),
    });
  }),
];
