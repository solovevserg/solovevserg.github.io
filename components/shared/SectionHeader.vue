<script setup lang="ts">
/**
 * Шапка главы: рубричный номер на поле + крупный заголовок (ADR 0019).
 */
withDefaults(
    defineProps<{
        /** Номер главы, например «03» */
        num: string
        title: string
        /** Надзаголовок мелким моноширинным */
        kicker?: string
        /** Обводной вариант заголовка */
        outline?: boolean
    }>(),
    { kicker: '', outline: false }
)
</script>

<template>
    <header class="chapter">
        <div class="chapter__meta">
            <span class="chapter__num">{{ num }}</span>
            <span v-reveal data-reveal="rule" class="chapter__rule" />
            <span v-if="kicker" v-reveal data-reveal="up" class="chapter__kicker mono-label">
                {{ kicker }}
            </span>
        </div>

        <SplitText
            :text="title"
            tag="h2"
            class="chapter__title display"
            :class="{ 'display--outline': outline }"
            :stagger="60"
        />
    </header>
</template>

<style scoped lang="less">
.chapter {
    margin-bottom: 5rem;

    @media (max-width: @bp-sm) {
        margin-bottom: 2.5rem;
    }
}

.chapter__meta {
    display: flex;
    align-items: center;
    gap: 1.25rem;
    margin-bottom: 1.5rem;

    @media (max-width: @bp-sm) {
        gap: 0.875rem;
        margin-bottom: 1rem;
    }
}

// Рубричный инициал — красный номер главы, как на полях манускрипта
.chapter__num {
    font-family: var(--font-mono);
    font-size: 0.72rem;
    font-weight: 500;
    letter-spacing: 0.1em;
    color: var(--rubric);
    flex-shrink: 0;
}

.chapter__rule {
    height: 1px;
    width: 5rem;
    background: var(--rule-strong);
    flex-shrink: 0;

    @media (max-width: @bp-sm) {
        width: 2.5rem;
    }
}

.chapter__kicker {
    min-width: 0;
}

.chapter__title {
    font-size: clamp(2.6rem, 7vw, 5.5rem);
    color: var(--fg);
}
</style>
