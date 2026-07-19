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
</script>

<template>
    <div class="container page">
        <NuxtLink :to="localePath('/portfolio')" class="back">
            <span class="back__arrow" aria-hidden="true">←</span>
            {{ t('portfolio.back') }}
        </NuxtLink>

        <article>
            <header class="project__head">
                <SplitText
                    :text="project?.title ?? ''"
                    tag="h1"
                    class="project__title"
                    :stagger="45"
                />
                <p v-if="project?.description" v-reveal data-reveal="up" class="project__lead">
                    {{ project.description }}
                </p>
            </header>

            <ContentRenderer v-if="project" :value="project" class="prose" />
        </article>
    </div>
</template>

<style scoped lang="less">
.page {
    max-width: 46rem;
    padding-top: 3rem;
    padding-bottom: 7rem;

    // Узкая колонка по центру: поле маргиналий здесь не нужно
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

.project__head {
    padding-bottom: 2.5rem;
    margin-bottom: 2.5rem;
    border-bottom: 1px solid var(--rule);
}

.project__title {
    font-size: clamp(2rem, 5vw, 3.2rem);
    font-weight: 900;
    line-height: 1.02;
    letter-spacing: -0.04em;
    color: var(--fg);
}

.project__lead {
    margin-top: 1.5rem;
    font-size: 1.1rem;
    line-height: 1.6;
    color: var(--fg-2);
    text-wrap: pretty;
}
</style>
