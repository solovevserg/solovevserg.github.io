<script setup lang="ts">
const { locale } = useI18n()
const route = useRoute()

const { data: post } = await useAsyncData(`blog-${route.params.slug}`, () =>
    queryContent(`/${locale.value}/blog/${route.params.slug}`).findOne()
)

if (!post.value) {
    throw createError({ statusCode: 404, statusMessage: 'Post not found' })
}

usePageSeo({
    title: post.value.title,
    description: post.value.description,
})
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

<style scoped lang="less">
.post {
    max-width: 680px;
    padding-top: 4rem;
    padding-bottom: 6rem;

    &__header {
        margin-bottom: 2rem;
        padding-bottom: 1.5rem;
        border-bottom: 1px solid var(--color-border);
    }

    &__date {
        font-size: 0.85rem;
        color: var(--color-muted);
    }

    &__title {
        font-size: clamp(1.6rem, 4vw, 2.2rem);
        line-height: 1.2;
        margin: 0.5rem 0;
    }

    &__desc {
        color: var(--color-muted);
        font-size: 1.05rem;
    }

    &__body {
        :deep(h2),
        :deep(h3) {
            position: relative;
        }

        :deep(h2) {
            font-size: 1.4rem;
            margin: 2.5rem 0 0.75rem;
            color: var(--accent);
        }

        :deep(h3) {
            font-size: 1.15rem;
            margin: 1.75rem 0 0.5rem;
            color: var(--text);
            border-left: 2px solid var(--accent);
            padding-left: 0.75rem;
        }

        :deep(h2 a),
        :deep(h3 a) {
            color: inherit;
            text-decoration: none;
        }

        :deep(h2 a)::before,
        :deep(h3 a)::before {
            content: '#';
            position: absolute;
            left: -1.4em;
            color: var(--accent);
            font-weight: 400;
            opacity: 0;
            transition: opacity 0.15s;
        }

        :deep(h2:hover a)::before,
        :deep(h3:hover a)::before {
            opacity: 1;
        }

        :deep(p) {
            margin-bottom: 1rem;
        }

        :deep(pre.shiki) {
            border: 1px solid var(--border);
            border-radius: var(--radius);
            padding: 1.25rem 1.5rem;
            overflow-x: auto;
            margin: 1.5rem 0;
            font-size: 0.875rem;
            line-height: 1.65;
        }

        :deep(pre.shiki code) {
            font-family: var(--font-mono);
            background: none;
            padding: 0;
            color: inherit;
        }

        :deep(code:not(pre code)) {
            font-family: var(--font-mono);
            font-size: 0.875em;
            background: var(--bg-subtle);
            color: var(--accent);
            padding: 0.15em 0.4em;
            border-radius: 4px;
        }

        :deep(ul),
        :deep(ol) {
            padding-left: 1.5rem;
            margin-bottom: 1rem;
        }

        :deep(li) {
            margin-bottom: 0.25rem;
        }
    }
}
</style>
