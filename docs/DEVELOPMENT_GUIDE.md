# VisBridge 数据大屏项目开发指南

> 基于现有项目架构的完整扩展方案

---

## 目录

1. [项目概述](#1-项目概述)
2. [技术架构设计](#2-技术架构设计)
3. [技术栈选型](#3-技术栈选型)
4. [数据库设计](#4-数据库设计)
5. [API 接口规范](#5-api-接口规范)
6. [前端组件开发](#6-前端组件开发)
7. [数据处理流程](#7-数据处理流程)
8. [趋势预测算法](#8-趋势预测算法)
9. [部署流程](#9-部署流程)
10. [质量标准与交付物](#10-质量标准与交付物)

---

## 1. 项目概述

### 1.1 项目定位

本项目是在现有 **VisBridge** 数据大屏基础上进行的功能扩展，目标是构建一个具备**实时数据同步**、**趋势预测**、**动态滚动展示**和**健康状态监控**能力的企业级数据可视化大屏系统。

### 1.2 新增核心功能

| 功能模块 | 描述 | 优先级 |
|----------|------|--------|
| 数据库集成 | 接入真实数据库，替代 Mock 数据 | P0 |
| 实时同步 | WebSocket/SSE 实现数据实时推送 | P0 |
| 趋势预测 | 基于历史数据的预测算法与可视化 | P1 |
| 滚动展示 | 实时数据流滚动展示组件 | P1 |
| 健康监控 | 系统健康状态仪表盘 | P2 |

---

## 2. 技术架构设计

### 2.1 整体架构

```
┌─────────────────────────────────────────────────────────────────────┐
│                        前端大屏应用 (Vue 3)                          │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌───────────────┐ │
│  │  HubChart   │ │ TrendChart  │ │ ScrollList  │ │ HealthGauge   │ │
│  └──────┬──────┘ └──────┬──────┘ └──────┬──────┘ └───────┬───────┘ │
│         │               │               │                 │        │
│  ┌──────▼─────────────────────────────────────────────────▼───────┐ │
│  │                    Pinia Store (状态管理)                       │ │
│  └──────────────────────────────────────────────┬──────────────────┘ │
│                                                 │                   │
│  ┌──────────────────────────────────────────────▼──────────────────┐ │
│  │              API Layer (HTTP/WebSocket 双协议)                   │ │
│  └──────────────────────────────────────────────┬──────────────────┘ │
└─────────────────────────────────────────────────┼─────────────────────┘
                                                  │
┌─────────────────────────────────────────────────▼─────────────────────┐
│                       后端服务 (Node.js + Express)                    │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌───────────────┐   │
│  │ REST API    │ │ WebSocket   │ │ Predictor   │ │ HealthCheck   │   │
│  └──────┬──────┘ └──────┬──────┘ └──────┬──────┘ └───────┬───────┘   │
│         │               │               │                 │          │
│  ┌──────▼─────────────────────────────────────────────────▼───────┐   │
│  │                      Service Layer                              │   │
│  └──────────────────────────────────────────────┬──────────────────┘   │
└─────────────────────────────────────────────────┼─────────────────────┘
                                                  │
┌─────────────────────────────────────────────────▼─────────────────────┐
│                    数据库 (PostgreSQL)                                │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌───────────────┐   │
│  │  metrics    │ │  trends     │ │  logs       │ │  health       │   │
│  └─────────────┘ └─────────────┘ └─────────────┘ └───────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
```

### 2.2 核心设计原则

| 原则 | 说明 |
|------|------|
| **渐进增强** | 保留现有 Mock 层作为降级方案 |
| **双协议支持** | HTTP 用于历史数据查询，WebSocket 用于实时推送 |
| **类型安全** | 前后端共享 TypeScript 类型定义 |
| **模块化** | 每个功能模块独立，便于测试和维护 |
| **性能优先** | 虚拟滚动、增量更新、缓存策略 |

---

## 3. 技术栈选型

### 3.1 后端技术栈

| 类别 | 技术 | 版本 | 理由 |
|------|------|------|------|
| 语言 | TypeScript | ^5.4 | 类型安全，与前端共享类型 |
| 框架 | Express | ^4.18 | 成熟稳定，生态丰富 |
| ORM | Prisma | ^5.10 | 类型安全的数据库操作 |
| 数据库 | PostgreSQL | ^16 | 强大的时序数据处理能力 |
| 实时通信 | Socket.io | ^4.6 | WebSocket 封装，支持重连 |
| 预测算法 | ml.js | ^6.2 | 轻量级机器学习库 |
| API 文档 | Swagger | ^4.0 | 自动生成 API 文档 |

### 3.2 前端技术栈（基于现有项目扩展）

| 类别 | 技术 | 版本 | 说明 |
|------|------|------|------|
| 框架 | Vue 3 | ^3.4 | Composition API |
| 语言 | TypeScript | ^5.4 | 类型安全 |
| 构建 | Vite | ^5.2 | 快速开发 |
| 状态管理 | Pinia | ^2.1 | 已使用 |
| 图表 | ECharts | ^5.5 | 已使用 |
| 实时通信 | Socket.io Client | ^4.6 | 新增 |
| 时间处理 | Day.js | ^1.11 | 新增 |
| 工具函数 | Lodash | ^4.17 | 新增 |

---

## 4. 数据库设计

### 4.1 数据库实体关系图

```
┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
│    metrics      │      │    trends       │      │    logs         │
├─────────────────┤      ├─────────────────┤      ├─────────────────┤
│ id (PK)         │      │ id (PK)         │      │ id (PK)         │
│ node_id         │──┐   │ metric_id (FK)  │      │ timestamp       │
│ timestamp       │  │   │ timestamp       │      │ level           │
│ value           │  │   │ predicted_value │      │ message         │
│ status          │  │   │ actual_value    │      │ source          │
└─────────────────┘  │   └─────────────────┘      └─────────────────┘
                     │
┌─────────────────┐  │   ┌─────────────────┐
│    nodes        │──┘   │    health       │
├─────────────────┤      ├─────────────────┤
│ id (PK)         │      │ id (PK)         │
│ name            │      │ service_name    │
│ coord_x         │      │ status          │
│ coord_y         │      │ response_time   │
│ type            │      │ last_check      │
└─────────────────┘      │ error_count     │
                         └─────────────────┘
```

### 4.2 表结构定义

#### 4.2.1 nodes 表（业务节点配置）

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | VARCHAR(36) | PRIMARY KEY | 节点唯一标识 |
| name | VARCHAR(64) | NOT NULL | 节点名称 |
| coord_x | INTEGER | NOT NULL | X 坐标 (0-100) |
| coord_y | INTEGER | NOT NULL | Y 坐标 (0-100) |
| type | VARCHAR(32) | NOT NULL | 节点类型 |
| status | VARCHAR(16) | DEFAULT 'good' | 状态 |
| created_at | TIMESTAMP | DEFAULT NOW() | 创建时间 |
| updated_at | TIMESTAMP | DEFAULT NOW() | 更新时间 |

#### 4.2.2 metrics 表（时序指标数据）

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | SERIAL | PRIMARY KEY | 自增主键 |
| node_id | VARCHAR(36) | FOREIGN KEY | 关联节点 |
| timestamp | TIMESTAMP | NOT NULL | 时间戳 |
| value | DECIMAL(12,2) | NOT NULL | 指标值 |
| status | VARCHAR(16) | DEFAULT 'good' | 状态 |
| metadata | JSONB | | 附加元数据 |

**索引**:
```sql
CREATE INDEX idx_metrics_node_time ON metrics(node_id, timestamp DESC);
CREATE INDEX idx_metrics_time ON metrics(timestamp DESC);
```

#### 4.2.3 trends 表（预测数据）

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | SERIAL | PRIMARY KEY | 自增主键 |
| metric_id | INTEGER | FOREIGN KEY | 关联指标 |
| timestamp | TIMESTAMP | NOT NULL | 预测时间点 |
| predicted_value | DECIMAL(12,2) | NOT NULL | 预测值 |
| actual_value | DECIMAL(12,2) | | 实际值（验证用） |
| confidence | DECIMAL(5,2) | | 置信度 (0-1) |
| method | VARCHAR(32) | NOT NULL | 预测方法 |
| created_at | TIMESTAMP | DEFAULT NOW() | 创建时间 |

#### 4.2.4 health 表（健康状态）

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | SERIAL | PRIMARY KEY | 自增主键 |
| service_name | VARCHAR(64) | NOT NULL | 服务名称 |
| status | VARCHAR(16) | NOT NULL | 状态 (healthy/unhealthy/degraded) |
| response_time | DECIMAL(8,2) | | 响应时间(ms) |
| error_count | INTEGER | DEFAULT 0 | 错误数 |
| last_check | TIMESTAMP | DEFAULT NOW() | 最后检查时间 |
| created_at | TIMESTAMP | DEFAULT NOW() | 创建时间 |

#### 4.2.5 logs 表（系统日志）

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | SERIAL | PRIMARY KEY | 自增主键 |
| timestamp | TIMESTAMP | DEFAULT NOW() | 时间戳 |
| level | VARCHAR(16) | NOT NULL | 日志级别 |
| message | TEXT | NOT NULL | 日志消息 |
| source | VARCHAR(64) | | 来源模块 |
| details | JSONB | | 详细信息 |

**索引**:
```sql
CREATE INDEX idx_logs_time ON logs(timestamp DESC);
CREATE INDEX idx_logs_level ON logs(level);
```

---

## 5. API 接口规范

### 5.1 REST API 接口

#### 5.1.1 节点管理

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/nodes` | 获取所有节点 |
| GET | `/api/nodes/:id` | 获取单个节点 |
| POST | `/api/nodes` | 创建节点 |
| PUT | `/api/nodes/:id` | 更新节点 |
| DELETE | `/api/nodes/:id` | 删除节点 |

**GET /api/nodes 响应**:
```json
{
  "code": 200,
  "data": [
    {
      "id": "course",
      "name": "课程学习",
      "coord_x": 50,
      "coord_y": 18,
      "type": "learning",
      "status": "good",
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

#### 5.1.2 指标数据

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/metrics` | 查询指标数据（支持时间范围） |
| GET | `/api/metrics/:nodeId` | 获取指定节点的指标 |
| POST | `/api/metrics` | 写入指标数据 |
| GET | `/api/metrics/overview` | 获取概览统计 |

**GET /api/metrics 查询参数**:

| 参数 | 类型 | 说明 |
|------|------|------|
| nodeId | string | 节点ID（可选） |
| startTime | string | 开始时间 ISO8601 |
| endTime | string | 结束时间 ISO8601 |
| limit | number | 返回数量限制 |

**响应**:
```json
{
  "code": 200,
  "data": {
    "nodeId": "course",
    "data": [
      {"timestamp": "2024-01-01T00:00:00Z", "value": 92.5, "status": "good"},
      {"timestamp": "2024-01-01T05:00:00Z", "value": 88.3, "status": "good"}
    ]
  }
}
```

#### 5.1.3 趋势预测

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/predictions/:nodeId` | 获取预测数据 |
| POST | `/api/predictions/:nodeId` | 触发预测计算 |

**GET /api/predictions/:nodeId 响应**:
```json
{
  "code": 200,
  "data": {
    "nodeId": "course",
    "method": "linear_regression",
    "predictions": [
      {"timestamp": "2024-01-02T00:00:00Z", "value": 95.2, "confidence": 0.85},
      {"timestamp": "2024-01-03T00:00:00Z", "value": 97.8, "confidence": 0.82}
    ],
    "history": [
      {"timestamp": "2024-01-01T00:00:00Z", "value": 92.5}
    ]
  }
}
```

#### 5.1.4 健康监控

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/health` | 获取所有服务健康状态 |
| GET | `/api/health/:serviceName` | 获取指定服务状态 |
| GET | `/api/health/check` | 执行健康检查 |

**响应**:
```json
{
  "code": 200,
  "data": [
    {
      "service_name": "database",
      "status": "healthy",
      "response_time": 12.5,
      "error_count": 0,
      "last_check": "2024-01-01T00:00:00Z"
    }
  ]
}
```

#### 5.1.5 系统日志

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/logs` | 查询日志 |
| POST | `/api/logs` | 写入日志 |

**查询参数**:

| 参数 | 类型 | 说明 |
|------|------|------|
| level | string | 日志级别 (debug/info/warn/error) |
| source | string | 来源模块 |
| startTime | string | 开始时间 |
| limit | number | 返回数量 |

### 5.2 WebSocket 实时推送

#### 5.2.1 连接与订阅

```javascript
// 客户端连接
const socket = io('http://localhost:3000');

// 订阅指标更新
socket.emit('subscribe', { channel: 'metrics', nodeId: 'course' });

// 订阅健康状态
socket.emit('subscribe', { channel: 'health' });

// 订阅日志
socket.emit('subscribe', { channel: 'logs', level: 'error' });
```

#### 5.2.2 消息格式

**指标更新**:
```json
{
  "channel": "metrics",
  "nodeId": "course",
  "data": {
    "timestamp": "2024-01-01T00:00:00Z",
    "value": 92.5,
    "status": "good"
  }
}
```

**健康状态更新**:
```json
{
  "channel": "health",
  "serviceName": "database",
  "status": "degraded",
  "response_time": 150.3
}
```

**日志推送**:
```json
{
  "channel": "logs",
  "level": "error",
  "message": "Database connection failed",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

---

## 6. 前端组件开发

### 6.1 项目结构扩展

```
src/
├── api/
│   ├── dashboard.ts          # 现有接口
│   ├── metrics.ts            # 新增：指标数据接口
│   ├── predictions.ts        # 新增：预测数据接口
│   ├── health.ts             # 新增：健康状态接口
│   ├── logs.ts               # 新增：日志接口
│   ├── socket.ts             # 新增：WebSocket 封装
│   └── request.ts
├── components/
│   ├── charts/
│   │   ├── HubOverviewChart.vue
│   │   ├── LineChart.vue
│   │   ├── BarChart.vue
│   │   ├── PieChart.vue
│   │   ├── RadarChart.vue
│   │   ├── ScatterChart.vue
│   │   ├── TrendChart.vue        # 新增：趋势预测图
│   │   └── HealthGauge.vue       # 新增：健康仪表盘
│   ├── common/
│   │   ├── DataTime.vue
│   │   ├── NumberCard.vue
│   │   ├── SectionTitle.vue
│   │   └── DataScroll.vue        # 新增：滚动展示组件
│   └── layouts/
│       └── DashboardLayout.vue
├── stores/
│   ├── dashboard.ts
│   ├── metrics.ts            # 新增：指标状态管理
│   ├── predictions.ts        # 新增：预测状态管理
│   ├── health.ts             # 新增：健康状态管理
│   └── logs.ts               # 新增：日志状态管理
├── composables/
│   ├── useDataRefresh.ts
│   ├── useScreenScale.ts
│   ├── useSocket.ts          # 新增：WebSocket 组合式函数
│   └── usePrediction.ts      # 新增：预测算法组合式函数
├── utils/
│   ├── echarts.ts
│   ├── format.ts
│   └── prediction.ts         # 新增：预测算法工具
└── views/
    └── HomeView.vue
```

### 6.2 新增组件详细设计

#### 6.2.1 TrendChart.vue（趋势预测图）

**功能**: 展示历史数据与预测数据的对比曲线

```typescript
// src/components/charts/TrendChart.vue
import { ref, onMounted, onUnmounted, watch } from 'vue';
import * as echarts from 'echarts';
import type { PredictionData } from '@/types';

const props = defineProps<{
  historyData: Array<{ timestamp: string; value: number }>;
  predictionData: Array<{ timestamp: string; value: number; confidence: number }>;
  nodeName: string;
}>();

const chartRef = ref<HTMLDivElement | null>(null);
let chartInstance: echarts.ECharts | null = null;

const initChart = () => {
  if (!chartRef.value) return;
  chartInstance = echarts.init(chartRef.value);
  
  const option: echarts.EChartsOption = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(15, 11, 30, 0.95)',
      borderColor: 'rgba(139, 92, 246, 0.3)',
      textStyle: { color: '#e2e8f0' },
    },
    legend: {
      data: ['历史数据', '预测数据'],
      textStyle: { color: '#8b949e' },
    },
    grid: { top: 40, right: 30, bottom: 30, left: 50 },
    xAxis: {
      type: 'category',
      data: [...props.historyData, ...props.predictionData].map(d => d.timestamp),
      axisLine: { lineStyle: { color: 'rgba(139, 92, 246, 0.2)' } },
      axisLabel: { color: '#8b949e', fontSize: 11 },
    },
    yAxis: {
      type: 'value',
      splitLine: { lineStyle: { color: 'rgba(139, 92, 246, 0.05)' } },
      axisLabel: { color: '#8b949e' },
    },
    series: [
      {
        name: '历史数据',
        type: 'line',
        data: props.historyData.map(d => d.value),
        smooth: true,
        lineStyle: { width: 2, color: '#8b5cf6' },
        itemStyle: { color: '#8b5cf6' },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(139, 92, 246, 0.3)' },
            { offset: 1, color: 'rgba(139, 92, 246, 0.02)' },
          ]),
        },
      },
      {
        name: '预测数据',
        type: 'line',
        data: [...Array(props.historyData.length).fill(null), ...props.predictionData.map(d => d.value)],
        smooth: true,
        lineStyle: { width: 2, color: '#f59e0b', type: 'dashed' },
        itemStyle: { color: '#f59e0b' },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(245, 158, 11, 0.2)' },
            { offset: 1, color: 'rgba(245, 158, 11, 0.02)' },
          ]),
        },
      },
    ],
  };
  
  chartInstance.setOption(option);
};

// 响应式更新
watch(() => [props.historyData, props.predictionData], () => {
  initChart();
}, { deep: true });

onMounted(() => {
  initChart();
  window.addEventListener('resize', () => chartInstance?.resize());
});

onUnmounted(() => {
  window.removeEventListener('resize', () => chartInstance?.resize());
  chartInstance?.dispose();
});
```

#### 6.2.2 DataScroll.vue（动态滚动组件）

**功能**: 实时数据流滚动展示，支持虚拟滚动优化

```typescript
// src/components/common/DataScroll.vue
import { ref, computed, onMounted, onUnmounted } from 'vue';

interface ScrollItem {
  id: string;
  title: string;
  value: string;
  status: 'normal' | 'warning' | 'error';
  time: string;
}

const props = defineProps<{
  data: ScrollItem[];
  height?: string;
  itemHeight?: number;
  speed?: number;
}>();

const containerRef = ref<HTMLDivElement | null>(null);
const scrollOffset = ref(0);
let animationId: number | null = null;

const visibleItems = computed(() => {
  const containerHeight = parseInt(props.height || '200');
  const startIndex = Math.floor(scrollOffset.value / (props.itemHeight || 36));
  const endIndex = startIndex + Math.ceil(containerHeight / (props.itemHeight || 36)) + 1;
  return props.data.slice(Math.max(0, startIndex), Math.min(props.data.length, endIndex));
});

const startScroll = () => {
  const scroll = () => {
    scrollOffset.value += props.speed || 0.5;
    const maxOffset = Math.max(0, props.data.length * (props.itemHeight || 36) - parseInt(props.height || '200'));
    if (scrollOffset.value >= maxOffset) {
      scrollOffset.value = 0;
    }
    animationId = requestAnimationFrame(scroll);
  };
  animationId = requestAnimationFrame(scroll);
};

const stopScroll = () => {
  if (animationId) {
    cancelAnimationFrame(animationId);
    animationId = null;
  }
};

onMounted(() => {
  startScroll();
});

onUnmounted(() => {
  stopScroll();
});

const statusClass = (status: string) => {
  const classes: Record<string, string> = {
    normal: 'text-[#34d399]',
    warning: 'text-[#f59e0b]',
    error: 'text-[#ee6666]',
  };
  return classes[status] || classes.normal;
};
```

**模板**:
```html
<template>
  <div 
    ref="containerRef" 
    class="relative overflow-hidden"
    :style="{ height: height || '200px' }"
  >
    <div 
      class="transition-transform"
      :style="{ 
        transform: `translateY(-${scrollOffset}px)`,
        transformOrigin: 'top'
      }"
    >
      <div 
        v-for="item in visibleItems" 
        :key="item.id"
        class="flex items-center justify-between px-3 py-2 border-b border-[rgba(139,92,246,0.1)]"
        :style="{ height: `${itemHeight || 36}px` }"
      >
        <span class="text-[#e2e8f0] text-sm">{{ item.title }}</span>
        <span class="text-[#a78bfa] text-sm">{{ item.value }}</span>
        <span :class="statusClass(item.status)" class="text-xs">{{ item.time }}</span>
      </div>
    </div>
  </div>
</template>
```

#### 6.2.3 HealthGauge.vue（健康仪表盘）

**功能**: 展示服务健康状态的仪表盘组件

```typescript
// src/components/charts/HealthGauge.vue
import { ref, onMounted, onUnmounted, watch } from 'vue';
import * as echarts from 'echarts';
import type { HealthStatus } from '@/types';

const props = defineProps<{
  services: HealthStatus[];
}>();

const chartRef = ref<HTMLDivElement | null>(null);
let chartInstance: echarts.ECharts | null = null;

const statusColors: Record<string, string> = {
  healthy: '#34d399',
  degraded: '#f59e0b',
  unhealthy: '#ee6666',
};

const initChart = () => {
  if (!chartRef.value) return;
  chartInstance = echarts.init(chartRef.value);
  
  const option: echarts.EChartsOption = {
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(15, 11, 30, 0.95)',
      borderColor: 'rgba(139, 92, 246, 0.3)',
      textStyle: { color: '#e2e8f0' },
      formatter: (params: any) => {
        const service = props.services.find(s => s.service_name === params.name);
        if (!service) return '';
        return `
          <div style="font-weight:bold;font-size:14px;margin-bottom:8px;color:#8b5cf6">${service.service_name}</div>
          <div style="margin-bottom:4px">状态：<span style="color:${statusColors[service.status]}">${service.status === 'healthy' ? '健康' : service.status === 'degraded' ? '降级' : '异常'}</span></div>
          <div style="margin-bottom:4px">响应时间：${service.response_time}ms</div>
          <div>错误数：${service.error_count}</div>
        `;
      },
    },
    series: [
      {
        type: 'gauge',
        startAngle: 200,
        endAngle: -20,
        min: 0,
        max: 100,
        splitNumber: 5,
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
            { offset: 0, color: '#34d399' },
            { offset: 0.5, color: '#f59e0b' },
            { offset: 1, color: '#ee6666' },
          ]),
        },
        progress: { show: true, width: 12 },
        pointer: { show: false },
        axisLine: {
          lineStyle: {
            width: 12,
            color: [[1, 'rgba(139, 92, 246, 0.1)']],
          },
        },
        axisTick: { show: false },
        splitLine: { show: false },
        axisLabel: { show: false },
        data: props.services.map(service => ({
          name: service.service_name,
          value: service.status === 'healthy' ? 100 : service.status === 'degraded' ? 50 : 0,
          itemStyle: { color: statusColors[service.status] },
        })),
        detail: {
          width: 50,
          height: 14,
          fontSize: 14,
          color: '#e2e8f0',
          formatter: '{value}',
        },
        title: {
          fontSize: 12,
          color: '#8b949e',
        },
      },
    ],
  };
  
  chartInstance.setOption(option);
};

