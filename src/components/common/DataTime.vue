<template>
  <div class="data-time">
    <span class="date">{{ dateStr }}</span>
    <span class="time">{{ timeStr }}</span>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const dateStr = ref('');
const timeStr = ref('');

let timer: ReturnType<typeof setInterval>;

function updateTime() {
  const now = new Date();
  dateStr.value = now.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    weekday: 'short',
  });
  timeStr.value = now.toLocaleTimeString('zh-CN', { hour12: false });
}

onMounted(() => {
  updateTime();
  timer = setInterval(updateTime, 1000);
});

onUnmounted(() => clearInterval(timer));
</script>

<style scoped lang="less">
@import '@/styles/variables.less';

.data-time {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;

  .date {
    font-size: @font-sm;
    color: @text-secondary;
  }

  .time {
    font-size: @font-lg;
    font-weight: 700;
    color: @text-accent;
    font-family: 'Courier New', monospace;
  }
}
</style>
