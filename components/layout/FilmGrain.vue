<template>
    <div class="film" aria-hidden="true">
        <div class="film__grain" />
        <div class="film__vignette" />
    </div>
</template>

<style scoped lang="less">
// ─── Плёнка: зерно + виньетка (ADR 0019) ─────────────────────
// Фиксированный слой поверх всей страницы. Кликов не ловит,
// содержимое не трогает — только придаёт кадру фактуру.
.film {
    position: fixed;
    inset: 0;
    z-index: 90;
    pointer-events: none;
}

.film__grain {
    position: absolute;
    // Запас по краям: слой ездит на ±5% и не должен обнажать углы
    inset: -150px;
    opacity: var(--grain-opacity);
    mix-blend-mode: var(--grain-blend);
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
    animation: grain-shift 0.7s steps(6) infinite;
    will-change: transform;
}

// Дрожание кадра — восемь позиций, как перфорация киноплёнки
@keyframes grain-shift {
    0% {
        transform: translate3d(0, 0, 0);
    }
    16.6% {
        transform: translate3d(-4%, 3%, 0);
    }
    33.3% {
        transform: translate3d(3%, -4%, 0);
    }
    50% {
        transform: translate3d(-3%, -3%, 0);
    }
    66.6% {
        transform: translate3d(4%, 2%, 0);
    }
    83.3% {
        transform: translate3d(-2%, 4%, 0);
    }
    100% {
        transform: translate3d(0, 0, 0);
    }
}

.film__vignette {
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse 85% 75% at 50% 50%, transparent 40%, var(--vignette) 100%);
}

@media (prefers-reduced-motion: reduce) {
    .film__grain {
        animation: none;
    }
}
</style>
