<template>
  <div class="section-title">
    <span class="title-decoration" />
    <span class="title-text">{{ title }}</span>
  </div>
</template>

<script setup lang="ts">
defineProps<{ title: string }>();
</script>

<style scoped lang="less">
@import '@/styles/variables.less';

.section-title {
  display: flex;
  align-items: center;
  gap: @spacing-sm;
  margin-bottom: @spacing-md;

  .title-decoration {
    width: 4px;
    height: 18px;
    background: linear-gradient(180deg, @cyan-blue, @jade-green);
    border-radius: 2px;
  }

  .title-text {
    font-size: @font-md;
    font-weight: 600;
    color: @text-primary;
  }
}
</style>
