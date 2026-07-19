<script setup lang="ts">
const { t, locale } = useI18n()
const localePath = useLocalePath()

usePageSeo({ title: t('blog.title') })

const { data: posts } = await useAsyncData('blog', () =>
    queryContent(`/${locale.value}/blog`).sort({ date: -1 }).find()
)

const formatDate = (raw: string) => {
    if (!raw) return ''
    return new Date(raw).toLocaleDateString(locale.value === 'ru' ? 'ru-RU' : 'en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    })
}

const slugOf = (post: { _file?: string }) => post._file?.split('/').pop()?.replace('.md', '') ?? ''
</script>

<template>
    <div class="container page">
        <PageHeader :title="t('blog.title')" :kicker="t('blog.kicker')" />

        <p v-if="!posts?.length" class="page__empty">{{ t('blog.empty') }}</p>

        <ul v-else class="posts">
            <li v-for="(post, i) in posts" :key="post._path">
                <NuxtLink
                    v-reveal="{ delay: i * 70 }"
                    data-reveal="up"
                    :to="localePath(`/blog/${slugOf(post)}`)"
                    class="post"
                    :data-cursor="t('blog.read')"
                >
                    <span class="post__num">{{ chapterNum(i) }}</span>

                    <span class="post__body">
                        <span class="post__meta">
                            <time class="mono-period">{{ formatDate(post.date) }}</time>
                            <span v-if="post.tags?.length" class="post__tags">
                                <span v-for="tag in post.tags" :key="tag" class="post__tag">
                                    {{ tag }}
                                </span>
                            </span>
                        </span>
                        <h2 class="post__title">{{ post.title }}</h2>
                        <p v-if="post.description" class="post__desc">{{ post.description }}</p>
                    </span>

                    <IconArrowUpRight :size="18" class="post__arrow" />
                </NuxtLink>
            </li>
        </ul>
    </div>
</template>

<style scoped lang="less">
.page {
    padding-top: 5rem;
    padding-bottom: 7rem;

    @media (max-width: @bp-sm) {
        padding-top: 2.5rem;
        padding-bottom: 4rem;
    }
}

.page__empty {
    font-family: var(--font-mono);
    font-size: 0.8rem;
    color: var(--fg-2);
}

// ─── Список статей ───────────────────────────────────────────
.posts {
    border-top: 1px solid var(--rule);
}

.post {
    display: flex;
    align-items: flex-start;
    gap: 1.5rem;
    padding: 2rem 0.5rem;
    border-bottom: 1px solid var(--rule);
    transition: padding-left 0.6s var(--ease-out-expo);

    &:hover {
        padding-left: 1.25rem;

        .post__title {
            color: var(--rubric);
        }
        .post__arrow {
            opacity: 1;
            transform: translate(0, 0);
        }
    }

    @media (max-width: @bp-sm) {
        gap: 1rem;
        padding: 1.5rem 0;
    }
}

.post__num {
    flex-shrink: 0;
    padding-top: 0.2rem;
    font-family: var(--font-mono);
    font-size: 0.62rem;
    font-weight: 500;
    letter-spacing: 0.1em;
    color: var(--rubric);
}

.post__body {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    min-width: 0;
}

.post__meta {
    display: flex;
    align-items: center;
    gap: 1rem;
    flex-wrap: wrap;
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
    font-size: clamp(1.25rem, 2.6vw, 1.9rem);
    font-weight: 800;
    line-height: 1.2;
    letter-spacing: -0.03em;
    color: var(--fg);
    transition: color 0.4s var(--ease-out-quart);
}

.post__desc {
    max-width: 46em;
    font-size: 0.9rem;
    line-height: 1.65;
    color: var(--fg-2);
    text-wrap: pretty;
}

.post__arrow {
    flex-shrink: 0;
    margin-left: auto;
    margin-top: 0.2rem;
    color: var(--rubric);
    opacity: 0;
    transform: translate(-6px, 6px);
    transition:
        opacity 0.4s var(--ease-out-quart),
        transform 0.5s var(--ease-out-expo);

    @media (max-width: @bp-sm) {
        display: none;
    }
}
</style>
