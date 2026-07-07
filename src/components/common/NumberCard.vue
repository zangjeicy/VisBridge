<template>
  <div class="number-card dashboard-card">
    <div class="card-label">{{ label }}</div>
    <div class="card-value">{{ formattedValue }}</div>
    <div class="card-trend" v-if="trend !== undefined" :class="trend >= 0 ? 'up' : 'down'">
      <span class="trend-icon">{{ trend >= 0 ? '▲' : '▼' }}</span>
      <span class="trend-value">{{ Math.abs(trend).toFixed(1) }}%</span>
      <span class="trend-label">vs 昨日</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { formatNumber, formatCurrency, formatPercent } from '@/utils/format';

const props = withDefaults(
  defineProps<{
    label: string;
    value: number;
    valueType?: 'number' | 'currency' | 'percent';
    trend?: number;
  }>(),
  {
    valueType: 'number',
  },
);

const formattedValue = computed(() => {
  switch (props.valueType) {
    case 'currency':
      return formatCurrency(props.value);
    case 'percent':
      return formatPercent(props.value);
    default:
      return formatNumber(props.value);
  }
});
</script>

<style scoped lang="less">
@import '@/styles/variables.less';

.number-card {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: @spacing-md @spacing-lg;
  min-height: 100px;
  position: relative;

  .card-label {
    font-size: @font-sm;
    color: @text-secondary;
    margin-bottom: @spacing-sm;
  }

  .card-value {
    font-size: @font-xxl;
    font-weight: 700;
    color: @text-primary;
    font-family: 'DIN', 'Courier New', monospace;
  }

  .card-trend {
    display: flex;
    align-items: center;
    gap: 4px;
    margin-top: @spacing-sm;
    font-size: @font-xs;

    &.up {
      color: @success-color;
    }
    &.down {
      color: @danger-color;
    }

    .trend-label {
      color: @text-secondary;
    }
  }
}
</style>
