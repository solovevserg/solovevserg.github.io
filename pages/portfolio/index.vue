<script setup lang="ts">
const { t, locale } = useI18n()
const localePath = useLocalePath()

usePageSeo({ title: t('portfolio.title') })

const { data: projects } = await useAsyncData('portfolio', () =>
    queryContent(`/${locale.value}/projects`).find()
)

const slugOf = (project: { _file?: string }) =>
    project._file?.split('/').pop()?.replace('.md', '') ?? ''
</script>

<template>
    <div class="container page">
        <PageHeader :title="t('portfolio.title')" :kicker="t('portfolio.kicker')" />

        <p v-if="!projects?.length" class="page__empty">{{ t('portfolio.empty') }}</p>

        <ul v-else class="projects">
            <li v-for="(project, i) in projects" :key="project._path">
                <NuxtLink
                    v-reveal="{ delay: i * 70 }"
                    data-reveal="up"
                    :to="localePath(`/portfolio/${slugOf(project)}`)"
                    class="project"
                    :data-cursor="t('cursor.open')"
                >
                    <span class="project__num">{{ chapterNum(i) }}</span>
                    <span class="project__body">
                        <h2 class="project__title">{{ project.title }}</h2>
                        <p v-if="project.description" class="project__desc">
                            {{ project.description }}
                        </p>
                    </span>
                    <IconArrowUpRight :size="18" class="project__arrow" />
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

.projects {
    border-top: 1px solid var(--rule);
}

.project {
    display: flex;
    align-items: flex-start;
    gap: 1.5rem;
    padding: 2rem 0.5rem;
    border-bottom: 1px solid var(--rule);
    transition: padding-left 0.6s var(--ease-out-expo);

    &:hover {
        padding-left: 1.25rem;

        .project__title {
            color: var(--rubric);
        }
        .project__arrow {
            opacity: 1;
            transform: translate(0, 0);
        }
    }
}

.project__num {
    flex-shrink: 0;
    padding-top: 0.2rem;
    font-family: var(--font-mono);
    font-size: 0.62rem;
    font-weight: 500;
    letter-spacing: 0.1em;
    color: var(--rubric);
}

.project__body {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    min-width: 0;
}

.project__title {
    font-size: clamp(1.25rem, 2.6vw, 1.9rem);
    font-weight: 800;
    line-height: 1.2;
    letter-spacing: -0.03em;
    color: var(--fg);
    transition: color 0.4s var(--ease-out-quart);
}

.project__desc {
    max-width: 46em;
    font-size: 0.9rem;
    line-height: 1.65;
    color: var(--fg-2);
    text-wrap: pretty;
}

.project__arrow {
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
