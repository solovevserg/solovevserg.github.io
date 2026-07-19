<script setup lang="ts">
import IconTelegram from '~/components/icons/IconTelegram.vue'
import IconLinkedin from '~/components/icons/IconLinkedin.vue'
import IconGithub from '~/components/icons/IconGithub.vue'
import IconHabr from '~/components/icons/IconHabr.vue'
import IconHH from '~/components/icons/IconHH.vue'

const { t } = useTypo()

const wires = [
    {
        key: 'telegram',
        url: 'https://t.me/sergsol',
        handle: '@sergsol',
        icon: IconTelegram,
        cursor: 'cursor.write',
    },
    {
        key: 'linkedin',
        url: 'https://www.linkedin.com/in/solovevserg/',
        handle: '/in/solovevserg',
        icon: IconLinkedin,
        cursor: 'cursor.open',
    },
    {
        key: 'github',
        url: 'https://github.com/solovevserg',
        handle: '/solovevserg',
        icon: IconGithub,
        cursor: 'cursor.open',
    },
    {
        key: 'habr',
        url: 'https://habr.com/ru/users/SolovevSerg/articles/',
        handle: '/SolovevSerg',
        icon: IconHabr,
        cursor: 'cursor.read',
    },
    {
        key: 'hh',
        url: 'https://hh.ru/resume/78b19b1dff097442f70039ed1f666643556a49',
        handle: 'hh.ru',
        icon: IconHH,
        cursor: 'cursor.open',
    },
]
</script>

<template>
    <section id="contact" class="section section--ruled contact">
        <div class="container">
            <SectionHeader num="07" :title="t('contact.title')" :kicker="t('contact.kicker')" />

            <SplitText
                :text="t('contact.subtitle')"
                tag="p"
                class="contact__statement"
                :stagger="40"
            />

            <ul class="wires">
                <li v-for="(wire, i) in wires" :key="wire.key">
                    <a
                        v-reveal="{ delay: i * 70 }"
                        data-reveal="up"
                        :href="wire.url"
                        target="_blank"
                        rel="noopener"
                        class="wire"
                        :data-cursor="t(wire.cursor)"
                    >
                        <span class="wire__num">{{ chapterNum(i) }}</span>
                        <component :is="wire.icon" :size="20" class="wire__icon" />
                        <span class="wire__name">{{ t(`contact.${wire.key}`) }}</span>
                        <span class="wire__handle">{{ wire.handle }}</span>
                        <IconArrowUpRight :size="20" class="wire__arrow" />
                    </a>
                </li>
            </ul>
        </div>
    </section>
</template>

<style scoped lang="less">
.contact {
    background: var(--bg-raise);
}

.contact__statement {
    max-width: 16em;
    margin-bottom: 4rem;
    font-size: clamp(1.6rem, 4vw, 3.2rem);
    font-weight: 800;
    line-height: 1.15;
    letter-spacing: -0.035em;
    color: var(--fg);

    @media (max-width: @bp-sm) {
        margin-bottom: 2.5rem;
    }
}

// ─── Строки связи ────────────────────────────────────────────
.wires {
    border-top: 1px solid var(--rule-strong);
}

.wire {
    position: relative;
    display: flex;
    align-items: center;
    gap: 1.5rem;
    padding: 1.6rem 1.5rem;
    border-bottom: 1px solid var(--rule);
    color: var(--fg);
    isolation: isolate;
    // Обязателен: заливка отведена вниз на 101% и без обрезки
    // ложилась бы на соседнюю строку
    overflow: hidden;

    // Рубрика заливает строку снизу вверх
    &::before {
        content: '';
        position: absolute;
        inset: 0;
        z-index: -1;
        background: var(--rubric);
        transform: translateY(101%);
        transition: transform 0.55s var(--ease-out-expo);
    }

    &:hover {
        color: var(--on-rubric);

        &::before {
            transform: translateY(0);
        }

        .wire__num,
        .wire__handle,
        .wire__arrow {
            color: var(--on-rubric);
        }

        .wire__arrow {
            transform: translate(4px, -4px);
        }
    }

    @media (max-width: @bp-sm) {
        gap: 1rem;
        padding: 1.15rem 0.75rem;
    }
}

.wire__num {
    font-family: var(--font-mono);
    font-size: 0.62rem;
    font-weight: 500;
    letter-spacing: 0.1em;
    color: var(--fg-3);
    flex-shrink: 0;
    transition: color 0.4s var(--ease-out-quart);

    @media (max-width: @bp-xs) {
        display: none;
    }
}

.wire__icon {
    flex-shrink: 0;
}

.wire__name {
    font-size: clamp(1.4rem, 3.6vw, 2.6rem);
    font-weight: 900;
    line-height: 1;
    letter-spacing: -0.04em;
    text-transform: uppercase;
}

.wire__handle {
    margin-left: auto;
    font-family: var(--font-mono);
    font-size: 0.68rem;
    letter-spacing: 0.04em;
    color: var(--fg-2);
    transition: color 0.4s var(--ease-out-quart);

    @media (max-width: @bp-sm) {
        display: none;
    }
}

.wire__arrow {
    flex-shrink: 0;
    color: var(--rubric);
    transition:
        transform 0.5s var(--ease-out-expo),
        color 0.4s var(--ease-out-quart);

    @media (max-width: @bp-sm) {
        margin-left: auto;
    }
}
</style>
