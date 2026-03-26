<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()

useHead({
  title: 'Sergei Solovev',
})
</script>

<template>
  <div>
    <!-- Hero -->
    <section class="hero container">
      <p class="hero__greeting">{{ t('home.hero.greeting') }}</p>
      <h1 class="hero__name">Sergei Solovev</h1>
      <p class="hero__role">{{ t('home.hero.role') }}</p>
      <div class="hero__actions">
        <NuxtLink :to="localePath('/blog')" class="btn btn--primary">
          {{ t('home.hero.cta_blog') }}
        </NuxtLink>
        <NuxtLink :to="localePath('/portfolio')" class="btn btn--outline">
          {{ t('home.hero.cta_portfolio') }}
        </NuxtLink>
      </div>
    </section>

    <!-- About -->
    <section class="about container">
      <h2>{{ t('home.about.title') }}</h2>
      <!-- TODO: добавить текст -->
    </section>
  </div>
</template>

<style scoped>
.hero {
  padding: 4rem 0 3rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.hero__greeting {
  color: var(--color-muted);
  font-size: 1.1rem;
}

.hero__name {
  font-size: clamp(2rem, 5vw, 3rem);
  line-height: 1.1;
}

.hero__role {
  color: var(--color-accent);
  font-size: 1.2rem;
}

.hero__actions {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
  flex-wrap: wrap;
}

.btn {
  display: inline-block;
  padding: 0.6rem 1.4rem;
  border-radius: 6px;
  font-size: 0.95rem;
  cursor: pointer;
  text-decoration: none;
}

.btn--primary {
  background: var(--color-accent);
  color: #fff;
}

.btn--primary:hover {
  opacity: 0.9;
  text-decoration: none;
}

.btn--outline {
  border: 1px solid var(--color-border);
  color: var(--color-text);
}

.btn--outline:hover {
  border-color: var(--color-accent);
  color: var(--color-accent);
  text-decoration: none;
}

.about {
  padding: 2rem 0;
  border-top: 1px solid var(--color-border);
}

.about h2 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
}
</style>
