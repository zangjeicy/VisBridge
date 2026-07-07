import { onMounted, onUnmounted, ref } from 'vue';

export function useDataRefresh(callback: () => void | Promise<void>, interval = 30000) {
  const timer = ref<ReturnType<typeof setInterval> | null>(null);
  const isRunning = ref(false);

  function start() {
    if (timer.value) return;
    callback();
    timer.value = setInterval(callback, interval);
    isRunning.value = true;
  }

  function stop() {
    if (timer.value) {
      clearInterval(timer.value);
      timer.value = null;
      isRunning.value = false;
    }
  }

  onMounted(() => start());
  onUnmounted(() => stop());

  return { isRunning, start, stop };
}
