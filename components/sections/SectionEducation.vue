<script setup lang="ts">
type EduItem = {
    degree: string
    field: string
    school: string
    city: string
    tag: string
    period: string
    current: boolean
    grade?: string
    thesis?: string
}

const { t, tm, rt } = useTypo()

const eduItems = computed<EduItem[]>(() =>
    (tm('education.items') as any[]).map((e) => ({
        degree: rt(e.degree),
        field: rt(e.field),
        school: rt(e.school),
        city: rt(e.city),
        tag: rt(e.tag),
        period: rt(e.period),
        current: !!e.current,
        grade: e.grade ? rt(e.grade) : undefined,
        thesis: e.thesis ? rt(e.thesis) : undefined,
    }))
)

const eduGroups = computed(() => {
    const map = new Map<string, EduItem[]>()
    for (const item of eduItems.value) {
        const list = map.get(item.school) ?? []
        list.push(item)
        map.set(item.school, list)
    }
    return Array.from(map.entries()).map(([school, items]) => ({
        school,
        city: items[0].city,
        items,
    }))
})
</script>

<template>
    <section id="education" class="section section--ruled section--raise">
        <div class="container">
            <SectionHeader num="04" :title="t('education.title')" :kicker="t('education.kicker')" />

            <div class="edu">
                <div v-for="group in eduGroups" :key="group.school" class="edu__group">
                    <div class="edu__side">
                        <h3 class="edu__school">{{ group.school }}</h3>
                        <p class="edu__city">{{ group.city }}</p>
                    </div>

                    <ol class="edu__track">
                        <span v-reveal data-reveal="rule-y" class="edu__line" aria-hidden="true" />

                        <li
                            v-for="(item, i) in group.items"
                            :key="item.degree"
                            v-reveal="{ delay: 150 + i * 120 }"
                            data-reveal="up"
                            class="edu__item"
                        >
                            <div class="edu__meta">
                                <span class="edu__period">{{ item.period }}</span>
                                <BadgeCurrent v-if="item.current" />
                            </div>

                            <div class="edu__head">
                                <span class="edu__tag" aria-hidden="true">{{ item.tag }}</span>
                                <div class="edu__titles">
                                    <h4 class="edu__field">{{ item.field }}</h4>
                                    <p class="edu__degree">
                                        {{ item.degree }}
                                        <span v-if="item.grade" class="edu__grade">
                                            {{ t('education.grade_label') }} {{ item.grade }}/5
                                        </span>
                                    </p>
                                </div>
                            </div>

                            <!-- Тема работы вынесена в текст: в подсказке её никто не читал,
                                 а у этих работ содержание — сильная часть биографии -->
                            <figure v-if="item.thesis" class="edu__thesis">
                                <figcaption class="edu__thesis-label">
                                    {{ t('education.thesis_label') }}
                                </figcaption>
                                <blockquote class="edu__thesis-text">{{ item.thesis }}</blockquote>
                            </figure>
                        </li>
                    </ol>
                </div>
            </div>
        </div>
    </section>
</template>

<style scoped lang="less">
.edu {
    display: flex;
    flex-direction: column;
    gap: 5rem;

    @media (max-width: @bp-sm) {
        gap: 3rem;
    }
}

.edu__group {
    display: grid;
    grid-template-columns: 15rem 1fr;
    gap: 3.5rem;
    align-items: start;

    @media (max-width: @bp-md) {
        grid-template-columns: 1fr;
        gap: 1.5rem;
    }
}

// ─── Учебное заведение ───────────────────────────────────────
.edu__side {
    position: sticky;
    top: calc(var(--header-h) + 2rem);

    @media (max-width: @bp-md) {
        position: static;
        padding-left: 1rem;
        border-left: 2px solid var(--rubric);
    }
}

.edu__school {
    font-size: 1.15rem;
    font-weight: 800;
    line-height: 1.25;
    letter-spacing: -0.02em;
    color: var(--fg);
}

.edu__city {
    margin-top: 0.4rem;
    font-family: var(--font-mono);
    font-size: 0.62rem;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--fg-2);
}

// ─── Хроника ─────────────────────────────────────────────────
.edu__track {
    position: relative;
    padding-left: 2.5rem;

    @media (max-width: @bp-sm) {
        padding-left: 1.5rem;
    }
}

// Линия вычерчивается сверху вниз, когда хроника входит в кадр
.edu__line {
    position: absolute;
    left: 0;
    top: 0.4rem;
    bottom: 0.4rem;
    width: 1px;
    background: var(--rule-strong);
}

.edu__item {
    position: relative;
    padding-bottom: 3rem;

    &:last-child {
        padding-bottom: 0;
    }

    // Отметка на линии
    &::before {
        content: '';
        position: absolute;
        left: calc(-2.5rem - 3px);
        top: 0.45rem;
        width: 7px;
        height: 7px;
        border-radius: 50%;
        background: var(--rubric);

        @media (max-width: @bp-sm) {
            left: calc(-1.5rem - 3px);
        }
    }
}

.edu__meta {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 0.75rem;
}

.edu__period {
    font-family: var(--font-mono);
    font-size: 0.66rem;
    font-weight: 500;
    letter-spacing: 0.1em;
    color: var(--rubric);
}

.edu__head {
    display: flex;
    align-items: flex-start;
    gap: 1.25rem;
}

// Обводная степень — крупная пометка на поле
.edu__tag {
    flex-shrink: 0;
    width: 4.5rem;
    font-family: var(--font-display-outline);
    font-size: 1.6rem;
    font-weight: 900;
    line-height: 1;
    letter-spacing: -0.04em;
    color: transparent;
    -webkit-text-stroke: 1px var(--fg-3);

    @media (max-width: @bp-sm) {
        width: auto;
        font-size: 1.2rem;
    }
}

.edu__titles {
    min-width: 0;
}

.edu__field {
    font-size: clamp(1.05rem, 2vw, 1.5rem);
    font-weight: 700;
    line-height: 1.2;
    letter-spacing: -0.025em;
    color: var(--fg);
}

.edu__degree {
    margin-top: 0.4rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex-wrap: wrap;
    font-family: var(--font-mono);
    font-size: 0.7rem;
    letter-spacing: 0.02em;
    color: var(--fg-2);
}

.edu__grade {
    padding: 0.15rem 0.45rem;
    font-size: 0.58rem;
    font-weight: 500;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--rubric);
    background: var(--rubric-dim);
    white-space: nowrap;
}

// ─── Тема работы ─────────────────────────────────────────────
.edu__thesis {
    margin-top: 1.25rem;
    padding-left: 1rem;
    border-left: 1px solid var(--rubric);

    @media (min-width: (@bp-md + 1px)) {
        margin-left: 5.75rem;
    }
}

.edu__thesis-label {
    font-family: var(--font-mono);
    font-size: 0.56rem;
    font-weight: 500;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: var(--rubric);
    margin-bottom: 0.4rem;
}

.edu__thesis-text {
    max-width: 46em;
    font-size: 0.86rem;
    font-style: italic;
    line-height: 1.6;
    color: var(--fg-2);
    text-wrap: pretty;
}
</style>
