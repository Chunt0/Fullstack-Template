import { createContext, type ReactNode, useContext, useEffect, useMemo, useState } from 'react'
import { DEFAULT_THEME, getTheme, THEME_KEYS } from '@/lib/themes'

type Resolved = 'light' | 'dark'

interface ThemeContextValue {
  /** active theme key (e.g. 'putty', 'ocean') */
  theme: string
  /** light/dark classification of the active theme — for theme-aware widgets (sonner) */
  resolvedTheme: Resolved
  setTheme: (key: string) => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)
const STORAGE_KEY = 'app-theme'

function readStored(): string {
  const stored = localStorage.getItem(STORAGE_KEY)
  return stored && THEME_KEYS.includes(stored) ? stored : DEFAULT_THEME
}

/** Set data-theme on <html>, toggle .dark for dark canvases, and flash-guard the swap. */
function applyTheme(key: string): void {
  const el = document.documentElement
  const isLight = getTheme(key).light
  el.dataset.themeSwitching = ''
  el.dataset.theme = key
  el.classList.toggle('dark', !isLight)
  // Clear the no-transition guard on the next frame, once the new tokens have painted.
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      delete el.dataset.themeSwitching
    })
  })
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<string>(readStored)

  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      resolvedTheme: getTheme(theme).light ? 'light' : 'dark',
      setTheme: (key) => {
        localStorage.setItem(STORAGE_KEY, key)
        setThemeState(key)
      },
    }),
    [theme],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}
