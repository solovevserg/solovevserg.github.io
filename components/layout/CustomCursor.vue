<script setup lang="ts">
/**
 * Кастомный курсор (ADR 0019).
 *
 * Точка следует за указателем кадр в кадр, кольцо догоняет с запаздыванием.
 * Включается только там, где есть настоящий указатель: на тач-устройствах и
 * при prefers-reduced-motion компонент не монтирует ничего и не трогает
 * системный курсор.
 */
const enabled = ref(false)
const visible = ref(false)
const hovering = ref(false)
const label = ref('')

const ring = ref<HTMLElement>()
const dot = ref<HTMLElement>()

// Позиции держим вне реактивности: перерисовка идёт через rAF напрямую в
// transform, иначе на каждое движение мыши запускался бы цикл Vue.
const target = { x: 0, y: 0 }
const eased = { x: 0, y: 0 }
let raf = 0
let primed = false

const CURSOR_SELECTOR = 'a, button, [data-cursor], input, textarea, select'

const onMove = (e: PointerEvent) => {
    target.x = e.clientX
    target.y = e.clientY
    if (!primed) {
        // Первый кадр — без «прилёта» кольца из угла экрана
        eased.x = target.x
        eased.y = target.y
        primed = true
    }
    visible.value = true
}

const onOver = (e: PointerEvent) => {
    const el = (e.target as Element | null)?.closest?.(CURSOR_SELECTOR)
    hovering.value = !!el
    label.value = (el as HTMLElement | null)?.dataset?.cursor ?? ''
}

const onLeave = () => (visible.value = false)
const onEnter = () => (visible.value = true)
const onDown = () => (visible.value = true)

const loop = () => {
    // Экспоненциальное сглаживание: кольцо «тянется» за точкой
    eased.x += (target.x - eased.x) * 0.16
    eased.y += (target.y - eased.y) * 0.16

    if (ring.value) {
        ring.value.style.transform = `translate3d(${eased.x}px, ${eased.y}px, 0) translate(-50%, -50%)`
    }
    if (dot.value) {
        dot.value.style.transform = `translate3d(${target.x}px, ${target.y}px, 0) translate(-50%, -50%)`
    }
    raf = requestAnimationFrame(loop)
}

onMounted(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!fine || reduce) return

    enabled.value = true
    document.documentElement.classList.add('has-cursor')

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerover', onOver, { passive: true })
    window.addEventListener('pointerdown', onDown, { passive: true })
    document.addEventListener('pointerleave', onLeave)
    document.addEventListener('pointerenter', onEnter)
    raf = requestAnimationFrame(loop)
})

onUnmounted(() => {
    cancelAnimationFrame(raf)
    document.documentElement.classList.remove('has-cursor')
    window.removeEventListener('pointermove', onMove)
    window.removeEventListener('pointerover', onOver)
    window.removeEventListener('pointerdown', onDown)
    document.removeEventListener('pointerleave', onLeave)
    document.removeEventListener('pointerenter', onEnter)
})
</script>

<template>
    <div
        v-if="enabled"
        class="cursor"
        :class="{ 'cursor--on': visible, 'cursor--hover': hovering, 'cursor--label': !!label }"
        aria-hidden="true"
    >
        <div ref="ring" class="cursor__ring">
            <span v-if="label" class="cursor__label">{{ label }}</span>
        </div>
        <div ref="dot" class="cursor__dot" />
    </div>
</template>

<style scoped lang="less">
.cursor {
    position: fixed;
    inset: 0;
    z-index: 999;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.3s var(--ease-out-quart);
}

.cursor--on {
    opacity: 1;
}

.cursor__ring,
.cursor__dot {
    position: absolute;
    top: 0;
    left: 0;
    border-radius: 50%;
    will-change: transform;
}

.cursor__ring {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 38px;
    height: 38px;
    border: 1px solid var(--fg);
    // difference переворачивает подложку — кольцо читается и на фото, и на фоне
    mix-blend-mode: difference;
    transition:
        width 0.45s var(--ease-out-expo),
        height 0.45s var(--ease-out-expo),
        background-color 0.45s var(--ease-out-expo),
        border-color 0.45s var(--ease-out-expo);
}

.cursor__dot {
    width: 4px;
    height: 4px;
    background: var(--rubric);
    transition: opacity 0.3s var(--ease-out-quart);
}

// Наведение на интерактивное — кольцо раскрывается, точка гаснет
.cursor--hover .cursor__ring {
    width: 62px;
    height: 62px;
    background: var(--fg);
}

.cursor--hover .cursor__dot {
    opacity: 0;
}

// С подписью кольцо становится рубричной «печатью». Difference здесь
// отключён: инвертированный текст поверх инвертированной подложки читается
// непредсказуемо, а подпись должна быть однозначной.
.cursor--label .cursor__ring {
    width: 94px;
    height: 94px;
    mix-blend-mode: normal;
    background: var(--rubric);
    border-color: var(--rubric);
}

.cursor__label {
    font-family: var(--font-mono);
    font-size: 0.56rem;
    font-weight: 500;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    text-align: center;
    line-height: 1.25;
    color: var(--on-rubric);
    padding: 0 0.5rem;
}
</style>
