<script setup lang="ts">
const { t, locale } = useI18n()
const localePath = useLocalePath()

useHead({ title: `${t('portfolio.title')} — Sergei Solovev` })

const { data: projects } = await useAsyncData('portfolio', () =>
  queryContent(`/${locale.value}/projects`).find()
)
</script>

<template>
  <div class="container">
    <h1 class="page-title">{{ t('portfolio.title') }}</h1>

    <p v-if="!projects?.length" class="empty">{{ t('portfolio.empty') }}</p>

    <ul v-else class="project-list">
      <li v-for="project in projects" :key="project._path" class="project-item">
        <NuxtLink
          :to="localePath(`/portfolio/${project._file?.split('/').pop()?.replace('.md', '')}`)"
          class="project-link"
        >
          <h2 class="project-title">{{ project.title }}</h2>
          <p v-if="project.description" class="project-desc">{{ project.description }}</p>
        </NuxtLink>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.page-title {
  font-size: 2rem;
  margin-bottom: 2rem;
}

.empty {
  color: var(--color-muted);
}

.project-list {
  list-style: none;
  display: grid;
  gap: 1.5rem;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
}

.project-link {
  display: block;
  padding: 1.25rem;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  color: inherit;
  text-decoration: none;
  transition: border-color 0.2s;
}

.project-link:hover {
  border-color: var(--color-accent);
  text-decoration: none;
}

.project-title {
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
}

.project-desc {
  color: var(--color-muted);
  font-size: 0.9rem;
}
</style>
