<script setup lang="ts">
import IconElibrary from '~/components/icons/IconElibrary.vue'
import IconHabr from '~/components/icons/IconHabr.vue'
import IconGithub from '~/components/icons/IconGithub.vue'

type TalkItem = { id: string; conf: string; title: string }
type CourseItem = { org: string; badge: string; period: string; items: string[] }

const { t, tm, rt } = useTypo()

const talkItems = computed<TalkItem[]>(() =>
    (tm('teaching.talks') as any[]).map((i) => ({
        id: rt(i.id),
        conf: rt(i.conf),
        title: rt(i.title),
    }))
)

const activeTalkId = ref('')
const currentTalkId = computed(() => activeTalkId.value || talkItems.value[0]?.id || '')

// Фасад вместо iframe: плеер YouTube тянет около мегабайта скриптов на каждый
// заход, хотя большинство читателей до докладов не доскроллит. Грузим кадр,
// а сам плеер — только по клику (и сразу с autoplay, клик уже был).
const playing = ref(false)
const embedUrl = computed(
    () => `https://www.youtube-nocookie.com/embed/${currentTalkId.value}?rel=0&autoplay=1`
)
const thumbUrl = computed(() => `https://i.ytimg.com/vi/${currentTalkId.value}/maxresdefault.jpg`)

const currentTalk = computed(
    () => talkItems.value.find((i) => i.id === currentTalkId.value) ?? talkItems.value[0]
)

const playerRef = ref<HTMLElement>()

function selectTalk(id: string) {
    activeTalkId.value = id
    playing.value = false

    const el = playerRef.value
    if (!el) return
    const headerH =
        parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 0
    if (el.getBoundingClientRect().top < headerH) {
        const top = el.getBoundingClientRect().top + window.scrollY - headerH - 16
        window.scrollTo({ top, behavior: 'smooth' })
    }
}

const publicationLinks = [
    {
        label: 'teaching.elibrary_cta',
        url: 'https://www.elibrary.ru/author_items.asp?authorid=1019717',
        short: 'elibrary.ru',
        icon: IconElibrary,
    },
    {
        label: 'teaching.habr_cta',
        url: 'https://habr.com/ru/users/SolovevSerg/articles/',
        short: 'habr.com',
        icon: IconHabr,
    },
    {
        label: 'teaching.github_cta',
        url: 'https://github.com/solovevserg/studies',
        short: 'github.com',
        icon: IconGithub,
    },
]

const courseItems = computed<CourseItem[]>(() =>
    (tm('teaching.courses') as any[]).map((c) => ({
        org: rt(c.org),
        badge: rt(c.badge),
        period: rt(c.period),
        items: (c.items as any[]).map((i) => rt(i)),
    }))
)

const coursesExpanded = ref(false)
</script>

<template>
    <section id="teaching" class="section section--ruled">
        <div class="container">
            <SectionHeader num="03" :title="t('teaching.title')" :kicker="t('teaching.kicker')" />

            <!-- ─── Доклады ─── -->
            <p v-reveal data-reveal="up" class="sub mono-label">{{ t('teaching.talks_title') }}</p>

            <div class="talks">
                <div class="talks__list">
                    <button
                        v-for="(talk, i) in talkItems"
                        :key="talk.id"
                        v-reveal="{ delay: i * 80 }"
                        data-reveal="left"
                        class="talk"
                        :class="{ 'talk--on': currentTalkId === talk.id }"
                        :aria-pressed="currentTalkId === talk.id"
                        @click="selectTalk(talk.id)"
                    >
                        <span class="talk__num">{{ chapterNum(i) }}</span>
                        <span class="talk__body">
                            <span class="talk__conf">{{ talk.conf }}</span>
                            <span class="talk__title">{{ talk.title }}</span>
                        </span>
                        <span class="talk__bar" aria-hidden="true" />
                    </button>
                </div>

                <div ref="playerRef" v-reveal data-reveal="frame" class="talks__player">
                    <div class="frame">
                        <iframe
                            v-if="playing"
                            :src="embedUrl"
                            :title="currentTalk?.title"
                            frameborder="0"
                            allow="
                                accelerometer;
                                autoplay;
                                clipboard-write;
                                encrypted-media;
                                gyroscope;
                                picture-in-picture;
                            "
                            allowfullscreen
                        />
                        <button
                            v-else
                            class="frame__facade"
                            :data-cursor="t('cursor.play')"
                            @click="playing = true"
                        >
                            <img
                                :src="thumbUrl"
                                :alt="currentTalk?.title"
                                width="1280"
                                height="720"
                                loading="lazy"
                                class="frame__thumb"
                            />
                            <span class="frame__scrim" aria-hidden="true" />
                            <span class="frame__play" aria-hidden="true">
                                <IconPlay :size="18" />
                            </span>
                        </button>
                    </div>
                </div>
            </div>

            <!-- ─── Публикации ─── -->
            <p v-reveal data-reveal="up" class="sub sub--spaced mono-label">
                {{ t('teaching.publications_title') }}
            </p>

            <ul class="pubs">
                <li v-for="(link, i) in publicationLinks" :key="link.url">
                    <a
                        v-reveal="{ delay: i * 70 }"
                        data-reveal="up"
                        :href="link.url"
                        target="_blank"
                        rel="noopener"
                        class="pub"
                        :data-cursor="t('cursor.open')"
                    >
                        <component :is="link.icon" :size="26" class="pub__icon" />
                        <span class="pub__label">{{ t(link.label) }}</span>
                        <span class="pub__url">{{ link.short }}</span>
                        <IconArrowUpRight :size="16" class="pub__arrow" />
                    </a>
                </li>
            </ul>

            <!-- ─── Курсы ─── -->
            <p v-reveal data-reveal="up" class="sub sub--spaced mono-label">
                {{ t('teaching.courses_title') }}
            </p>

            <div class="courses" :class="{ 'courses--open': coursesExpanded }">
                <div class="courses__grid mobile-scroll-list">
                    <article
                        v-for="course in courseItems"
                        :key="course.org"
                        class="course mobile-scroll-item"
                    >
                        <div class="course__head">
                            <h3 class="course__org">{{ course.org }}</h3>
                            <span class="mono-period">{{ course.period }}</span>
                        </div>
                        <ul class="course__list">
                            <li v-for="item in course.items" :key="item">{{ item }}</li>
                        </ul>
                    </article>
                </div>
            </div>

            <div class="courses__toggle">
                <button class="courses__btn" @click="coursesExpanded = !coursesExpanded">
                    {{ coursesExpanded ? t('teaching.courses_hide') : t('teaching.courses_show') }}
                </button>
            </div>
        </div>
    </section>
