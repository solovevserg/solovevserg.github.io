<script setup lang="ts">
type SkillKey = { name: string; level: 'expert' | 'advanced' | 'intermediate' }
type SkillGroup = { name: string; keys: SkillKey[]; items: string[] }
const { t, tm, rt } = useTypo()

const skillGroups = computed<SkillGroup[]>(() =>
    (tm('skills.groups') as any[]).map((g) => ({
        name: rt(g.name),
        keys: (g.keys as any[]).map((k) => ({
            name: rt(k.name),
            level: rt(k.level) as SkillKey['level'],
        })),
        items: (g.items as any[]).map((i) => rt(i)),
    }))
)
</script>

<template>
    <section id="skills" class="section">
        <div class="container">
            <SectionHeader num="/ 05" :title="t('skills.title')" />
            <div class="skills-grid mobile-scroll-list">
                <div
                    v-for="group in skillGroups"
                    :key="group.name"
                    class="skill-group mobile-scroll-item"
                >
                    <h3 class="skill-group__name label-caps">{{ group.name }}</h3>
                    <div class="skill-keys">
                        <div v-for="key in group.keys" :key="key.name" class="skill-key">
                            <span class="skill-key__name">{{ key.name }}</span>
                            <span
                                class="skill-key__dots"
                                :title="t(`skills.levels.${key.level}`)"
                                aria-hidden="true"
                            >
                                <span
                                    class="skill-key__dot"
                                    :class="{ 'skill-key__dot--filled': true }"
                                />
                                <span
                                    class="skill-key__dot"
                                    :class="{
                                        'skill-key__dot--filled':
                                            key.level === 'advanced' || key.level === 'expert',
                                    }"
                                />
                                <span
                                    class="skill-key__dot"
                                    :class="{ 'skill-key__dot--filled': key.level === 'expert' }"
                                />
                            </span>
                        </div>
                    </div>
                    <div v-if="group.items.length" class="skill-tags">
                        <span v-for="item in group.items" :key="item" class="skill-tag">{{
                            item
                        }}</span>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<style scoped lang="less">
// ─── Skills ───────────────────────────────────────────────────
.skills-grid {
    gap: 1.5rem;

    @media (min-width: (@bp-sm + 1px)) {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
    }

    @media (min-width: (@bp-md + 1px)) {
        grid-template-columns: repeat(3, 1fr);
    }
}

.skill-group {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 1.5rem 1.5rem 1.25rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;

    &__name {
        margin: 0;
    }
}

.skill-keys {
    display: flex;
    flex-direction: column;
    gap: 0.55rem;
}

.skill-key {
    display: flex;
    align-items: center;
    gap: 0.5rem;

    &__name {
        font-size: 0.9375rem;
        font-weight: 600;
        color: var(--text);
        flex: 1;
        min-width: 0;
    }

    &__dots {
        display: flex;
        gap: 3px;
        flex-shrink: 0;
        margin-left: 0.25rem;
    }

    &__dot {
        width: 7px;
        height: 7px;
        border-radius: 50%;
        background: var(--border-md);

        &--filled {
            background: var(--accent);
        }
    }
}

.skill-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
    padding-top: 0.5rem;
    border-top: 1px solid var(--border);
}

.skill-tag {
    font-size: 0.8125rem;
    font-weight: 500;
    color: var(--text-muted);
    background: var(--bg-subtle);
    border-radius: 4px;
    padding: 0.2rem 0.6rem;
    cursor: default;
}
</style>
