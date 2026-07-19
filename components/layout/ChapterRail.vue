<script setup lang="ts">
/**
 * Рельса глав — маргиналии на левом поле (ADR 0019).
 *
 * Основная посекционная навигация на десктопе: хедер её не дублирует.
 * Ниже @bp-lg скрывается — там навигация живёт в полноэкранном меню.
 */
const { t } = useI18n()
const { progress, activeIndex, sections } = useScrollSpy()

const route = useRoute()
const localePath = useLocalePath()
const isHome = computed(() => route.name?.toString().startsWith('index'))

const href = (id: string) => (isHome.value ? `#${id}` : `${localePath('/')}#${id}`)
</script>

<template>
    <nav class="rail" :aria-label="t('rail.title')">
        <div class="rail__track" aria-hidden="true">
            <span class="rail__fill" :style="{ transform: `scaleY(${progress / 100})` }" />
        </div>

        <ol class="rail__list">
            <li
                v-for="(s, i) in sections"
                :key="s.id"
                class="rail__item"
                :class="{ 'rail__item--on': isHome && i === activeIndex }"
            >
                <a :href="href(s.id)" class="rail__link">
                    <span class="rail__num">{{ chapterNum(i) }}</span>
                    <span class="rail__tick" aria-hidden="true" />
                    <span class="rail__label">{{ t(s.labelKey) }}</span>
                </a>
            </li>
        </ol>
    </nav>
</template>

<style scoped lang="less">
.rail {
    position: fixed;
    top: 50%;
    // На широких экранах поле выравнивается по краю контейнера, иначе
    // маргиналии уезжали бы к самому краю окна и отрывались от текста
    left: max(1.75rem, calc((100vw - var(--max-w)) / 2 + 1.75rem));
    z-index: 80;
    display: flex;
    align-items: center;
    gap: 1rem;
    transform: translateY(-50%);

    // Ниже @bp-lg колонка маргиналий в сетке не выделяется (global.less)
    @media (max-width: @bp-lg) {
        display: none;
    }
}

// ─── Полоса прогресса ────────────────────────────────────────
.rail__track {
    position: relative;
    width: 1px;
    height: 148px;
    background: var(--rule);
    flex-shrink: 0;
}

.rail__fill {
    position: absolute;
    inset: 0;
    background: var(--rubric);
    transform-origin: top center;
    // Полоса тянется за скроллом с лёгким запаздыванием
    transition: transform 0.15s linear;
}

// ─── Главы ───────────────────────────────────────────────────
.rail__list {
    display: flex;
    flex-direction: column;
    gap: 0.65rem;
}

.rail__link {
    position: relative;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

// Активная глава отмечается штрихом, а не текстом: на поле между краем
// окна и колонкой текста подпись целиком не помещается
.rail__tick {
    width: 0;
    height: 1px;
    background: var(--rubric);
    transition: width 0.5s var(--ease-out-expo);
}

.rail__item--on .rail__tick {
    width: 14px;
}

.rail__num {
    font-family: var(--font-mono);
    font-size: 0.6rem;
    font-weight: 500;
    letter-spacing: 0.1em;
    // Рельса висит поверх меняющихся подложек, включая фото: на --fg-3
    // номера на светлых кадрах пропадают
    color: var(--fg-2);
    transition: color 0.4s var(--ease-out-quart);
}

// Подпись выводится только под курсором и абсолютным позиционированием:
// в потоке она раздвигала бы рельсу и наезжала на колонку текста.
// Плашка нужна, чтобы подпись читалась поверх любой подложки.
.rail__label {
    position: absolute;
    left: calc(100% + 0.75rem);
    top: 50%;
    z-index: 1;
    padding: 0.3rem 0.6rem;
    white-space: nowrap;
    pointer-events: none;
    font-family: var(--font-mono);
    font-size: 0.6rem;
    font-weight: 500;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--fg);
    background: var(--bg);
    border: 1px solid var(--rule-strong);
    opacity: 0;
    transform: translateY(-50%) translateX(-6px);
    transition:
        opacity 0.35s var(--ease-out-quart),
        transform 0.5s var(--ease-out-expo);
}

.rail__item--on .rail__num {
    color: var(--rubric);
}

.rail__link:hover,
.rail__link:focus-visible {
    .rail__num {
        color: var(--fg);
    }
    .rail__label {
        opacity: 1;
        transform: translateY(-50%) translateX(0);
    }
}
</style>
