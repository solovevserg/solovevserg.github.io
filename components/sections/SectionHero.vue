<script setup lang="ts">
const { t, tm, rt } = useTypo()
const localePath = useLocalePath()

// Роли уезжают бегущей строкой вместо посимвольной печати: лента живёт
// всегда и не зависит от таймеров, которые ломались бы об интро.
const phrases = computed(() => (tm('hero.typewriter') as any[]).map((l) => rt(l)))

// ─── Параллакс первого экрана ────────────────────────────────
// Прогресс пишется CSS-переменной прямо в DOM, минуя реактивность Vue:
// на каждый кадр скролла перезапускать рендер компонента незачем.
const hero = ref<HTMLElement>()
let raf = 0
let ticking = false

const update = () => {
    const el = hero.value
    if (!el) return
    const h = el.offsetHeight || 1
    const p = Math.min(1, Math.max(0, window.scrollY / h))
    el.style.setProperty('--p', p.toFixed(4))
    ticking = false
}

const onScroll = () => {
    if (ticking) return
    ticking = true
    raf = requestAnimationFrame(update)
}

onMounted(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    update()
})

onUnmounted(() => {
    cancelAnimationFrame(raf)
    window.removeEventListener('scroll', onScroll)
    window.removeEventListener('resize', onScroll)
})
</script>

<template>
    <section ref="hero" class="hero">
        <!-- Кадр -->
        <div class="hero__media" aria-hidden="true">
            <NuxtPicture
                src="/img/avatar.jpg"
                :width="1200"
                :height="1600"
                sizes="sm:100vw md:100vw lg:100vw"
                format="avif,webp"
                preload
                :img-attrs="{
                    class: 'hero__photo',
                    alt: '',
                    fetchpriority: 'high',
                    loading: 'eager',
                }"
            />
            <div class="hero__tint" />
            <div class="hero__scrim" />
        </div>

        <!-- Верхние маргиналии -->
        <div v-reveal="{ delay: 500 }" data-reveal="up" class="hero__hud">
            <div class="container hero__hud-inner">
                <span class="mono-label">{{ t('hero.hud_left') }}</span>
                <span class="hero__hud-geo mono-label">{{ t('hero.hud_right') }}</span>
            </div>
        </div>

        <!-- Имя -->
        <div class="hero__body">
            <div class="container">
                <p v-reveal="{ delay: 400 }" data-reveal="up" class="hero__eyebrow mono-label">
                    <span class="hero__eyebrow-mark rubric-mark">✦</span>
                    {{ t('hero.eyebrow') }}
                </p>

                <h1 v-reveal class="split hero__name">
                    <span class="split__mask hero__line">
                        <span class="split__word" :style="{ '--i': 0 }">
                            {{ t('hero.name_first') }}
                        </span>
                    </span>
                    <span class="split__mask hero__line">
                        <span class="split__word hero__word--outline" :style="{ '--i': 1 }">
                            {{ t('hero.name_last') }}
                        </span>
                    </span>
                </h1>

                <div v-reveal="{ delay: 650 }" data-reveal="up" class="hero__actions">
                    <a
                        v-magnetic="{ strength: 0.22 }"
                        href="https://t.me/sergsol"
                        target="_blank"
                        rel="noopener"
                        class="btn btn--solid"
                        :data-cursor="t('cursor.write')"
                    >
                        <span>{{ t('hero.cta_contact') }}</span>
                    </a>
                    <NuxtLink
                        v-magnetic="{ strength: 0.22 }"
                        :to="localePath('/blog')"
                        class="btn"
                        :data-cursor="t('cursor.read')"
                    >
                        <span>{{ t('hero.cta_blog') }}</span>
                    </NuxtLink>
                </div>
            </div>
        </div>

        <!-- Лента ролей -->
        <div class="hero__ticker">
            <MarqueeRow :items="phrases" :duration="90" />
        </div>

        <a href="#about" class="hero__scroll" :aria-label="t('hero.scroll')">
            <span class="hero__scroll-label mono-label">{{ t('hero.scroll') }}</span>
            <span class="hero__scroll-line" aria-hidden="true" />
        </a>
    </section>
</template>

<style scoped lang="less">
// ─── Первый экран ────────────────────────────────────────────
.hero {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    min-height: calc(100svh - var(--header-h));
    overflow: hidden;
    background: var(--bg);
}

// ─── Кадр ────────────────────────────────────────────────────
.hero__media {
    position: absolute;
    inset: 0;
    z-index: 0;
    // Уезжает медленнее контента и слегка наплывает — глубина кадра
    transform: translate3d(0, calc(var(--p, 0) * 9%), 0) scale(calc(1 + var(--p, 0) * 0.14));
    will-change: transform;

    :deep(picture) {
        display: contents;
    }

    :deep(.hero__photo) {
        width: 100%;
        height: 100%;
        object-fit: cover;
        // Кадр поднят: лицо уходит выше, под имя освобождается низ.
        // По горизонтали снимок не переполняет контейнер, поэтому первое
        // значение на композицию не влияет — оставлено ради узких экранов.
        object-position: 50% 45%;
        // Дуотон: обесцвечиваем и подводим контраст (ADR 0019)
        filter: var(--photo-filter);

        @media (max-width: @bp-sm) {
            object-position: 60% 24%;
        }
    }
}

