<script setup lang="ts">
const { t, locale, locales, setLocale } = useI18n()
const localePath = useLocalePath()

const otherLocale = computed(() =>
  locales.value.find(l => l.code !== locale.value)
)
</script>

<template>
  <header class="header">
    <div class="container header__inner">
      <NuxtLink :to="localePath('/')" class="header__logo">
        Sergei Solovev
      </NuxtLink>

      <nav class="header__nav">
        <NuxtLink :to="localePath('/')">{{ t('nav.home') }}</NuxtLink>
        <NuxtLink :to="localePath('/blog')">{{ t('nav.blog') }}</NuxtLink>
        <NuxtLink :to="localePath('/portfolio')">{{ t('nav.portfolio') }}</NuxtLink>
      </nav>

      <button
        v-if="otherLocale"
        class="header__lang"
        @click="setLocale(otherLocale.code)"
      >
        {{ otherLocale.code.toUpperCase() }}
      </button>
    </div>
  </header>
</template>

<style scoped>
.header {
  border-bottom: 1px solid var(--color-border);
  padding: 1rem 0;
}

.header__inner {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.header__logo {
  font-weight: 600;
  color: var(--color-text);
  margin-right: auto;
}

.header__nav {
  display: flex;
  gap: 1.5rem;
}

.header__nav a {
  color: var(--color-muted);
  font-size: 0.95rem;
}

.header__nav a:hover,
.header__nav a.router-link-active {
  color: var(--color-accent);
  text-decoration: none;
}

.header__lang {
  background: none;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  padding: 0.25rem 0.5rem;
  cursor: pointer;
  font-size: 0.85rem;
  color: var(--color-muted);
}

.header__lang:hover {
  border-color: var(--color-accent);
  color: var(--color-accent);
}
</style>
