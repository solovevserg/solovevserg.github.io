<script setup lang="ts">
const { t, locale } = useI18n()
const localePath = useLocalePath()

usePageSeo({ title: t('blog.title') })

const { data: posts } = await useAsyncData('blog', () =>
    queryContent(`/${locale.value}/blog`).sort({ date: -1 }).find()
)

const formatDate = (raw: string) => {
    if (!raw) return ''
    const d = new Date(raw)
    return d.toLocaleDateString(locale.value === 'ru' ? 'ru-RU' : 'en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    })
}
</script>

<template>
    <div class="container page-wrap">
        <header class="page-header">
            <h1 class="page-title">{{ t('blog.title') }}</h1>
        </header>

        <p v-if="!posts?.length" class="empty">{{ t('blog.empty') }}</p>

        <ul v-else class="post-list">
            <li v-for="post in posts" :key="post._path">
                <NuxtLink
                    :to="localePath(`/blog/${post._file?.split('/').pop()?.replace('.md', '')}`)"
                    class="post-card card-hover"
                >
                    <div class="post-card__meta">
                        <time class="post-card__date">{{ formatDate(post.date) }}</time>
                        <span v-if="post.tags?.length" class="post-card__tags">
                            <span v-for="tag in post.tags" :key="tag" class="post-card__tag">{{
                                tag
                            }}</span>
                        </span>
                    </div>
                    <h2 class="post-card__title">{{ post.title }}</h2>
                    <p v-if="post.description" class="post-card__desc">{{ post.description }}</p>
                    <span class="post-card__read">{{
                        locale === 'ru' ? 'Читать →' : 'Read →'
                    }}</span>
                </NuxtLink>
            </li>
        </ul>
    </div>
</template>

<style scoped lang="less">
.page-wrap {
    padding-top: 4rem;
    padding-bottom: 6rem;
    max-width: 780px;
}

.page-header {
    margin-bottom: 3rem;
    padding-bottom: 1.5rem;
    border-bottom: 1px solid var(--border);
}

.page-title {
    font-size: clamp(2rem, 5vw, 3rem);
    font-weight: 800;
    letter-spacing: -0.03em;
    color: var(--text);
}

.empty {
    color: var(--text-muted);
}

.post-list {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.post-card {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding: 1.75rem 2rem;
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    color: inherit;
    text-decoration: none;

    &:hover .post-card__title {
        color: var(--accent);
    }
    &:hover .post-card__read {
        opacity: 1;
        transform: translateX(0);
    }

    &__meta {
        display: flex;
        align-items: center;
        gap: 1rem;
        flex-wrap: wrap;
    }

    &__date {
        font-family: var(--font-mono);
        font-size: 0.75rem;
        color: var(--text-muted);
    }

    &__tags {
        display: flex;
        gap: 0.4rem;
    }

    &__tag {
        font-size: 0.7rem;
        font-weight: 500;
        letter-spacing: 0.04em;
        text-transform: uppercase;
        color: var(--accent);
        background: var(--accent-dim);
        padding: 0.2em 0.6em;
        border-radius: 4px;
    }

    &__title {
        font-size: 1.25rem;
        font-weight: 700;
        letter-spacing: -0.02em;
        color: var(--text);
        transition: color 0.2s;
    }

    &__desc {
        font-size: 0.925rem;
        color: var(--text-muted);
        line-height: 1.6;
    }

    &__read {
        font-size: 0.8rem;
        font-weight: 500;
        color: var(--accent);
        margin-top: 0.25rem;
        opacity: 0;
        transform: translateX(-4px);
        transition:
            opacity 0.2s,
            transform 0.2s;
    }
}
</style>
