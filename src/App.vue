<template>
  <router-view />
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { USE_MOCK } from '@/api/request';
import { logger } from '@/logger';

onMounted(async () => {
  logger.info('App', `VisBridge started | Mock mode: ${USE_MOCK}`);

  if (USE_MOCK) {
    const { worker } = await import('@/mocks/browser');
    await worker.start({ onUnhandledRequest: 'bypass' });
    logger.info('App', 'MSW worker started');
  }
});
</script>
