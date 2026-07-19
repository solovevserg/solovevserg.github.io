<script setup lang="ts">
/**
 * Пословное проявление текста из-под маски (ADR 0019).
 *
 * Слова, а не строки: разбиение по строкам требует замера после рендера, а
 * значит — скачка при гидратации и пересчёта на каждый ресайз. Пословный
 * стаггер даёт тот же кинематографичный подъём, но остаётся чистой разметкой,
 * которая одинаково работает в SSR и без JS.
 */
const props = withDefaults(
    defineProps<{
        text: string
        tag?: string
        /** Задержка между словами, мс */
        stagger?: number
        /** Задержка перед первым словом, мс */
        delay?: number
    }>(),
    { tag: 'span', stagger: 55, delay: 0 }
)

const words = computed(() => props.text.split(/\s+/).filter(Boolean))
</script>

<template>
    <component
        :is="tag"
        v-reveal
        class="split"
        :style="{ '--split-stagger': `${stagger}ms`, '--split-delay': `${delay}ms` }"
    >
        <span v-for="(word, i) in words" :key="`${i}-${word}`" class="split__mask">
            <span class="split__word" :style="{ '--i': i }">{{ word }}</span>
        </span>
    </component>
</template>
