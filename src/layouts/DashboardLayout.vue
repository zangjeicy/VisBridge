<template>
  <div class="dashboard-layout" :style="layoutStyle">
    <div class="dashboard-container">
      <header class="dashboard-header">
        <div class="header-decoration-left" />
        <div class="header-decoration-right" />
        <div class="header-left">
          <h1 class="header-title">智能教学数据中心</h1>
          <span class="header-subtitle">VisBridge 视界之桥</span>
        </div>
        <div class="header-center">
          <div class="status-dots">
            <span class="status-dot active" />
            <span class="status-dot" />
            <span class="status-dot" />
          </div>
          <DataTime />
          <div class="status-dots">
            <span class="status-dot" />
            <span class="status-dot" />
            <span class="status-dot active" />
          </div>
        </div>
        <div class="header-right">
          <span v-if="store.lastUpdateTime" class="update-time">
            数据更新：{{ store.lastUpdateTime }}
          </span>
        </div>
      </header>

      <main class="dashboard-main">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import DataTime from '@/components/common/DataTime.vue';
import { useDashboardStore } from '@/stores/dashboard';
import { useScreenScale } from '@/composables/useScreenScale';

const store = useDashboardStore();
const { scale, screenWidth, screenHeight } = useScreenScale();
const DESIGN_W = 1920;
const DESIGN_H = 1080;

const layoutStyle = computed(() => {
  const s = scale.value;
  const offsetX = (screenWidth.value - DESIGN_W * s) / 2;
  const offsetY = (screenHeight.value - DESIGN_H * s) / 2;
  return {
    transform: `translate(${offsetX}px, ${offsetY}px) scale(${s})`,
    transformOrigin: '0 0',
    width: `${DESIGN_W}px`,
    height: `${DESIGN_H}px`,
  };
});
</script>

<style scoped lang="less">
@import '@/styles/variables.less';

.dashboard-layout {
  position: absolute;
  top: 0;
  left: 0;
  background:
    radial-gradient(ellipse at 20% 50%, rgba(0, 180, 216, 0.06) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 50%, rgba(0, 212, 170, 0.04) 0%, transparent 50%),
    linear-gradient(180deg, @deep-blue 0%, @ink-blue 100%);
  border-radius: 4px;
  box-shadow: 0 0 60px rgba(0, 180, 216, 0.1);
}

.dashboard-container {
  width: 100%;
  height: 100%;
  padding: 0 @spacing-lg;
  display: flex;
  flex-direction: column;
}

.dashboard-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 80px;
  padding: 0 @spacing-md;
  background: linear-gradient(180deg, rgba(13, 33, 55, 0.95) 0%, transparent 100%);
  border-bottom: 1px solid @border-color;
  position: relative;
  overflow: hidden;
}

.header-decoration-left,
.header-decoration-right {
  position: absolute;
  top: 0;
  width: 200px;
  height: 100%;
  background: linear-gradient(90deg, rgba(0, 180, 216, 0.05), transparent);
}

.header-decoration-left {
  left: 0;
}

.header-decoration-right {
  right: 0;
  transform: rotate(180deg);
}

.header-left {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.header-title {
  font-size: @font-xl;
  font-weight: 700;
  background: linear-gradient(90deg, @lake-blue, @jade-green);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: 6px;
}

.header-subtitle {
  font-size: @font-xs;
  color: @text-secondary;
  letter-spacing: 4px;
}

.header-center {
  display: flex;
  align-items: center;
  gap: @spacing-md;
}

.status-dots {
  display: flex;
  gap: 6px;

  .status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: rgba(0, 180, 216, 0.3);

    &.active {
      background: @jade-green;
      box-shadow: 0 0 10px @jade-green;
    }
  }
}

.header-right {
  display: flex;
  align-items: center;
}

.update-time {
  font-size: @font-xs;
  color: @text-secondary;
}

.dashboard-main {
  flex: 1;
  padding: @spacing-md 0;
  overflow: hidden;
}
</style>
