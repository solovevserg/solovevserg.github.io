<script setup lang="ts">
const { t } = useI18n()
const year = new Date().getFullYear()
</script>

<template>
  <footer class="footer">
    <div class="container footer__inner">
      <span class="footer__copy">© {{ year }} Sergei Solovev — {{ t('footer.rights') }}</span>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  border-top: 1px solid var(--color-border);
  padding: 1.5rem 0;
  margin-top: auto;
}

.footer__inner {
  display: flex;
  justify-content: center;
}

.footer__copy {
  font-size: 0.85rem;
  color: var(--color-muted);
}
</style>