watch(() => props.services, () => {
  initChart();
}, { deep: true });

onMounted(() => {
  initChart();
  window.addEventListener('resize', () => chartInstance?.resize());
});

onUnmounted(() => {
  window.removeEventListener('resize', () => chartInstance?.resize());
  chartInstance?.dispose();
});
```

---

## 7. 数据处理流程

### 7.1 数据流向图

```
数据源(数据库/外部API)
        │
        ▼
┌─────────────────┐
│  数据采集层      │
│  (定时任务/事件)  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  数据处理层      │
│  (清洗/转换/聚合) │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  预测计算层      │
│  (算法预测)      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  存储层          │
│  (数据库)        │
└────────┬────────┘
         │
    ┌────┴────┐
    ▼         ▼
 HTTP      WebSocket
    │         │
    └────┬────┘
         ▼
┌─────────────────┐
│  前端展示层      │
│  (图表/滚动/仪表盘)│
└─────────────────┘
```

### 7.2 数据同步机制

#### 7.2.1 初始化同步

1. 页面加载时，前端调用 REST API 获取全量历史数据
2. 建立 WebSocket 连接
3. 订阅指定 channel（metrics、health、logs）

#### 7.2.2 实时增量更新

```typescript
// src/composables/useSocket.ts
import { ref, onMounted, onUnmounted } from 'vue';
import { io, type Socket } from 'socket.io-client';

