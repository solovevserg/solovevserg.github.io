<script setup lang="ts">
type SkillKey = { name: string; level: 'expert' | 'advanced' | 'intermediate' }
type SkillGroup = { name: string; keys: SkillKey[]; items: string[] }

const { t, tm, rt } = useTypo()

const skillGroups = computed<SkillGroup[]>(() =>
    (tm('skills.groups') as any[]).map((g) => ({
        name: rt(g.name),
        keys: (g.keys as any[]).map((k) => ({
            name: rt(k.name),
            level: rt(k.level) as SkillKey['level'],
        })),
        items: (g.items as any[]).map((i) => rt(i)),
    }))
)

const LEVEL_FILL: Record<SkillKey['level'], number> = {
    intermediate: 1,
    advanced: 2,
    expert: 3,
}

// ─── Залипающая горизонтальная прокрутка ─────────────────────
// Прогресс вертикального скролла по секции переводится в сдвиг ленты.
// Режим включается только на десктопе и только при работающем JS: во всех
// остальных случаях панели остаются обычной сеткой (и мобильным
// скролл-списком), поэтому контент доступен всегда.
const root = ref<HTMLElement>()
const wrap = ref<HTMLElement>()
const track = ref<HTMLElement>()
const bar = ref<HTMLElement>()
const pinned = ref(false)

let travel = 0
let raf = 0
let ticking = false
let mq: MediaQueryList | null = null

const measure = () => {
    const w = wrap.value
    const tr = track.value
    if (!w || !tr || !pinned.value) return

    // Левый край ленты равняем по контейнеру шапки главы: панель №1 должна
    // начинаться ровно там же, где заголовок, включая поле маргиналий.
    const anchor = root.value?.querySelector<HTMLElement>('.container')
    if (anchor) {
        const left =
            anchor.getBoundingClientRect().left + parseFloat(getComputedStyle(anchor).paddingLeft)
        tr.style.paddingLeft = `${left}px`
        // Тем же замером гасим ленту слева: уезжающие панели должны стать
        // полностью прозрачными до колонки маргиналий, а не наезжать на неё
        w.style.setProperty('--fade-end', `${left}px`)
    }

    const viewH = window.innerHeight - headerHeight()
    travel = Math.max(0, tr.scrollWidth - window.innerWidth)
    w.style.height = `${viewH + travel}px`
    apply()
}

const headerHeight = () =>
    parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 0

const apply = () => {
    const w = wrap.value
    const tr = track.value
    if (!w || !tr || !pinned.value) return

    const rect = w.getBoundingClientRect()
    const dist = w.offsetHeight - (window.innerHeight - headerHeight())
    const p = dist > 0 ? Math.min(1, Math.max(0, (headerHeight() - rect.top) / dist)) : 0

    tr.style.transform = `translate3d(${-(p * travel).toFixed(2)}px, 0, 0)`
    if (bar.value) bar.value.style.transform = `scaleX(${p.toFixed(4)})`
    ticking = false
}

const onScroll = () => {
    if (ticking) return
    ticking = true
    raf = requestAnimationFrame(apply)
}

const teardown = () => {
    pinned.value = false
    if (wrap.value) {
        wrap.value.style.height = ''
        wrap.value.style.removeProperty('--fade-end')
    }
    if (track.value) {
        track.value.style.transform = ''
        track.value.style.paddingLeft = ''
    }
}

const sync = () => {
    const wide = mq?.matches ?? false
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (wide && !reduce) {
        pinned.value = true
        // Класс .pin--on меняет раскладку ленты — меряем после перерисовки
        nextTick(measure)
    } else {
        teardown()
    }
}

onMounted(() => {
    mq = window.matchMedia(above('md'))
    sync()
    mq.addEventListener('change', sync)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', measure, { passive: true })
})

onUnmounted(() => {
    cancelAnimationFrame(raf)
    mq?.removeEventListener('change', sync)
    window.removeEventListener('scroll', onScroll)
    window.removeEventListener('resize', measure)
})
</script>

<template>
    <section id="skills" ref="root" class="section section--ruled">
        <div class="container">
            <SectionHeader num="05" :title="t('skills.title')" :kicker="t('skills.kicker')" />
        </div>

        <div ref="wrap" class="pin" :class="{ 'pin--on': pinned }">
            <div class="pin__inner">
                <div class="pin__view">
                    <div ref="track" class="pin__track mobile-scroll-list">
                        <article
                            v-for="(group, i) in skillGroups"
                            :key="group.name"
                            v-reveal="{ delay: i * 60 }"
                            data-reveal="up"
                            class="panel mobile-scroll-item"
                        >
                            <div class="panel__head">
                                <span class="panel__num">{{ chapterNum(i) }}</span>
                                <h3 class="panel__name">{{ group.name }}</h3>
                            </div>

                            <ul class="panel__keys">
                                <li v-for="key in group.keys" :key="key.name" class="key">
                                    <span class="key__name">{{ key.name }}</span>
                                    <span class="key__meter" aria-hidden="true">
                                        <span
                                            v-for="n in 3"
                                            :key="n"
                                            class="key__seg"
                                            :class="{ 'key__seg--on': n <= LEVEL_FILL[key.level] }"
                                        />
                                    </span>
                                    <span class="u-sr-only">{{
                                        t(`skills.levels.${key.level}`)
                                    }}</span>
                                </li>
                            </ul>

                            <ul v-if="group.items.length" class="panel__tags">
                                <li v-for="item in group.items" :key="item" class="panel__tag">
                                    {{ item }}
                                </li>
                            </ul>
                        </article>
                    </div>
                </div>

                <div v-if="pinned" class="pin__progress" aria-hidden="true">
                    <span ref="bar" class="pin__progress-fill" />
                </div>
            </div>
        </div>
    </section>
