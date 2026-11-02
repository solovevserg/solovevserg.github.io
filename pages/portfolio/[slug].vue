<script setup lang="ts">
const { t, locale } = useI18n()
const localePath = useLocalePath()
const route = useRoute()

const { data: project } = await useAsyncData(`project-${route.params.slug}`, () =>
    queryContent(`/${locale.value}/projects/${route.params.slug}`).findOne()
)

if (!project.value) {
    throw createError({ statusCode: 404, statusMessage: 'Project not found' })
}

usePageSeo({
    title: project.value.title,
    description: project.value.description,
})

// CreativeWork + хлебные крошки (ADR 0016)
const SITE = 'https://sergsol.dev'
const projectUrl = computed(() => `${SITE}${localePath(`/portfolio/${route.params.slug}`)}`)
useHead(() => ({
    script: [
        {
            type: 'application/ld+json',
            innerHTML: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'CreativeWork',
                name: project.value?.title,
                description: project.value?.description,
                url: projectUrl.value,
                inLanguage: locale.value,
                author: { '@id': `${SITE}/#person` },
            }),
        },
    ],
}))

useBreadcrumbJsonLd(() => [
    { name: t('nav.home'), url: SITE },
    { name: t('nav.portfolio'), url: `${SITE}/portfolio` },
    { name: project.value?.title, url: projectUrl.value },
])
</script>

<template>
    <article class="container project">
        <header class="project__header">
            <h1 class="project__title">{{ project?.title }}</h1>
            <p v-if="project?.description" class="project__desc">{{ project?.description }}</p>
        </header>

        <ContentRenderer v-if="project" :value="project" class="project__body" />
    </article>
</template>

<style scoped lang="less">
.project {
    max-width: 680px;

    &__header {
        margin-bottom: 2rem;
        padding-bottom: 1.5rem;
        border-bottom: 1px solid var(--color-border);
    }

    &__title {
        font-size: clamp(1.6rem, 4vw, 2.2rem);
        line-height: 1.2;
        margin-bottom: 0.5rem;
    }

    &__desc {
        color: var(--color-muted);
        font-size: 1.05rem;
    }

    &__body {
        :deep(h2) {
            font-size: 1.4rem;
            margin: 2rem 0 0.75rem;
        }
        :deep(p) {
            margin-bottom: 1rem;
        }
        :deep(ul) {
            padding-left: 1.5rem;
            margin-bottom: 1rem;
        }
    }
}
</style>
