<script setup lang="ts">
const { t, locale } = useI18n()
const route = useRoute()
const localePath = useLocalePath()

const CHANNEL = 'phi_code'

// Поста нет в текущей локали → показываем ru-версию как заглушку с редиректом.
// Важно: .find(), а не .findOne() — findOne по несуществующему документу отдаёт
// 404 из /api/_content/query и ломает prerender (SSG), find() возвращает []
const { data: post } = await useAsyncData(`blog-${route.params.slug}`, async () => {
    const found = (await queryContent(`/${locale.value}/blog/${route.params.slug}`).find())[0]
    if (found || locale.value === 'ru') return found ?? null
    return (await queryContent(`/ru/blog/${route.params.slug}`).find())[0] ?? null
})

const isRuFallback = computed(() => Boolean(post.value) && locale.value !== 'ru')

if (!post.value) {
    throw createError({ statusCode: 404, statusMessage: 'Post not found' })
}

usePageSeo({
    title: post.value.title,
    description: post.value.description,
    image: post.value.image,
})

// JSON-LD: BlogPosting + BreadcrumbList (ADR 0016, ADR 0020)
const SITE = 'https://sergsol.dev'
const postUrl = computed(() => `${SITE}${localePath(`/blog/${route.params.slug}`)}`)
useHead(() => ({
    script: [
        {
            type: 'application/ld+json',
            innerHTML: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'BlogPosting',
                headline: post.value?.title,
                description: post.value?.description,
                image: post.value?.image ? `${SITE}${post.value.image}` : undefined,
                datePublished: post.value?.date,
                dateModified: post.value?.updated_at ?? post.value?.date,
                author: { '@id': `${SITE}/#person` },
                publisher: { '@id': `${SITE}/#website` },
                mainEntityOfPage: postUrl.value,
                url: postUrl.value,
                inLanguage: locale.value,
                isAccessibleForFree: true,
            }),
        },
    ],
}))

useBreadcrumbJsonLd(() => [
    { name: t('nav.home'), url: SITE },
    { name: t('nav.blog'), url: `${SITE}/blog` },
    { name: post.value?.title, url: postUrl.value },
])

// заглушка: через 3 секунды переводим на ru-версию
if (isRuFallback.value) {
    onMounted(() => {
        setTimeout(() => navigateTo(localePath(`/blog/${route.params.slug}`, 'ru')), 3000)
    })
}

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
    <!-- en-версия без перевода: заглушка с редиректом на ru -->
    <article v-if="isRuFallback" class="container post post--fallback">
        <p class="post__fallback-note">{{ t('blog.only_ru') }}</p>
        <NuxtLink
            class="post__fallback-link"
            :to="localePath(`/blog/${route.params.slug}`, 'ru')"
            >{{ t('blog.read_ru') }}</NuxtLink
        >
    </article>

    <article v-else class="container post">
        <nav class="post__breadcrumbs">
            <NuxtLink :to="localePath('/blog')" class="post__back">
                {{ t('blog.back') }}
            </NuxtLink>
        </nav>

        <header class="post__header">
            <p class="post__meta">
                <time class="post__date">{{ formatDate(post?.date) }}</time>
                <template v-if="post?.updated_at">
                    <span class="post__meta-sep">·</span>
                    <span class="post__updated">
                        {{ t('blog.updated') }} {{ formatDate(post?.updated_at) }}
                    </span>
                </template>
            </p>
            <h1 class="post__title">{{ post?.title }}</h1>
        </header>

        <ContentRenderer v-if="post" :value="post" class="post__body" />

        <footer class="post__author">
            <NuxtLink :to="localePath('/')" class="post__author-link">
                <NuxtPicture
                    src="/img/avatar.jpg"
                    format="avif,webp"
                    width="56"
                    height="56"
                    class="post__author-avatar"
                />
                <div class="post__author-info">
                    <div class="post__author-name">
                        {{ t('hero.name_first') }} {{ t('hero.name_last') }}
                    </div>
                    <div class="post__author-slogan">{{ t('blog.author_slogan') }}</div>
                </div>
            </NuxtLink>
        </footer>

        <aside v-if="post?.telegram_url" class="post__telegram">
            <p class="post__telegram-note">
                {{ t('blog.telegram_source') }}
                <a
                    :href="post.telegram_url"
                    target="_blank"
                    rel="noopener"
                    class="post__telegram-link"
                    >«Философский код»</a
                >
            </p>
            <p class="post__telegram-hint">{{ t('blog.telegram_hint') }}</p>
            <a
                :href="`https://t.me/${CHANNEL}`"
                target="_blank"
                rel="noopener"
                class="post__telegram-btn"
                >{{ t('blog.subscribe_cta') }}</a
            >
        </aside>
    </article>
