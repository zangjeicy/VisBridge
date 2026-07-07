<template>
  <router-view />
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { USE_MOCK } from '@/api/request';
import { logger } from '@/logger';

onMounted(() => {
  logger.info('App', `VisBridge started | Mock mode: ${USE_MOCK}`);
});
</script>
