<script setup lang="ts">
const { t } = useTypo()
</script>

<template>
    <section id="contact" class="contact">
        <div class="container">
            <SectionHeader num="/ 07" :title="t('contact.title')" />
            <h2 class="contact__heading">{{ t('contact.subtitle') }}</h2>
            <div class="contact__links">
                <a href="https://t.me/sergsol" target="_blank" rel="noopener" class="contact-link">
                    <IconTelegram />
                    {{ t('contact.telegram') }}
                </a>
                <a
                    href="https://www.linkedin.com/in/solovevserg/"
                    target="_blank"
                    rel="noopener"
                    class="contact-link"
                >
                    <IconLinkedin />
                    {{ t('contact.linkedin') }}
                </a>
                <a
                    href="https://github.com/solovevserg"
                    target="_blank"
                    rel="noopener"
                    class="contact-link"
                >
                    <IconGithub />
                    {{ t('contact.github') }}
                </a>
                <a
                    href="https://habr.com/ru/users/SolovevSerg/articles/"
                    target="_blank"
                    rel="noopener"
                    class="contact-link"
                >
                    <IconHabr :size="28" />
                    {{ t('contact.habr') }}
                </a>
                <a
                    href="https://hh.ru/resume/78b19b1dff097442f70039ed1f666643556a49"
                    target="_blank"
                    rel="noopener"
                    class="contact-link"
                >
                    <IconHH :size="20" />
                    {{ t('contact.hh') }}
                </a>
            </div>
        </div>
    </section>
</template>

<style scoped lang="less">
// ─── Contact ──────────────────────────────────────────────────
.contact {
    background: var(--bg-card);
    border-top: 1px solid var(--border);
    padding: 7rem 0;

    &__heading {
        font-size: clamp(1.8rem, 4vw, 2.8rem);
        font-weight: 800;
        letter-spacing: -0.03em;
        max-width: 820px;
        margin-bottom: 2.5rem;
        line-height: 1.2;
        color: var(--text-muted);
    }

    &__links {
        display: flex;
        gap: 1rem;
        flex-wrap: wrap;
    }
}

.contact-link {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    padding: 0.75rem 1.25rem;
    border: 1px solid var(--border);
    border-radius: var(--radius);
    font-size: 0.9rem;
    font-weight: 500;
    color: var(--text-muted);
    background: var(--bg);
    transition:
        border-color 0.2s,
        color 0.2s,
        background 0.2s;

    &:hover {
        border-color: var(--accent);
        color: var(--accent);
        background: var(--accent-dim);
    }
}
</style>