</template>

<style scoped lang="less">
// .pin вынесен из .container ради полноэкранной ленты на десктопе, но
// .mobile-scroll-list рассчитывает на отступы контейнера и гасит их
// отрицательными полями. Без этого лента вылезала за правый край окна
// и растягивала документ (а с ним и fixed-шапку) на ширину --gutter.
.pin__view {
    @media (max-width: @bp-sm) {
        padding: 0 var(--gutter);
    }
}

// ─── Раскладка по умолчанию: обычная сетка ───────────────────
// Ни одного базового правила вне медиазапроса: scoped-специфичность
// перебила бы отступы .mobile-scroll-list и сломала мобильный скролл.
.pin__track {
    @media (min-width: (@bp-sm + 1px)) {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 1.5rem;
        width: 100%;
        max-width: var(--max-w);
        margin: 0 auto;
        padding: 0 var(--gutter);
    }

    @media (min-width: (@bp-md + 1px)) {
        grid-template-columns: repeat(3, 1fr);
    }

    @media (min-width: (@bp-lg + 1px)) {
        padding-left: calc(var(--gutter) + var(--rail-w));
    }
}

// ─── Закреплённый режим ──────────────────────────────────────
.pin--on {
    @media (min-width: (@bp-md + 1px)) {
        position: relative;

        .pin__inner {
            position: sticky;
            top: var(--header-h);
            height: calc(100svh - var(--header-h));
            display: flex;
            flex-direction: column;
            justify-content: center;
            overflow: hidden;
        }

        // Вытирка слева ровно по левому краю колонки текста: --fade-end
        // приходит из JS тем же замером, что и padding ленты. В покое
        // первая панель остаётся чёткой, а уезжающие гаснут до того, как
        // дойдут до рельсы глав, — иначе номера читались бы поверх панелей.
        .pin__view {
            @fade-end: var(--fade-end, 10%);
            @fade-start: calc(@fade-end - 4rem);
            -webkit-mask-image: linear-gradient(
                to right,
                transparent 0,
                transparent @fade-start,
                #000 @fade-end
            );
            mask-image: linear-gradient(
                to right,
                transparent 0,
                transparent @fade-start,
                #000 @fade-end
            );
        }

        .pin__track {
            display: flex;
            max-width: none;
            width: max-content;
            margin: 0;
            // padding-left выставляется из JS по замеру контейнера
            padding-right: 12vw;
            gap: 1.5rem;
            will-change: transform;
        }

        .panel {
            flex: 0 0 clamp(20rem, 27vw, 27rem);
            // Панель держит высоту кадра: иначе в закреплённом экране
            // сверху и снизу остаются пустые полосы
            min-height: min(52vh, 26rem);
        }
    }
}

// ─── Панель ──────────────────────────────────────────────────
.panel {
    display: flex;
    flex-direction: column;
    gap: 1.75rem;
    padding: 2rem;
    background: var(--bg-raise);
    border: 1px solid var(--rule);
    border-top: 1px solid var(--rubric);
}

.panel__head {
    display: flex;
    align-items: baseline;
    gap: 0.875rem;
    padding-bottom: 1.25rem;
    border-bottom: 1px solid var(--rule);
}

.panel__num {
    font-family: var(--font-mono);
    font-size: 0.62rem;
    font-weight: 500;
    letter-spacing: 0.1em;
    color: var(--rubric);
    flex-shrink: 0;
}

.panel__name {
    font-size: clamp(1.35rem, 2.2vw, 1.9rem);
    font-weight: 900;
    line-height: 1;
    letter-spacing: -0.04em;
    text-transform: uppercase;
    color: var(--fg);
}

// ─── Ключевые навыки ─────────────────────────────────────────
.panel__keys {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    flex: 1;
}

.key {
    display: flex;
    align-items: center;
    gap: 0.875rem;
}

.key__name {
    flex: 1;
    min-width: 0;
    font-size: 0.9rem;
    font-weight: 600;
    letter-spacing: -0.01em;
    color: var(--fg);
}

.key__meter {
    display: flex;
    gap: 3px;
    flex-shrink: 0;
}

.key__seg {
    width: 14px;
    height: 3px;
    background: var(--rule-strong);

    &--on {
        background: var(--rubric);
    }
}

// ─── Теги ────────────────────────────────────────────────────
.panel__tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.35rem;
    padding-top: 1.25rem;
    border-top: 1px solid var(--rule);
}

.panel__tag {
    padding: 0.2rem 0.55rem;
    font-family: var(--font-mono);
    font-size: 0.6rem;
    letter-spacing: 0.04em;
    color: var(--fg-2);
    border: 1px solid var(--rule);
}

// ─── Индикатор горизонтального хода ──────────────────────────
.pin__progress {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 2.5rem;
    height: 1px;
    background: var(--rule);
}

.pin__progress-fill {
    display: block;
    height: 100%;
    background: var(--rubric);
    transform: scaleX(0);
    transform-origin: left center;
    will-change: transform;
}
</style>
