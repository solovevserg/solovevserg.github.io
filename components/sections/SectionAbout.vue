<script setup lang="ts">
type StatItem = { value: string; label: string }
const { t, tm, rt } = useTypo()

const stats = computed<StatItem[]>(() =>
    (tm('stats') as any[]).map((s) => ({ value: rt(s.value), label: rt(s.label) }))
)
</script>

<template>
    <section id="about" class="section section--ruled">
        <div class="container">
            <SectionHeader num="01" :title="t('about.title')" :kicker="t('about.kicker')" />

            <div class="about">
                <!-- Инициал абзаца набран рубрикой — как в манускрипте (ADR 0019) -->
                <p v-reveal data-reveal="up" class="about__bio">{{ t('about.bio') }}</p>

                <dl class="about__meta">
                    <div v-reveal="{ delay: 80 }" data-reveal="up" class="about__row">
                        <dt><IconPin /></dt>
                        <dd>{{ t('about.location') }}</dd>
                    </div>
                    <div v-reveal="{ delay: 140 }" data-reveal="up" class="about__row">
                        <dt><IconMail /></dt>
                        <dd>
                            <a
                                href="https://t.me/sergsol"
                                target="_blank"
                                rel="noopener"
                                class="about__link link-underline"
                                >@sergsol</a
                            >
                        </dd>
                    </div>
                    <div v-reveal="{ delay: 200 }" data-reveal="up" class="about__row">
                        <dt><IconGlobe /></dt>
                        <dd>{{ t('about.languages') }}</dd>
                    </div>
                    <div v-reveal="{ delay: 260 }" data-reveal="up" class="about__row">
                        <dt><IconCap /></dt>
                        <dd>{{ t('about.edu_short') }}</dd>
                    </div>
                </dl>
            </div>

            <!-- Регистр цифр -->
            <dl class="ledger">
                <div
                    v-for="(stat, i) in stats"
                    :key="stat.label"
                    v-reveal="{ delay: i * 90 }"
                    data-reveal="up"
                    class="ledger__cell"
                >
                    <dt class="ledger__value">{{ stat.value }}</dt>
                    <dd class="ledger__label">{{ stat.label }}</dd>
                </div>
            </dl>
        </div>
    </section>
</template>

<style scoped lang="less">
// ─── Заявление + маргиналии ──────────────────────────────────
.about {
    display: grid;
    grid-template-columns: 1fr 17rem;
    gap: 4rem;
    align-items: start;
    margin-bottom: 6rem;

    @media (max-width: @bp-md) {
        grid-template-columns: 1fr;
        gap: 2.5rem;
        margin-bottom: 3.5rem;
    }
}

.about__bio {
    max-width: 22em;
    font-size: clamp(1.2rem, 2.1vw, 1.85rem);
    font-weight: 400;
    line-height: 1.5;
    letter-spacing: -0.015em;
    color: var(--fg);
    text-wrap: pretty;

    // Рубричный инициал
    &::first-letter {
        float: left;
        margin: 0.06em 0.1em 0 0;
        font-size: 3.6em;
        font-weight: 900;
        line-height: 0.78;
        color: var(--rubric);
    }
}

.about__meta {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding-top: 0.6rem;
    border-top: 1px solid var(--rule);

    @media (max-width: @bp-md) {
        padding-top: 1.5rem;
    }
}

.about__row {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;

    dt {
        flex-shrink: 0;
        padding-top: 3px;
        color: var(--rubric);
    }

    dd {
        font-size: 0.82rem;
        line-height: 1.5;
        color: var(--fg-2);
    }
}

.about__link {
    color: var(--fg);
}

// ─── Регистр цифр ────────────────────────────────────────────
.ledger {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    border-top: 1px solid var(--rule-strong);

    @media (max-width: @bp-sm) {
        grid-template-columns: repeat(2, 1fr);
    }
}

.ledger__cell {
    padding: 1.75rem 1.5rem 0 0;
    border-right: 1px solid var(--rule);

    &:last-child {
        border-right: none;
    }

    @media (max-width: @bp-sm) {
        padding: 1.25rem 1rem 1.25rem 0;

        &:nth-child(2n) {
            border-right: none;
        }
        &:nth-child(n + 3) {
            border-top: 1px solid var(--rule);
        }
    }
}

.ledger__value {
    font-size: clamp(2.4rem, 5vw, 4rem);
    font-weight: 900;
    line-height: 0.9;
    letter-spacing: -0.05em;
    color: var(--fg);
}

.ledger__label {
    margin-top: 0.75rem;
    max-width: 15em;
    font-family: var(--font-mono);
    font-size: 0.64rem;
    line-height: 1.6;
    letter-spacing: 0.04em;
    color: var(--fg-2);
}
</style>