</template>

<style scoped lang="less">
.sub {
    margin-bottom: 1.5rem;
    color: var(--fg);

    &--spaced {
        margin-top: 5rem;

        @media (max-width: @bp-sm) {
            margin-top: 3rem;
        }
    }
}

// ─── Доклады ─────────────────────────────────────────────────
.talks {
    display: grid;
    grid-template-columns: 1fr 1.5fr;
    gap: 2rem;
    align-items: start;

    @media (max-width: @bp-md) {
        grid-template-columns: 1fr;
    }
}

.talks__list {
    display: flex;
    flex-direction: column;
    border-top: 1px solid var(--rule);
}

.talk {
    position: relative;
    display: flex;
    align-items: baseline;
    gap: 1rem;
    width: 100%;
    padding: 1.25rem 0.5rem 1.25rem 0;
    text-align: left;
    border-bottom: 1px solid var(--rule);
    transition: padding-left 0.5s var(--ease-out-expo);

    &:hover {
        padding-left: 0.75rem;
    }
}

// Рубричная планка слева отмечает активный доклад
.talk__bar {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 2px;
    background: var(--rubric);
    transform: scaleY(0);
    transform-origin: center top;
    transition: transform 0.5s var(--ease-out-expo);
}

.talk--on {
    padding-left: 0.75rem;

    .talk__bar {
        transform: scaleY(1);
    }
    .talk__title {
        color: var(--fg);
    }
    .talk__num {
        color: var(--rubric);
    }
}

.talk__num {
    font-family: var(--font-mono);
    font-size: 0.62rem;
    color: var(--fg-3);
    flex-shrink: 0;
    transition: color 0.4s var(--ease-out-quart);
}

.talk__body {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
    min-width: 0;
}

.talk__conf {
    font-family: var(--font-mono);
    font-size: 0.58rem;
    font-weight: 500;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: var(--rubric);
}

.talk__title {
    font-size: 0.95rem;
    font-weight: 500;
    line-height: 1.4;
    letter-spacing: -0.01em;
    color: var(--fg-2);
    transition: color 0.4s var(--ease-out-quart);
}

// ─── Плеер ───────────────────────────────────────────────────
.talks__player {
    position: sticky;
    top: calc(var(--header-h) + 1.5rem);

    @media (max-width: @bp-md) {
        position: static;
        order: -1;
        margin-bottom: 2rem;
    }
}

.frame {
    position: relative;
    width: 100%;
    aspect-ratio: 16 / 9;
    overflow: hidden;
    background: var(--bg-sunk);
    border: 1px solid var(--rule);

    iframe {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        border: none;
    }
}

.frame__facade {
    position: absolute;
    inset: 0;
    display: block;
    width: 100%;
    padding: 0;

    &:hover {
        .frame__thumb {
            transform: scale(1.04);
        }
        .frame__play {
            background: var(--rubric);
            color: var(--on-rubric);
            border-color: var(--rubric);
        }
    }
}

