import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('/api/dashboard/overview', () => {
    return HttpResponse.json({
      code: 200,
      data: {
        totalUsers: 12846,
        totalOrders: 8842,
        revenue: 3456789.5,
        conversionRate: 0.1264,
      },
    });
  }),

  http.get('/api/dashboard/sales-trend', () => {
    const months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
    const data = months.map((date) => ({
      date,
      value: Math.floor(Math.random() * 50000 + 30000),
    }));
    return HttpResponse.json({ code: 200, data });
  }),

  http.get('/api/dashboard/user-growth', () => {
    const months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
    let base = 8000;
    const data = months.map((date) => {
      base += Math.floor(Math.random() * 800 + 200);
      return { date, value: base };
    });
    return HttpResponse.json({ code: 200, data });
  }),

  http.get('/api/dashboard/category-sales', () => {
    return HttpResponse.json({
      code: 200,
      data: [
        { name: '电子产品', value: 850000 },
        { name: '服装鞋帽', value: 620000 },
        { name: '食品饮料', value: 480000 },
        { name: '家居用品', value: 350000 },
        { name: '图书音像', value: 210000 },
        { name: '其他', value: 150000 },
      ],
    });
  }),

  http.get('/api/dashboard/order-scatter', () => {
    const data = Array.from({ length: 60 }, (_, i) => ({
      x: Math.floor(Math.random() * 500 + 100),
      y: Math.floor(Math.random() * 5000 + 1000),
      name: `订单${i + 1}`,
    }));
    return HttpResponse.json({ code: 200, data });
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
        values: [85, 72, 58, 63, 91],
      },
    });
  }),
];
