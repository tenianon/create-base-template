import { onBeforeMount, onBeforeUnmount, ref, watch } from 'vue'

type Theme = 'light' | 'dark' | 'system' | null

const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

const modifyClass = () => {
  if (
    localStorage.theme === 'dark' ||
    (!('theme' in localStorage) &&
      window.matchMedia('(prefers-color-scheme: dark)').matches)
  ) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}

export const useTheme = (immediate = true) => {
  const theme = ref<Theme>(null)

  const modifyTheme = (value: Theme) => {
    theme.value = value
  }

  const modifyThemeFromStorage = () => {
    const storageTheme = localStorage.theme

    if (storageTheme === 'light' || storageTheme === 'dark') {
      theme.value = storageTheme
    } else {
      theme.value = 'system'
    }
  }

  watch(
    () => theme.value,
    (newValue) => {
      if (newValue === 'system') {
        localStorage.removeItem('theme')
      } else if (newValue === 'light' || newValue === 'dark') {
        localStorage.theme = newValue
      }

      modifyClass()
    },
    {
      immediate,
    },
  )

  onBeforeMount(() => {
    modifyThemeFromStorage()

    mediaQuery.addEventListener('change', modifyClass)

    window.addEventListener('storage', modifyThemeFromStorage)
  })

  onBeforeUnmount(() => {
    mediaQuery.removeEventListener('change', modifyClass)

    window.removeEventListener('storage', modifyThemeFromStorage)
  })

  return {
    theme,
    modifyTheme,
  }
}
