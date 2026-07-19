<script setup lang="ts">
/**
 * Интро-шторка (ADR 0019).
 *
 * Таймлайн задан целиком в CSS: класс `intro` вешает инлайн-скрипт до первой
 * отрисовки, поэтому шторка стоит на месте с самого первого кадра — вспышки
 * контента нет. Даже если бандл не выполнится, шторка уедет сама: JS только
 * снимает класс, запоминает показ на сеанс и открывает ворота анимаций.
 */
const root = ref<HTMLElement>()

const PANELS = 5
let fallback: ReturnType<typeof setTimeout> | undefined

onMounted(() => {
    if (!isIntroPlaying()) return

    // Страховка: если Web Animations API недоступен или анимации почему-то
    // не стартовали, интро всё равно завершится.
    fallback = setTimeout(() => {
        openMotionGate()
        finishIntro()
    }, INTRO_DURATION + 1200)

    // `finished` разрешается и для уже завершённых анимаций, поэтому поздняя
    // гидратация не может «проспать» событие — в отличие от animationend.
    const settle = (el: HTMLElement | undefined | null, done: () => void) => {
        const anims = el?.getAnimations?.({ subtree: true }) ?? []
        if (!anims.length) return
        Promise.all(anims.map((a) => a.finished))
            .then(done)
            .catch(() => {
                /* анимацию прервали — сработает страховочный таймер */
            })
    }

    // Ворота открываются, как только пошёл первый занавес: имя в hero
    // поднимается одновременно с уходящей шторкой, а не после неё.
    settle(root.value?.querySelector<HTMLElement>('.intro-curtain__panel'), openMotionGate)
    settle(root.value, () => {
        clearTimeout(fallback)
        openMotionGate()
        finishIntro()
    })
})

onUnmounted(() => clearTimeout(fallback))
</script>

<template>
    <div ref="root" class="intro-curtain" aria-hidden="true">
        <div class="intro-curtain__panels">
            <span
                v-for="i in PANELS"
                :key="i"
                class="intro-curtain__panel"
                :style="{ '--i': i - 1 }"
            />
        </div>

        <div class="intro-curtain__hud">
            <span class="intro-curtain__sig">
                sergsol<span class="intro-curtain__dot">.</span>dev
            </span>
            <span class="intro-curtain__counter">
                <span class="intro-curtain__strip">
                    <span v-for="n in 11" :key="n">{{ (n - 1) * 10 }}</span>
                </span>
            </span>
        </div>

        <div class="intro-curtain__rule" />
    </div>
</template>

<!--
  Блок намеренно НЕ scoped: шторкой управляет класс на <html>, а
  `:global(html.intro) .intro` в scoped-стилях Vue схлопывает в `html.intro` —
  правило садится на сам <html> и делает его position: fixed. Собственный
  префикс классов заменяет здесь изоляцию скоупа.
-->
<style lang="less">
.intro-curtain {
    display: none;
}

html.intro .intro-curtain {
    position: fixed;
    inset: 0;
    z-index: 1000;
    display: block;
    // Кликов не ловим никогда: даже при мёртвом JS страница не блокируется
    pointer-events: none;
}

// ─── Занавес ─────────────────────────────────────────────────
.intro-curtain__panels {
    position: absolute;
    inset: 0;
    display: flex;
}

.intro-curtain__panel {
    flex: 1;
    background: var(--bg);
    transform: translate3d(0, 0, 0);
    animation: intro-panel-lift 0.85s @ease-in-out-quint forwards;
    animation-delay: calc(1.15s + var(--i) * 0.07s);
    will-change: transform;
}

@keyframes intro-panel-lift {
    to {
        transform: translate3d(0, -101%, 0);
        visibility: hidden;
    }
}

// ─── HUD ─────────────────────────────────────────────────────
.intro-curtain__hud {
    position: absolute;
    inset: auto var(--gutter) 2.5rem;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 1rem;
    animation: intro-hud-out 0.4s @ease-out-expo 1s forwards;
}

@keyframes intro-hud-out {
    to {
        opacity: 0;
    }
}

.intro-curtain__sig {
    font-family: var(--font-mono);
    font-size: 0.72rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--fg-2);
}

.intro-curtain__dot {
    color: var(--rubric);
}

// ─── Счётчик ─────────────────────────────────────────────────
// Лента цифр 0…100, прокручиваемая шагами. Никакого JS: значение
// не может разъехаться с таймлайном шторки.
.intro-curtain__counter {
    display: block;
    height: 1em;
    overflow: hidden;
    font-family: var(--font-mono);
    font-size: clamp(2.5rem, 9vw, 5rem);
    font-weight: 500;
    line-height: 1;
    letter-spacing: -0.04em;
    color: var(--fg);
}

.intro-curtain__strip {
    display: block;
    animation: intro-count-up 1.15s steps(10, end) forwards;

    > span {
        display: block;
        height: 1em;
        line-height: 1;
    }
}

@keyframes intro-count-up {
    to {
        // 10 из 11 позиций ленты — последняя цифра (100) в окне
        transform: translate3d(0, -90.909%, 0);
    }
}

// ─── Линия, вычерчивающаяся под HUD ──────────────────────────
.intro-curtain__rule {
    position: absolute;
    left: var(--gutter);
    right: var(--gutter);
    bottom: 2rem;
    height: 1px;
    background: var(--rubric);
    transform: scaleX(0);
    transform-origin: left center;
    animation:
        intro-rule-draw 1.05s @ease-out-expo forwards,
        intro-hud-out 0.4s @ease-out-expo 1s forwards;
}

@keyframes intro-rule-draw {
    to {
        transform: scaleX(1);
    }
}
</style>
