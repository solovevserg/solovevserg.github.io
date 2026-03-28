<script setup lang="ts">
defineProps<{ num: string; title: string }>()
</script>

<template>
  <header class="section-header">
    <span class="section-num">{{ num }}</span>
    <h2 class="section-heading">{{ title }}</h2>
  </header>
</template>

<style scoped lang="less">
.section-header {
  margin-bottom: 4rem;

  @media (max-width: 768px) {
    margin-bottom: 2rem;
  }
}

.section-num {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  font-weight: 500;
  color: var(--accent);
  letter-spacing: 0.1em;
  display: block;
  margin-bottom: 0.6rem;
}

.section-heading {
  font-size: clamp(2.4rem, 5.5vw, 4rem);
  font-weight: 900;
  letter-spacing: -0.04em;
  line-height: 0.92;
  color: var(--text);

  @media (max-width: 768px) {
    font-size: clamp(2rem, 10vw, 2.8rem);
  }
}
</style>
