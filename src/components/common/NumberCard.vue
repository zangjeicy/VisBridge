<template>
  <div class="number-card">
    <div class="card-corner card-corner-tl" />
    <div class="card-corner card-corner-tr" />
    <div class="card-corner card-corner-bl" />
    <div class="card-corner card-corner-br" />
    <div class="card-label">
      {{ label }}
    </div>
    <div class="card-value">
      {{ formattedValue }}
    </div>
    <div v-if="trend !== undefined" class="card-trend" :class="trend >= 0 ? 'up' : 'down'">
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
  background: @bg-card;
  border: 1px solid @border-color;
  border-radius: 8px;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: @gradient-primary;
  }

  &:hover {
    border-color: @border-active;
    box-shadow: @shadow-glow;
  }
}

.card-corner {
  position: absolute;
  width: 12px;
  height: 12px;
  border: 2px solid @text-accent;
  opacity: 0.4;

  &.card-corner-tl {
    top: 8px;
    left: 8px;
    border-right: none;
    border-bottom: none;
  }
  &.card-corner-tr {
    top: 8px;
    right: 8px;
    border-left: none;
    border-bottom: none;
  }
  &.card-corner-bl {
    bottom: 8px;
    left: 8px;
    border-right: none;
    border-top: none;
  }
  &.card-corner-br {
    bottom: 8px;
    right: 8px;
    border-left: none;
    border-top: none;
  }
}

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
  text-shadow: 0 0 10px rgba(139, 92, 246, 0.3);
}

.card-trend {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: @spacing-sm;
  font-size: @font-xs;

  &.up {
    color: @jade-green;
  }
  &.down {
    color: #ff6b6b;
  }

  .trend-label {
    color: @text-secondary;
  }
}
</style>
