export const useTheme = () => {
  const isDark = useState<boolean>('isDark', () => true)

  const apply = (dark: boolean) => {
    isDark.value = dark
    if (import.meta.client) {
      document.documentElement.dataset.theme = dark ? 'dark' : 'light'
      localStorage.setItem('theme', dark ? 'dark' : 'light')
    }
  }

  const toggle = () => apply(!isDark.value)

  const init = () => {
    if (!import.meta.client) return
    const saved = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const dark = saved === 'light' ? false : saved === 'dark' ? true : prefersDark
    apply(dark)
  }

  return { isDark, toggle, init }
}