// Рубричный подкрас поверх обесцвеченного кадра
.hero__tint {
    position: absolute;
    inset: 0;
    background: var(--rubric);
    mix-blend-mode: var(--photo-blend);
    opacity: var(--photo-tint);
}

// Растушёвка к фону: имя должно читаться на любом кадре
.hero__scrim {
    position: absolute;
    inset: 0;
    background:
        linear-gradient(to top, var(--bg) 2%, transparent 55%),
        linear-gradient(to right, var(--bg) 0%, transparent 62%),
        linear-gradient(to bottom, var(--bg) 0%, transparent 22%);

    @media (max-width: @bp-sm) {
        background:
            linear-gradient(to top, var(--bg) 6%, transparent 70%),
            linear-gradient(to bottom, var(--bg) 0%, transparent 30%);
    }
}

// ─── Маргиналии ──────────────────────────────────────────────
// Выравниваются через .container, а не собственными left/right: иначе
// на широких экранах строка уезжала бы к краю окна и не попадала на
// одну вертикаль с именем
.hero__hud {
    position: absolute;
    top: 1.75rem;
    left: 0;
    right: 0;
    z-index: 2;
}

.hero__hud-inner {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
}

.hero__hud-geo {
    @media (max-width: @bp-sm) {
        display: none;
    }
}

// ─── Имя ─────────────────────────────────────────────────────
.hero__body {
    position: relative;
    z-index: 2;
    padding-bottom: 3rem;
    // Контент уходит вверх и растворяется быстрее кадра
    transform: translate3d(0, calc(var(--p, 0) * -4rem), 0);
    opacity: calc(1 - var(--p, 0) * 1.35);
    will-change: transform, opacity;

    @media (max-width: @bp-sm) {
        padding-bottom: 2rem;
    }
}

.hero__eyebrow {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    margin-bottom: 1.5rem;
    color: var(--fg);
}

.hero__eyebrow-mark {
    font-size: 0.6em;
}

.hero__name {
    // Системный шрифт: у Inter 900 контуры кириллицы самопересекаются
    // и обводка идёт артефактами (ADR 0018)
    font-family: var(--font-display-outline);
    font-weight: 900;
    font-size: clamp(3.4rem, 12vw, 11rem);
    line-height: 0.85;
    letter-spacing: -0.05em;
    text-transform: uppercase;
    // Строки имени поднимаются с ощутимым интервалом
    --split-stagger: 130ms;
    margin-bottom: 2.25rem;

    @media (max-width: @bp-sm) {
        margin-bottom: 1.75rem;
    }
}

// .split__mask раскладывает слова в строку — имени нужны блочные строки
.hero__line {
    display: block;
    margin-right: 0;
}

.hero__word--outline {
    color: transparent;
    -webkit-text-stroke: 1.5px var(--fg);

    @media (max-width: @bp-sm) {
        -webkit-text-stroke-width: 1px;
    }
}

.hero__actions {
    display: flex;
    gap: 0.75rem;
    flex-wrap: wrap;
}

// ─── Лента ролей ─────────────────────────────────────────────
.hero__ticker {
    position: relative;
    z-index: 2;
    padding: 1rem 0;
    border-top: 1px solid var(--rule);
    border-bottom: 1px solid var(--rule);
    background: color-mix(in srgb, var(--bg) 60%, transparent);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    font-size: clamp(0.9rem, 1.8vw, 1.4rem);
    font-weight: 800;
    letter-spacing: -0.02em;
    text-transform: uppercase;
    color: var(--fg-2);
}

// ─── Указатель прокрутки ─────────────────────────────────────
.hero__scroll {
    position: absolute;
    right: var(--gutter);
    bottom: 5.5rem;
    z-index: 3;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
    opacity: calc(1 - var(--p, 0) * 2);

    &:hover .hero__scroll-label {
        color: var(--fg);
    }

    @media (max-width: @bp-md) {
        display: none;
    }
}

.hero__scroll-label {
    writing-mode: vertical-rl;
    font-size: 0.58rem;
    transition: color 0.4s var(--ease-out-quart);
}

// Импульс, стекающий по линии вниз
.hero__scroll-line {
    position: relative;
    width: 1px;
    height: 56px;
    background: var(--rule-strong);
    overflow: hidden;

    &::after {
        content: '';
        position: absolute;
        inset: 0;
        background: var(--rubric);
        animation: scroll-pulse 2.2s var(--ease-in-out-quint) infinite;
    }
}

@keyframes scroll-pulse {
    0% {
        transform: translateY(-100%);
    }
    100% {
        transform: translateY(100%);
    }
}

@media (prefers-reduced-motion: reduce) {
    .hero__media,
    .hero__body,
    .hero__scroll {
        transform: none;
        opacity: 1;
    }

    .hero__scroll-line::after {
        animation: none;
    }
}
</style>
