<script setup lang="ts">
type ExpItem = {
    company: string
    logo?: string
    role: string
    period: string
    current: boolean
    side: boolean
    bullets: string[]
}

const { t, tm, rt } = useTypo()

// Карточки не группируются по компании: липкий стек требует, чтобы каждая
// была ниже вьюпорта, а склейка двух периодов Qoollo давала карточку, низ
// которой в закреплённом состоянии уже не показать. Два срока — две карточки.
const items = computed<ExpItem[]>(() =>
    (tm('experience.items') as any[]).map((item) => ({
        company: rt(item.company),
        logo: item.logo ? rt(item.logo) : undefined,
        role: rt(item.role),
        period: rt(item.period),
        current: !!item.current,
        side: !!item.side,
        bullets: (item.bullets as any[]).map((b) => rt(b)),
    }))
)
</script>

<template>
    <section id="experience" class="section section--ruled">
        <div class="container">
            <SectionHeader
                num="02"
                :title="t('experience.title')"
                :kicker="t('experience.kicker')"
            />

            <div class="stack">
                <article
                    v-for="(item, i) in items"
                    :key="`${item.company}-${item.period}`"
                    v-reveal
                    data-reveal="rise"
                    class="stack__card"
                    :style="{ '--i': i }"
                >
                    <div class="card__meta">
                        <span class="mono-period">{{ item.period }}</span>
                        <span v-if="item.side" class="card__tag">
                            {{ t('experience.side_badge') }}
                        </span>
                        <BadgeCurrent v-if="item.current" />
                        <span class="card__index">{{ chapterNum(i) }}</span>
                    </div>

                    <div class="card__head">
                        <IconTBank v-if="item.logo === 'tbank'" :size="34" class="card__logo" />
                        <IconQoollo
                            v-else-if="item.logo === 'qoollo'"
                            :size="34"
                            class="card__logo"
                        />
                        <h3 class="card__company">{{ item.company }}</h3>
                    </div>

                    <p class="card__role">{{ item.role }}</p>

                    <ul class="card__bullets">
                        <li v-for="bullet in item.bullets" :key="bullet">{{ bullet }}</li>
                    </ul>
                </article>
            </div>
        </div>
    </section>
</template>

<style scoped lang="less">
// ─── Липкий стек ─────────────────────────────────────────────
// Каждая следующая карточка закрепляется на 1.5rem ниже предыдущей и
// наезжает на неё — сверху остаётся видна кромка уже прочитанного.
.stack {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.stack__card {
    position: sticky;
    top: calc(var(--header-h) + 1.5rem + var(--i) * 1.5rem);
    padding: 2.5rem;
    background: var(--bg-raise);
    border: 1px solid var(--rule);
    border-top: 1px solid var(--rubric);
    box-shadow: 0 -20px 60px -30px rgba(0, 0, 0, 0.7);

    @media (max-width: @bp-md) {
        // Ниже @bp-md карточка выше экрана: в закреплённом виде её низ
        // было бы не прочитать — переходим на обычный поток
        position: static;
        padding: 1.75rem 1.5rem;
    }
}

.card__meta {
    display: flex;
    align-items: center;
    gap: 1rem;
    flex-wrap: wrap;
    padding-bottom: 1.25rem;
    border-bottom: 1px solid var(--rule);
    margin-bottom: 1.5rem;
}

.card__tag {
    font-family: var(--font-mono);
    font-size: 0.58rem;
    font-weight: 500;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--fg-2);
    border: 1px solid var(--rule-strong);
    padding: 0.2rem 0.5rem;
    white-space: nowrap;
}

.card__index {
    margin-left: auto;
    font-family: var(--font-mono);
    font-size: 0.62rem;
    color: var(--fg-3);
}

.card__head {
    display: flex;
    align-items: center;
    gap: 0.875rem;
    margin-bottom: 0.4rem;
}

.card__logo {
    flex-shrink: 0;
}

.card__company {
    font-size: clamp(1.6rem, 3.4vw, 2.6rem);
    font-weight: 900;
    line-height: 1;
    letter-spacing: -0.04em;
    text-transform: uppercase;
    color: var(--fg);
}

.card__role {
    margin-bottom: 1.75rem;
    font-family: var(--font-mono);
    font-size: 0.78rem;
    letter-spacing: 0.02em;
    color: var(--rubric);
}

// ─── Пункты ──────────────────────────────────────────────────
// Две колонки удерживают карточку ниже вьюпорта — иначе липкий стек
// обрежет её нижние строки
.card__bullets {
    columns: 2;
    column-gap: 2.5rem;

    @media (max-width: @bp-md) {
        columns: 1;
    }

    li {
        break-inside: avoid;
        position: relative;
        margin-bottom: 0.6rem;
        padding-left: 1.1rem;
        font-size: 0.9rem;
        line-height: 1.55;
        color: var(--fg-2);

        &::before {
            content: '';
            position: absolute;
            left: 0;
            top: 0.62em;
            width: 5px;
            height: 1px;
            background: var(--rubric);
        }
    }
}
</style>
