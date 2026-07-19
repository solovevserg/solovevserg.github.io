<script setup lang="ts">
const { t } = useI18n()
</script>

<template>
    <span class="badge">
        <span class="badge__dot" aria-hidden="true" />
        {{ t('common.current') }}
    </span>
</template>

<style scoped lang="less">
.badge {
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
    flex-shrink: 0;
    font-family: var(--font-mono);
    font-size: 0.6rem;
    font-weight: 500;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--live);
    white-space: nowrap;
}

.badge__dot {
    position: relative;
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: var(--live);
    flex-shrink: 0;

    // Пульс «в эфире»
    &::after {
        content: '';
        position: absolute;
        inset: 0;
        border-radius: 50%;
        background: var(--live);
        animation: badge-pulse 2.4s var(--ease-out-quart) infinite;
    }
}

@keyframes badge-pulse {
    0% {
        transform: scale(1);
        opacity: 0.7;
    }
    70%,
    100% {
        transform: scale(3.4);
        opacity: 0;
    }
}
</style>