</template>

<style scoped lang="less">
.post {
    max-width: 680px;
    padding-top: 4rem;
    padding-bottom: 6rem;

    &__breadcrumbs {
        margin-bottom: 1.5rem;
    }

    &__back {
        font-size: 0.85rem;
        color: var(--text-muted);
        text-decoration: none;
        transition: color 0.2s;

        &:hover {
            color: var(--accent);
        }
    }

    &__header {
        margin-bottom: 2rem;
    }

    &__meta {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin: 0;
    }

    &__date {
        font-size: 0.85rem;
        color: var(--text-muted);
    }

    &__meta-sep {
        color: var(--text-muted);
    }

    &__updated {
        font-size: 0.85rem;
        color: var(--text-muted);
        font-style: italic;
    }

    &__title {
        font-size: clamp(1.6rem, 4vw, 2.2rem);
        line-height: 1.2;
        margin: 0.5rem 0;
    }

    &__body {
        line-height: 1.75;

        :deep(h2),
        :deep(h3) {
            position: relative;
        }

        :deep(h2) {
            font-size: 1.4rem;
            line-height: 1.3;
            margin: 2.5rem 0 0.75rem;
            color: var(--accent);
        }

        :deep(h3) {
            font-size: 1.15rem;
            line-height: 1.35;
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
            margin-bottom: 1.25rem;
        }

        :deep(img) {
            max-width: 100%;
            border-radius: var(--radius);
            margin: 1.5rem 0;
        }

        :deep(video) {
            max-width: 100%;
            border-radius: var(--radius);
            margin: 1.5rem 0;
        }

        :deep(blockquote) {
            margin: 1.5rem 0;
            padding: 0.25rem 0 0.25rem 1.25rem;
            border-left: 2px solid var(--accent);
            color: var(--text-muted);
        }

        :deep(a) {
            color: var(--accent);
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
            margin-bottom: 1.25rem;
        }

        :deep(li) {
            margin-bottom: 0.4rem;
        }
    }

    &__author {
        margin-top: 3rem;
        padding-top: 1.5rem;
        border-top: 1px solid var(--border);
    }

    &__author-link {
        display: flex;
        align-items: center;
        gap: 1rem;
        width: fit-content;
        color: inherit;
        text-decoration: none;
        border-radius: var(--radius);
        transition: opacity 0.2s;

        &:hover .post__author-name {
            color: var(--accent);
        }
    }

    &__author-avatar {
        flex-shrink: 0;
        width: 56px;
        height: 56px;
        border-radius: 50%;
        overflow: hidden;

        :deep(img) {
            width: 100%;
            height: 100%;
            object-fit: cover;
            margin: 0;
        }
    }

    &__author-name {
        font-weight: 700;
        font-size: 0.95rem;
    }

    &__author-slogan {
        font-size: 0.85rem;
        color: var(--text-muted);
    }

    &__telegram {
        margin-top: 1.5rem;
        padding: 1.5rem 1.75rem;
        background: var(--bg-subtle);
        border: 1px solid var(--border);
        border-radius: var(--radius);
    }

    &__telegram-note {
        margin: 0;
        font-size: 0.925rem;
        color: var(--text-muted);
    }

    &__telegram-link {
        color: var(--accent);
        font-weight: 600;
        text-decoration: none;

        &:hover {
            text-decoration: underline;
        }
    }

    &__telegram-hint {
        margin: 0.35rem 0 1rem;
        font-size: 0.925rem;
        color: var(--text-muted);
    }

    &__telegram-btn {
        display: inline-block;
        padding: 0.6rem 1.4rem;
        background: var(--accent);
        color: var(--bg);
        font-weight: 600;
        font-size: 0.9rem;
        border-radius: var(--radius);
        text-decoration: none;
        transition: filter 0.2s;

        &:hover {
            filter: brightness(1.1);
        }
    }

    &__fallback-note {
        color: var(--text-muted);
    }

    &__fallback-link {
        display: inline-block;
        margin-top: 0.75rem;
        padding: 0.6rem 1.4rem;
        background: var(--accent);
        color: var(--bg);
        font-weight: 600;
        font-size: 0.9rem;
        border-radius: var(--radius);
        text-decoration: none;
        transition: filter 0.2s;

        &:hover {
            filter: brightness(1.1);
        }
    }
}
</style>
