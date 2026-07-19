<script setup lang="ts">
/**
 * Шапка внутренней страницы: та же рубрикация, что и у глав лендинга.
 */
withDefaults(defineProps<{ title: string; kicker?: string }>(), { kicker: '' })
</script>

<template>
    <header class="page-head">
        <div class="page-head__meta">
            <span v-reveal data-reveal="rule" class="page-head__rule" />
            <span v-if="kicker" v-reveal data-reveal="up" class="page-head__kicker mono-label">
                {{ kicker }}
            </span>
        </div>

        <SplitText :text="title" tag="h1" class="page-head__title display" :stagger="60" />
    </header>
</template>

<style scoped lang="less">
.page-head {
    padding-bottom: 2.5rem;
    margin-bottom: 3.5rem;
    border-bottom: 1px solid var(--rule);
}

.page-head__meta {
    display: flex;
    align-items: center;
    gap: 1.25rem;
    margin-bottom: 1.25rem;
}

.page-head__rule {
    width: 3rem;
    height: 1px;
    background: var(--rubric);
    flex-shrink: 0;
}

.page-head__title {
    font-size: clamp(2.4rem, 6vw, 4.5rem);
    color: var(--fg);
}
</style>
