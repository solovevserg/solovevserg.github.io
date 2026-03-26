<script setup lang="ts">
const { t, locale } = useI18n()
const localePath = useLocalePath()

useHead({ title: `${t('blog.title')} — Sergei Solovev` })

const { data: posts } = await useAsyncData('blog', () =>
  queryContent(`/${locale.value}/blog`)
    .sort({ date: -1 })
    .find()
)
</script>

<template>
  <div class="container">
    <h1 class="page-title">{{ t('blog.title') }}</h1>

    <p v-if="!posts?.length" class="empty">{{ t('blog.empty') }}</p>

    <ul v-else class="post-list">
      <li v-for="post in posts" :key="post._path" class="post-item">
        <NuxtLink :to="localePath(`/blog/${post._file?.split('/').pop()?.replace('.md', '')}`)" class="post-link">
          <time class="post-date">{{ post.date }}</time>
          <h2 class="post-title">{{ post.title }}</h2>
          <p v-if="post.description" class="post-desc">{{ post.description }}</p>
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

.post-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.post-link {
  display: block;
  color: inherit;
  text-decoration: none;
}

.post-link:hover .post-title {
  color: var(--color-accent);
}

.post-date {
  font-size: 0.85rem;
  color: var(--color-muted);
}

.post-title {
  font-size: 1.3rem;
  margin: 0.25rem 0;
}

.post-desc {
  color: var(--color-muted);
  font-size: 0.95rem;
}
</style>
