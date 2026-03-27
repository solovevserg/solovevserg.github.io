export default defineNuxtConfig({
  devtools: { enabled: true },

  modules: [
    '@nuxt/content',
    '@nuxtjs/i18n',
  ],

  css: ['~/assets/css/global.css'],

  app: {
    head: {
      htmlAttrs: { lang: 'ru' },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { property: 'og:site_name', content: 'Sergei Solovev' },
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
      ],
    },
  },

  i18n: {
    locales: [
      { code: 'ru', language: 'ru-RU', name: 'Русский', file: 'ru.json' },
      { code: 'en', language: 'en-US', name: 'English', file: 'en.json' },
    ],
    defaultLocale: 'en',
    strategy: 'prefix_except_default',
    langDir: 'locales/',
    lazy: true,
  },

  content: {
    highlight: {
      theme: {
        default: 'github-dark',
        light: 'github-light',
      },
      langs: ['typescript', 'javascript', 'html', 'css', 'json', 'bash', 'vue'],
    },
  },

  nitro: {
    prerender: {
      crawlLinks: true,
    },
  },

  compatibilityDate: '2024-11-01',
})
