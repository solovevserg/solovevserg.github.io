<script setup lang="ts">
type FactItem = { emoji: string; title: string; desc: string }
const { t, tm, rt } = useTypo()

const factItems = computed<FactItem[]>(() =>
    (tm('facts.items') as any[]).map((f) => ({
        emoji: rt(f.emoji),
        title: rt(f.title),
        desc: rt(f.desc),
    }))
)
</script>

<template>
    <section id="facts" class="section section--ruled">
        <div class="container">
            <SectionHeader num="06" :title="t('facts.title')" :kicker="t('facts.kicker')" />

            <div class="facts mobile-scroll-list">
                <article
                    v-for="(fact, i) in factItems"
                    :key="fact.title"
                    v-reveal="{ delay: i * 110 }"
                    data-reveal="rise"
                    class="fact mobile-scroll-item"
                >
                    <!-- Крупный знак на фоне — вырезка на полях -->
                    <span class="fact__ghost" aria-hidden="true">{{ fact.emoji }}</span>

                    <div class="fact__top">
                        <span class="fact__num">{{ chapterNum(i) }}</span>
                        <span class="fact__emoji" aria-hidden="true">{{ fact.emoji }}</span>
                    </div>

                    <h3 class="fact__title">{{ fact.title }}</h3>
                    <p class="fact__desc">{{ fact.desc }}</p>
                </article>
            </div>
        </div>
    </section>
</template>

<style scoped lang="less">
.facts {
    @media (min-width: (@bp-sm + 1px)) {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 1.5rem;
    }
}

.fact {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 0.875rem;
    padding: 2rem;
    overflow: hidden;
    background: var(--bg-raise);
    border: 1px solid var(--rule);
    transition:
        border-color 0.5s var(--ease-out-quart),
        transform 0.6s var(--ease-out-expo);

    &:hover {
        border-color: var(--rubric);
        transform: translateY(-4px);

        .fact__ghost {
            transform: rotate(-8deg) scale(1.12);
            opacity: 0.14;
        }
    }
}

// Призрак знака: живёт под текстом, реагирует на наведение
.fact__ghost {
    position: absolute;
    right: -1.5rem;
    bottom: -2.5rem;
    font-size: 9rem;
    line-height: 1;
    opacity: 0.06;
    pointer-events: none;
    filter: grayscale(1);
    transition:
        transform 0.9s var(--ease-out-expo),
        opacity 0.6s var(--ease-out-quart);
}

.fact__top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    padding-bottom: 1.25rem;
    border-bottom: 1px solid var(--rule);
}

.fact__num {
    font-family: var(--font-mono);
    font-size: 0.62rem;
    font-weight: 500;
    letter-spacing: 0.1em;
    color: var(--rubric);
}

.fact__emoji {
    font-size: 1.5rem;
    line-height: 1;
}

.fact__title {
    position: relative;
    font-size: 1.05rem;
    font-weight: 800;
    line-height: 1.25;
    letter-spacing: -0.02em;
    color: var(--fg);
}

.fact__desc {
    position: relative;
    font-size: 0.86rem;
    line-height: 1.65;
    color: var(--fg-2);
    text-wrap: pretty;
}
</style>
