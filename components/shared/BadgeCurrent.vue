<script setup lang="ts">
const { t } = useI18n()
</script>

<template>
  <span class="badge"><span class="badge__dot" />{{ t('common.current') }}</span>
</template>

<style scoped lang="less">
.badge {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.68rem;
  font-weight: 500;
  color: var(--current-dot);
  background: rgba(34,197,94,0.1);
  border-radius: 100px;
  padding: 0.15rem 0.65rem;

  &__dot {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: var(--current-dot);
  }
}
</style>
