export default defineNuxtConfig({
  devtools: { enabled: true },

  modules: [
    '@nuxt/content',
    '@nuxtjs/i18n',
  ],

  css: ['~/assets/css/global.css'],

  i18n: {
    locales: [
      { code: 'ru', language: 'ru-RU', name: 'Русский', file: 'ru.json' },
      { code: 'en', language: 'en-US', name: 'English', file: 'en.json' },
    ],
    defaultLocale: 'ru',
    strategy: 'prefix_except_default',
    langDir: 'locales/',
    lazy: true,
  },

  content: {
    // Контент будет лежать в content/ru/ и content/en/
  },

  nitro: {
    // Для GitHub Pages (solovevserg.github.io — root-уровень, без baseURL)
    prerender: {
      crawlLinks: true,
    },
  },

  compatibilityDate: '2024-11-01',
})