export const useSocket = () => {
  const socket = ref<Socket | null>(null);
  const isConnected = ref(false);
  
  const connect = (url: string = import.meta.env.VITE_API_URL || 'http://localhost:3000') => {
    socket.value = io(url, {
      transports: ['websocket'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });
    
    socket.value.on('connect', () => {
      isConnected.value = true;
      console.log('WebSocket connected');
    });
    
    socket.value.on('disconnect', () => {
      isConnected.value = false;
      console.log('WebSocket disconnected');
    });
    
    socket.value.on('error', (error) => {
      console.error('WebSocket error:', error);
    });
  };
  
  const subscribe = (channel: string, options?: Record<string, any>) => {
    socket.value?.emit('subscribe', { channel, ...options });
  };
  
  const unsubscribe = (channel: string) => {
    socket.value?.emit('unsubscribe', { channel });
  };
  
  const on = <T>(channel: string, callback: (data: T) => void) => {
    socket.value?.on(channel, callback);
  };
  
  const off = <T>(channel: string, callback: (data: T) => void) => {
    socket.value?.off(channel, callback);
  };
  
  const disconnect = () => {
    socket.value?.disconnect();
    socket.value = null;
  };
  
  onMounted(() => {
    connect();
  });
  
  onUnmounted(() => {
    disconnect();
  });
  
  return {
    socket,
    isConnected,
    connect,
    disconnect,
    subscribe,
    unsubscribe,
    on,
    off,
  };
};
```

### 7.3 数据缓存策略

| 数据类型 | 缓存策略 | 过期时间 |
|----------|----------|----------|
| 节点配置 | 内存缓存 | 页面生命周期 |
| 历史指标 | 内存 + LocalStorage | 1小时 |
| 预测数据 | 内存缓存 | 30分钟 |
| 健康状态 | 内存缓存 | 实时 |
| 系统日志 | 内存缓存 | 页面生命周期 |

---

## 8. 趋势预测算法

### 8.1 算法选择

| 算法 | 适用场景 | 复杂度 | 实现难度 |
|------|----------|--------|----------|
| **简单移动平均** | 短期平滑预测 | O(n) | 低 |
| **线性回归** | 线性趋势预测 | O(n) | 低 |
| **指数平滑** | 带权重的趋势预测 | O(n) | 中 |
| **ARIMA** | 时序数据预测 | O(n²) | 高 |

**推荐方案**: 先实现简单移动平均 + 线性回归，后续可扩展 ARIMA

### 8.2 算法实现

#### 8.2.1 简单移动平均（SMA）

```typescript
// src/utils/prediction.ts
export interface DataPoint {
  timestamp: string;
  value: number;
}

export interface PredictionResult {
  timestamp: string;
  value: number;
  confidence: number;
}

export const calculateSMA = (data: DataPoint[], windowSize: number = 7): DataPoint[] => {
  if (data.length < windowSize) return data;
  
  const result: DataPoint[] = [];
  for (let i = windowSize - 1; i < data.length; i++) {
    const window = data.slice(i - windowSize + 1, i + 1);
    const average = window.reduce((sum, point) => sum + point.value, 0) / windowSize;
    result.push({
      timestamp: data[i].timestamp,
      value: average,
    });
  }
  return result;
};
```

#### 8.2.2 线性回归预测

```typescript
// src/utils/prediction.ts
export const linearRegression = (data: DataPoint[]): ((x: number) => number) => {
  const n = data.length;
  const xValues = data.map((_, i) => i);
  const yValues = data.map(d => d.value);
  
  const sumX = xValues.reduce((a, b) => a + b, 0);
  const sumY = yValues.reduce((a, b) => a + b, 0);
  const sumXY = xValues.reduce((sum, x, i) => sum + x * yValues[i], 0);
  const sumX2 = xValues.reduce((sum, x) => sum + x * x, 0);
  
  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;
  
  return (x: number) => slope * x + intercept;
};

export const predictWithLinearRegression = (
  data: DataPoint[],
  steps: number = 7
): PredictionResult[] => {
  if (data.length < 2) return [];
  
  const predictFn = linearRegression(data);
  const results: PredictionResult[] = [];
  
  for (let i = 0; i < steps; i++) {
    const nextIndex = data.length + i;
    const nextTimestamp = new Date(Date.parse(data[data.length - 1].timestamp));
    nextTimestamp.setDate(nextTimestamp.getDate() + i + 1);
    
    results.push({
      timestamp: nextTimestamp.toISOString(),
      value: predictFn(nextIndex),
      confidence: calculateConfidence(data, predictFn),
    });
  }
  
  return results;
};

const calculateConfidence = (data: DataPoint[], predictFn: ((x: number) => number)): number => {
  const n = data.length;
  let sumSquaredError = 0;
  
  data.forEach((point, i) => {
    const predicted = predictFn(i);
    sumSquaredError += Math.pow(point.value - predicted, 2);
  });
  
  const variance = sumSquaredError / n;
  const stdDev = Math.sqrt(variance);
  const mean = data.reduce((sum, d) => sum + d.value, 0) / n;
  
  const rSquared = 1 - (sumSquaredError / data.reduce((sum, d) => sum + Math.pow(d.value - mean, 2), 0));
  
  return Math.min(1, Math.max(0, rSquared));
};
```

#### 8.2.3 指数平滑（可选）

```typescript
// src/utils/prediction.ts
export const exponentialSmoothing = (
  data: DataPoint[],
  alpha: number = 0.3
): DataPoint[] => {
  if (data.length === 0) return [];
  
  const result: DataPoint[] = [{ ...data[0] }];
  
  for (let i = 1; i < data.length; i++) {
    const smoothed = alpha * data[i].value + (1 - alpha) * result[i - 1].value;
    result.push({
      timestamp: data[i].timestamp,
      value: smoothed,
    });
  }
  
  return result;
};
```

### 8.3 预测流程

```
历史数据输入
    │
    ▼
数据预处理（去噪/异常值处理）
    │
    ▼
选择预测算法
    │
    ├── SMA（简单移动平均）
    │   └── 短期平滑
    │
    ├── 线性回归
    │   └── 趋势预测
    │
    └── 指数平滑
        └── 加权趋势
    │
    ▼
计算置信度
    │
    ▼
输出预测结果（含时间戳、预测值、置信度）
```

---

## 9. 部署流程

### 9.1 环境准备

| 环境 | 配置要求 |
|------|----------|
| 开发环境 | Node.js >= 18, PostgreSQL >= 15 |
| 测试环境 | Docker 容器化部署 |
| 生产环境 | Kubernetes 集群 / 云服务器 |

### 9.2 Docker 部署

#### 9.2.1 Dockerfile（前端）

```dockerfile
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### 9.2.2 Dockerfile（后端）

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

#### 9.2.3 docker-compose.yml

```yaml
version: '3.8'
services:
  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - backend
    environment:
      - VITE_API_URL=http://backend:3000
  
  backend:
    build: ./backend
    ports:
      - "3000:3000"
    depends_on:
      - database
    environment:
      - DATABASE_URL=postgres://user:password@database:5432/visbridge
      - PORT=3000
  
  database:
    image: postgres:16-alpine
    ports:
      - "5432:5432"
    environment:
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=password
      - POSTGRES_DB=visbridge
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

### 9.3 数据库初始化

```bash
# 创建数据库
createdb -U postgres visbridge

# 运行迁移
npx prisma migrate dev

# 初始化种子数据
npx prisma db seed
```

### 9.4 CI/CD 流程

```
代码提交 → GitHub Actions → 构建测试 → 镜像构建 → 部署到生产
    │
    ├── ESLint 检查
    ├── TypeScript 类型检查
    ├── 单元测试 (Vitest/Jest)
    ├── 构建验证
    └── 安全扫描
```

---

## 10. 质量标准与交付物

### 10.1 各阶段交付物

| 阶段 | 交付物 | 质量标准 |
|------|--------|----------|
| **需求分析** | 需求文档、功能清单 | 需求覆盖率 100% |
| **架构设计** | 架构图、技术方案文档 | 技术可行性验证通过 |
| **数据库设计** | ER 图、DDL 脚本 | 数据库规范化第三范式 |
| **API 开发** | API 接口文档、Swagger | 接口测试覆盖率 100% |
| **前端开发** | 组件代码、单元测试 | 代码覆盖率 >= 80% |
| **算法开发** | 预测算法代码、测试用例 | 预测准确率 >= 85% |
| **集成测试** | 集成测试报告 | 核心流程测试通过 |
| **部署上线** | 部署脚本、运维文档 | 零停机部署 |

### 10.2 代码质量标准

| 维度 | 标准 |
|------|------|
| **代码规范** | ESLint 0 errors, Prettier 格式化 |
| **类型安全** | TypeScript 0 type errors |
| **单元测试** | 覆盖率 >= 80% |
| **性能指标** | 首屏加载 < 3s, FPS >= 60 |
| **代码复杂度** | Cyclomatic complexity < 10 |

### 10.3 性能优化清单

| 优化项 | 实施方式 |
|--------|----------|
| 虚拟滚动 | DataScroll 组件使用 IntersectionObserver |
| 图表增量更新 | ECharts 使用 setOption(notMerge: false) |
| 图片优化 | WebP 格式、懒加载 |
| 代码分割 | Vite 按需加载 |
| 缓存策略 | HTTP 缓存 + LocalStorage |
| 压缩传输 | Gzip/Brotli |

### 10.4 安全检查清单

| 检查项 | 状态 |
|--------|------|
| HTTPS 启用 | ✅ |
| CORS 配置 | ✅ |
| SQL 注入防护 | ✅ (Prisma ORM) |
| XSS 防护 | ✅ (Vue 自动转义) |
| 输入验证 | ✅ |
| 敏感信息加密 | ✅ |

---

## 附录：类型定义参考

```typescript
// src/types/index.ts
export interface Node {
  id: string;
  name: string;
  coord_x: number;
  coord_y: number;
  type: string;
  status: 'good' | 'warning' | 'danger';
  created_at: string;
  updated_at: string;
}

export interface Metric {
  id: number;
  node_id: string;
  timestamp: string;
  value: number;
  status: 'good' | 'warning' | 'danger';
  metadata?: Record<string, any>;
}

export interface Prediction {
  id: number;
  metric_id: number;
  timestamp: string;
  predicted_value: number;
  actual_value?: number;
  confidence: number;
  method: string;
  created_at: string;
}

export interface HealthStatus {
  id: number;
  service_name: string;
  status: 'healthy' | 'degraded' | 'unhealthy';
  response_time: number;
  error_count: number;
  last_check: string;
  created_at: string;
}

export interface LogEntry {
  id: number;
  timestamp: string;
  level: 'debug' | 'info' | 'warn' | 'error';
  message: string;
  source?: string;
  details?: Record<string, any>;
}
```

---

**文档版本**: v1.0  
**创建日期**: 2024年  
**适用项目**: VisBridge 数据大屏

---

*本指南基于现有 VisBridge 项目架构编写，所有新增功能均与现有代码风格和交互模式保持一致。*