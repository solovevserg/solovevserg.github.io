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
type ExpPhase = { role: string; period: string; current: boolean; bullets: string[] }
type ExpGroup = { company: string; logo?: string; current: boolean; phases: ExpPhase[] }

const { t, tm, rt } = useTypo()

const allExpItems = computed<ExpItem[]>(() =>
    (tm('experience.items') as any[]).map((item) => ({
        company: rt(item.company),
        logo: item.logo ? rt(item.logo) : undefined,
        role: rt(item.role),
        period: rt(item.period),
        current: item.current as boolean,
        side: !!item.side,
        bullets: (item.bullets as any[]).map((b) => rt(b)),
    }))
)

const expGroups = computed<ExpGroup[]>(() => {
    const groups: ExpGroup[] = []
    for (const item of allExpItems.value.filter((i) => !i.side)) {
        const existing = groups.find((g) => g.company === item.company)
        if (existing) {
            existing.phases.push({
                role: item.role,
                period: item.period,
                current: item.current,
                bullets: item.bullets,
            })
            if (item.current) existing.current = true
            if (!existing.logo && item.logo) existing.logo = item.logo
        } else {
            groups.push({
                company: item.company,
                logo: item.logo,
                current: item.current,
                phases: [
                    {
                        role: item.role,
                        period: item.period,
                        current: item.current,
                        bullets: item.bullets,
                    },
                ],
            })
        }
    }
    return groups
})

const sideItems = computed(() => allExpItems.value.filter((i) => i.side))
</script>

<template>
    <section id="experience" class="section section--alt">
        <div class="container">
            <SectionHeader num="/ 02" :title="t('experience.title')" />
            <div class="exp-list">
                <article v-for="group in expGroups" :key="group.company" class="exp-card">
                    <div class="exp-card__header">
                        <IconTBank
                            v-if="group.logo === 'tbank'"
                            :size="36"
                            class="exp-card__logo"
                        />
                        <IconQoollo
                            v-else-if="group.logo === 'qoollo'"
                            :size="36"
                            class="exp-card__logo"
                        />
                        <h3 class="exp-card__company">{{ group.company }}</h3>
                        <BadgeCurrent v-if="group.current" />
                    </div>
                    <div
                        v-for="(phase, i) in group.phases"
                        :key="phase.period"
                        class="exp-card__phase"
                        :class="{ 'exp-card__phase--divider': i > 0 }"
                    >
                        <div class="exp-card__body">
                            <div class="exp-card__left">
                                <span class="mono-period">{{ phase.period }}</span>
                                <p class="exp-card__role">{{ phase.role }}</p>
                            </div>
                            <ul class="exp-card__bullets">
                                <li v-for="bullet in phase.bullets" :key="bullet">{{ bullet }}</li>
                            </ul>
                        </div>
                    </div>
                </article>
            </div>

            <!-- Side projects -->
            <div class="side-block">
                <p class="side-block__label">{{ t('experience.side_title') }}</p>
                <p class="side-block__sub">{{ t('experience.side_subtitle') }}</p>
                <div class="side-list mobile-scroll-list">
                    <article
                        v-for="item in sideItems"
                        :key="item.company"
                        class="side-card card-hover mobile-scroll-item"
                    >
                        <div class="side-card__meta">
                            <span class="mono-period">{{ item.period }}</span>
                            <BadgeCurrent v-if="item.current" />
                        </div>
                        <h4 class="side-card__company">{{ item.company }}</h4>
                        <p class="side-card__role">{{ item.role }}</p>
                        <ul class="side-card__bullets">
                            <li v-for="bullet in item.bullets" :key="bullet">{{ bullet }}</li>
                        </ul>
                    </article>
                </div>
            </div>
        </div>
    </section>
</template>

<style scoped lang="less">
// ─── Experience ───────────────────────────────────────────────
.exp-list {
    display: flex;
    flex-direction: column;
    gap: 0;
}

.exp-card {
    padding: 3rem 0;
    border-bottom: 1px solid var(--border);
    transition: none;

    &:first-child {
        border-top: 1px solid var(--border);
    }
    &:last-child {
        border-bottom: none;
    }

    &__header {
        display: flex;
        align-items: center;
        gap: 1rem;
        margin-bottom: 2rem;
    }

    &__logo {
        flex-shrink: 0;
        border-radius: 6px;
    }

    &__company {
        font-size: clamp(1.4rem, 2.5vw, 1.75rem);
        font-weight: 800;
        color: var(--text);
        letter-spacing: -0.03em;
        line-height: 1.1;
    }

    &__phase {
        &--divider {
            margin-top: 2rem;
            padding-top: 2rem;
        }
    }

    &__body {
        display: grid;
        grid-template-columns: 260px 1fr;
        gap: 2rem;
        align-items: start;
    }

    &__left {
        position: sticky;
        top: calc(var(--header-h) + 1.5rem);
        display: flex;
        flex-direction: column;
        gap: 0.4rem;
    }

    &__role {
        font-size: 0.9375rem;
        color: var(--accent);
        line-height: 1.4;
    }

    &__bullets {
        list-style: none;
        display: flex;
        flex-direction: column;
        gap: 0.75rem;

        li {
            font-size: 1rem;
            color: var(--text-muted);
            padding-left: 1.25rem;
            position: relative;
            line-height: 1.55;

            &::before {
                content: '→';
                position: absolute;
                left: 0;
                color: var(--accent);
                font-size: 0.75rem;
                top: 0.18em;
            }
        }
    }

    @media (max-width: @bp-sm) {
        padding: 2rem 0;

        &__header {
            margin-bottom: 1.5rem;
        }

        &__body {
            grid-template-columns: 1fr;
            gap: 0.75rem;
        }

        &__left {
            position: static;
        }

        &__phase--divider {
            margin-top: 1.5rem;
            padding-top: 1.5rem;
        }
    }
}

// ─── Side projects ────────────────────────────────────────────
.side-block {
    margin-top: 3.5rem;
    padding-top: 3rem;
    border-top: 1px dashed var(--border-md);

    &__label {
        font-family: var(--font-mono);
        font-size: 0.7rem;
        font-weight: 600;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        color: var(--text-muted);
        margin-bottom: 0.3rem;
    }

    &__sub {
        font-size: 0.875rem;
        color: var(--text-muted);
        margin-bottom: 1.75rem;
    }
}

.side-list {
    gap: 1rem;

    @media (min-width: (@bp-sm + 1px)) {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
    }
}

.side-card {
    padding: 1.25rem 1.5rem;
    border: 1px solid var(--border);
    border-radius: var(--radius);
    background: var(--bg);

    &__meta {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        margin-bottom: 0.75rem;
    }

    &__company {
        font-size: 1rem;
        font-weight: 700;
        letter-spacing: -0.02em;
        margin-bottom: 0.2rem;
    }

    &__role {
        font-size: 0.875rem;
        color: var(--accent);
        margin-bottom: 0.875rem;
    }

    &__bullets {
        list-style: none;
        display: flex;
        flex-direction: column;
        gap: 0.4rem;

        li {
            font-size: 0.9rem;
            color: var(--text-muted);
            padding-left: 1rem;
            position: relative;
            line-height: 1.45;

            &::before {
                content: '→';
                position: absolute;
                left: 0;
                color: var(--text-xmuted);
                font-size: 0.7rem;
                top: 0.2em;
            }
        }
    }
}
</style>
