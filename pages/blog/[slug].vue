<script setup lang="ts">
const { t, locale } = useI18n()
const localePath = useLocalePath()
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

const formatDate = (raw: string) => {
    if (!raw) return ''
    return new Date(raw).toLocaleDateString(locale.value === 'ru' ? 'ru-RU' : 'en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    })
}
</script>

<template>
    <div class="container page">
        <NuxtLink :to="localePath('/blog')" class="back">
            <span class="back__arrow" aria-hidden="true">←</span>
            {{ t('blog.back') }}
        </NuxtLink>

        <article class="post">
            <header class="post__head">
                <div class="post__meta">
                    <time v-if="post?.date" class="mono-period">{{ formatDate(post.date) }}</time>
                    <span v-if="post?.tags?.length" class="post__tags">
                        <span v-for="tag in post.tags" :key="tag" class="post__tag">{{ tag }}</span>
                    </span>
                </div>

                <SplitText :text="post?.title ?? ''" tag="h1" class="post__title" :stagger="45" />

                <p v-if="post?.description" v-reveal data-reveal="up" class="post__lead">
                    {{ post.description }}
                </p>
            </header>

            <ContentRenderer v-if="post" :value="post" class="prose" />
        </article>
    </div>
</template>

<style scoped lang="less">
.page {
    max-width: 46rem;
    padding-top: 3rem;
    padding-bottom: 7rem;

    // Статья — узкая колонка по центру: поле маргиналий здесь не нужно
    @media (min-width: (@bp-lg + 1px)) {
        padding-left: var(--gutter);
    }

    @media (max-width: @bp-sm) {
        padding-top: 2rem;
        padding-bottom: 4rem;
    }
}

.back {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 3rem;
    font-family: var(--font-mono);
    font-size: 0.64rem;
    font-weight: 500;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: var(--fg-2);
    transition: color 0.4s var(--ease-out-quart);

    &:hover {
        color: var(--rubric);

        .back__arrow {
            transform: translateX(-4px);
        }
    }
}

.back__arrow {
    transition: transform 0.4s var(--ease-out-expo);
}

.post__head {
    padding-bottom: 2.5rem;
    margin-bottom: 2.5rem;
    border-bottom: 1px solid var(--rule);
}

.post__meta {
    display: flex;
    align-items: center;
    gap: 1rem;
    flex-wrap: wrap;
    margin-bottom: 1.25rem;
}

.post__tags {
    display: flex;
    gap: 0.35rem;
}

.post__tag {
    padding: 0.15rem 0.5rem;
    font-family: var(--font-mono);
    font-size: 0.56rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--rubric);
    background: var(--rubric-dim);
}

.post__title {
    font-size: clamp(2rem, 5vw, 3.2rem);
    font-weight: 900;
    line-height: 1.02;
    letter-spacing: -0.04em;
    color: var(--fg);
}

.post__lead {
    margin-top: 1.5rem;
    font-size: 1.1rem;
    line-height: 1.6;
    color: var(--fg-2);
    text-wrap: pretty;
}
</style>
