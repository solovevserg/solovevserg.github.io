<script setup lang="ts">
defineProps<{ error: { statusCode: number; statusMessage?: string } }>()

const { t } = useI18n()
const localePath = useLocalePath()

// Страница ошибки рендерится вне NuxtLayout — плагин темы к ней не
// применяется, инициализируем состояние вручную (ADR 0007)
const { init } = useTheme()
onMounted(init)

const marquee = Array.from({ length: 6 }, () => '404')
</script>

<template>
    <div class="err-layout">
        <FilmGrain />
        <CustomCursor />
        <AppHeader />

        <main class="err">
            <div class="container err__inner">
                <span v-reveal data-reveal="up" class="err__code mono-label">
                    {{ error.statusCode }} — {{ error.statusMessage ?? 'Not found' }}
                </span>

                <h1 class="err__num" aria-hidden="true">404</h1>

                <div class="err__ticker">
                    <MarqueeRow :items="marquee" :duration="26" />
                </div>

                <SplitText :text="t('error.title')" tag="p" class="err__title" :stagger="50" />

                <p v-reveal="{ delay: 200 }" data-reveal="up" class="err__sub">
                    {{ t('error.subtitle') }}
                </p>

                <NuxtLink
                    v-reveal="{ delay: 320 }"
                    v-magnetic="{ strength: 0.22 }"
                    data-reveal="up"
                    :to="localePath('/')"
                    class="btn btn--solid err__btn"
                >
                    <span>{{ t('error.home') }}</span>
                </NuxtLink>
            </div>
        </main>

        <AppFooter />
    </div>
</template>

<style>
.err-layout {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    min-height: 100svh;
}

.err {
    flex: 1;
    display: flex;
    align-items: center;
    padding: 6rem 0;
    padding-top: calc(var(--header-h) + 4rem);
    background: var(--bg);
}

.err__inner {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
}

.err__code {
    color: var(--rubric);
    margin-bottom: 1.5rem;
}

/* Обводной номер — системный шрифт без артефактов на контурах (ADR 0018) */
.err__num {
    font-family: var(--font-display-outline);
    font-size: clamp(6rem, 26vw, 20rem);
    font-weight: 900;
    line-height: 0.8;
    letter-spacing: -0.06em;
    color: transparent;
    -webkit-text-stroke: 2px var(--fg);
    margin-bottom: 2rem;
}

.err__ticker {
    width: 100%;
    padding: 0.75rem 0;
    margin-bottom: 2.5rem;
    border-top: 1px solid var(--rule);
    border-bottom: 1px solid var(--rule);
    font-family: var(--font-mono);
    font-size: 0.72rem;
    letter-spacing: 0.3em;
    color: var(--fg-3);
}

.err__title {
    font-size: clamp(1.5rem, 4vw, 2.6rem);
    font-weight: 900;
    line-height: 1.1;
    letter-spacing: -0.04em;
    text-transform: uppercase;
    color: var(--fg);
    margin-bottom: 1rem;
}

.err__sub {
    max-width: 34em;
    font-size: 0.95rem;
    line-height: 1.7;
    color: var(--fg-2);
    margin-bottom: 2.5rem;
    text-wrap: pretty;
}
</style>
