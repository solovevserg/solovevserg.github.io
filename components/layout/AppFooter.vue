<script setup lang="ts">
const { t } = useI18n()
const year = new Date().getFullYear()
</script>

<template>
  <footer class="footer">
    <div class="container footer__inner">
      <span class="footer__copy">
        © {{ year }} {{ t('footer.name') }} — {{ t('footer.rights') }}
      </span>
      <div class="footer__links">
        <a href="https://github.com/solovevserg" target="_blank" rel="noopener">GitHub</a>
        <a href="https://t.me/sergsol" target="_blank" rel="noopener">Telegram</a>
        <a href="https://www.linkedin.com/in/solovevserg/" target="_blank" rel="noopener">LinkedIn</a>
      </div>
    </div>
  </footer>
</template>

<style scoped lang="less">
.footer {
  border-top: 1px solid var(--border);
  padding: 2rem 0;

  &__inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    flex-wrap: wrap;
  }

  &__copy {
    font-size: 0.8rem;
    color: var(--text-muted);
  }

  &__links {
    display: flex;
    gap: 1.5rem;

    a {
      font-size: 0.8rem;
      color: var(--text-muted);
      &:hover { color: var(--text); }
    }
  }
}
</style>
