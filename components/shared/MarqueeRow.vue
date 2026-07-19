<script setup lang="ts">
/**
 * Бегущая строка (ADR 0019).
 *
 * Лента дублируется дважды: пока первая копия уезжает на свою ширину,
 * вторая занимает её место — шов не виден, JS не нужен.
 */
withDefaults(
    defineProps<{
        items: string[]
        /** Полный оборот ленты, с */
        duration?: number
        reverse?: boolean
    }>(),
    { duration: 42, reverse: false }
)
</script>

<template>
    <div
        class="marquee"
        :class="{ 'marquee--reverse': reverse }"
        :style="{ '--marquee-duration': `${duration}s` }"
    >
        <div v-for="copy in 2" :key="copy" class="marquee__track" :aria-hidden="copy === 2">
            <template v-for="(item, i) in items" :key="`${copy}-${i}`">
                <span class="marquee__item">{{ item }}</span>
                <span class="marquee__sep" aria-hidden="true">✦</span>
            </template>
        </div>
    </div>
</template>

<style scoped lang="less">
.marquee__item {
    white-space: nowrap;
    flex-shrink: 0;
}

.marquee__sep {
    flex-shrink: 0;
    font-size: 0.5em;
    color: var(--rubric);
    transform: translateY(-0.1em);
}
</style>
