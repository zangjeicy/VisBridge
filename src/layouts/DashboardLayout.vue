<template>
  <div class="dashboard-layout" :style="layoutStyle">
    <div class="dashboard-container">
      <header class="dashboard-header">
        <div class="header-left">
          <h1 class="header-title">VisBridge 视界之桥</h1>
          <span class="header-subtitle">数据可视化大屏</span>
        </div>
        <div class="header-center">
          <DataTime />
        </div>
        <div class="header-right">
          <span class="update-time" v-if="store.lastUpdateTime">
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
const { scale } = useScreenScale();

const layoutStyle = computed(() => ({
  transform: `scale(${scale.value})`,
  transformOrigin: 'top left',
  width: '1920px',
  height: '1080px',
  position: 'relative' as const,
}));
</script>

<style scoped lang="less">
@import '@/styles/variables.less';

.dashboard-layout {
  position: absolute;
  top: 50%;
  left: 50%;
  margin-left: -960px;
  margin-top: -540px;
  background:
    radial-gradient(ellipse at 20% 50%, rgba(84, 112, 198, 0.08) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 50%, rgba(145, 204, 117, 0.06) 0%, transparent 50%),
    linear-gradient(180deg, #0a0e27 0%, #0d1b3e 100%);
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
  background: linear-gradient(180deg, rgba(20, 30, 70, 0.9) 0%, transparent 100%);
  border-bottom: 1px solid @border-color;
}

.header-left {
  display: flex;
  align-items: baseline;
  gap: @spacing-md;
}

.header-title {
  font-size: @font-xl;
  font-weight: 700;
  background: linear-gradient(90deg, #58a6ff, #a371f7);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: 4px;
}

.header-subtitle {
  font-size: @font-sm;
  color: @text-secondary;
  letter-spacing: 2px;
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
