<script setup lang="ts">
const { locale } = useI18n()
const route = useRoute()

const { data: post } = await useAsyncData(`blog-${route.params.slug}`, () =>
  queryContent(`/${locale.value}/blog/${route.params.slug}`).findOne()
)

if (!post.value) {
  throw createError({ statusCode: 404, statusMessage: 'Post not found' })
}

useHead({ title: `${post.value.title} — Sergei Solovev` })
</script>

<template>
  <article class="container post">
    <header class="post__header">
      <time class="post__date">{{ post?.date }}</time>
      <h1 class="post__title">{{ post?.title }}</h1>
      <p v-if="post?.description" class="post__desc">{{ post?.description }}</p>
    </header>

    <ContentRenderer v-if="post" :value="post" class="post__body" />
  </article>
</template>

<style scoped>
.post {
  max-width: 680px;
}

.post__header {
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid var(--color-border);
}

.post__date {
  font-size: 0.85rem;
  color: var(--color-muted);
}

.post__title {
  font-size: clamp(1.6rem, 4vw, 2.2rem);
  line-height: 1.2;
  margin: 0.5rem 0;
}

.post__desc {
  color: var(--color-muted);
  font-size: 1.05rem;
}

.post__body :deep(h2) { font-size: 1.4rem; margin: 2rem 0 0.75rem; }
.post__body :deep(h3) { font-size: 1.15rem; margin: 1.5rem 0 0.5rem; }
.post__body :deep(p) { margin-bottom: 1rem; }
.post__body :deep(pre) { background: #f4f4f4; padding: 1rem; border-radius: 6px; overflow-x: auto; margin-bottom: 1rem; }
.post__body :deep(code) { font-family: var(--font-mono); font-size: 0.9em; }
.post__body :deep(ul), .post__body :deep(ol) { padding-left: 1.5rem; margin-bottom: 1rem; }
.post__body :deep(li) { margin-bottom: 0.25rem; }
</style>