.frame__thumb {
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: grayscale(1) contrast(1.1) brightness(0.7);
    transition: transform 0.9s var(--ease-out-expo);
}

.frame__scrim {
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, var(--bg-sunk) 2%, transparent 60%);
}

.frame__play {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    align-items: center;
    justify-content: center;
    width: 62px;
    height: 62px;
    padding-left: 3px;
    border-radius: 50%;
    border: 1px solid var(--fg);
    color: var(--fg);
    transition:
        background-color 0.4s var(--ease-out-quart),
        color 0.4s var(--ease-out-quart),
        border-color 0.4s var(--ease-out-quart);
}

// ─── Публикации ──────────────────────────────────────────────
.pubs {
    border-top: 1px solid var(--rule);
}

.pub {
    position: relative;
    display: flex;
    align-items: center;
    gap: 1.25rem;
    padding: 1.35rem 1rem;
    border-bottom: 1px solid var(--rule);
    isolation: isolate;

    // Заливка выезжает слева — строка «штемпелюется» рубрикой
    &::before {
        content: '';
        position: absolute;
        inset: 0;
        z-index: -1;
        background: var(--rubric);
        transform: scaleX(0);
        transform-origin: left center;
        transition: transform 0.6s var(--ease-out-expo);
    }

    &:hover {
        color: var(--on-rubric);

        &::before {
            transform: scaleX(1);
        }

        .pub__icon,
        .pub__url,
        .pub__arrow {
            color: var(--on-rubric);
        }

        .pub__arrow {
            transform: translate(3px, -3px);
        }
    }
}

.pub__icon {
    flex-shrink: 0;
    color: var(--fg-2);
    transition: color 0.4s var(--ease-out-quart);
}

.pub__label {
    font-size: 0.95rem;
    font-weight: 600;
    letter-spacing: -0.01em;
    min-width: 0;
}

.pub__url {
    margin-left: auto;
    font-family: var(--font-mono);
    font-size: 0.62rem;
    color: var(--fg-3);
    transition: color 0.4s var(--ease-out-quart);

    @media (max-width: @bp-xs) {
        display: none;
    }
}

.pub__arrow {
    flex-shrink: 0;
    color: var(--rubric);
    transition:
        transform 0.4s var(--ease-out-expo),
        color 0.4s var(--ease-out-quart);
}

// ─── Курсы ───────────────────────────────────────────────────
.courses {
    position: relative;
    max-height: 9rem;
    overflow: hidden;
    transition: max-height 0.7s var(--ease-out-expo);

    &::after {
        content: '';
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        height: 7rem;
        background: linear-gradient(to bottom, transparent, var(--bg));
        pointer-events: none;
        transition: opacity 0.4s var(--ease-out-quart);
    }

    &--open {
        max-height: 120rem;

        &::after {
            opacity: 0;
        }
    }

    @media (max-width: @bp-sm) {
        max-height: none;
        overflow: visible;

        &::after {
            display: none;
        }
    }
}

// gap задаётся только на десктопе: на мобильном отступы приходят из
// .mobile-scroll-list, а scoped-правило перебило бы их (CLAUDE.md)
.courses__grid {
    @media (min-width: (@bp-sm + 1px)) {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 1px;
        background: var(--rule);
        border: 1px solid var(--rule);
    }
}

.course {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    padding: 1.5rem;
    background: var(--bg);

    @media (max-width: @bp-sm) {
        border: 1px solid var(--rule);
    }
}

.course__head {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 0.75rem;
}

.course__org {
    font-size: 0.92rem;
    font-weight: 700;
    letter-spacing: -0.01em;
    line-height: 1.3;
    color: var(--fg);
}

.course__list li {
    position: relative;
    padding-left: 1rem;
    margin-bottom: 0.4rem;
    font-size: 0.82rem;
    line-height: 1.5;
    color: var(--fg-2);

    &::before {
        content: '';
        position: absolute;
        left: 0;
        top: 0.6em;
        width: 5px;
        height: 1px;
        background: var(--fg-3);
    }
}

.courses__toggle {
    display: flex;
    justify-content: center;
    margin-top: 1.5rem;

    @media (max-width: @bp-sm) {
        display: none;
    }
}

.courses__btn {
    padding: 0.6rem 1.75rem;
    border: 1px solid var(--rule-strong);
    font-family: var(--font-mono);
    font-size: 0.62rem;
    font-weight: 500;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: var(--fg-2);
    transition:
        color 0.4s var(--ease-out-quart),
        border-color 0.4s var(--ease-out-quart);

    &:hover {
        color: var(--rubric);
        border-color: var(--rubric);
    }
}
</style>
