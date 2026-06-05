// The built-in theme set, mirrored from putty-ai-design/themes.ts. Each entry
// drives one `[data-theme="<key>"]` block in styles/tailwind.css. `swatch`
// colors (canvas + accent) are used to preview a theme in the switcher.
//
// To add a theme: add its `[data-theme]` block to tailwind.css, then add one
// row here — the switcher reads this list.

export interface ThemeOption {
  key: string
  label: string
  /** true for light-canvas themes — drives `resolvedTheme` and the `.dark` class */
  light: boolean
  /** preview swatches: app canvas + interactive accent */
  swatch: { bg: string; accent: string }
}

export const THEMES: ThemeOption[] = [
  { key: 'putty', label: 'Putty', light: false, swatch: { bg: '#0e0e10', accent: '#e06c75' } },
  { key: 'putty-light', label: 'Putty Light', light: true, swatch: { bg: '#f5f5f6', accent: '#c2454f' } },
  { key: 'dark', label: 'Original', light: false, swatch: { bg: '#282c34', accent: '#e06c75' } },
  { key: 'light', label: 'Light', light: true, swatch: { bg: '#f0ebe3', accent: '#c47d5a' } },
  { key: 'midnight', label: 'Midnight', light: false, swatch: { bg: '#0d1117', accent: '#f85149' } },
  { key: 'paper', label: 'Paper', light: true, swatch: { bg: '#faf8f5', accent: '#c5ac4a' } },
  { key: 'cyberpunk', label: 'Cyberpunk', light: false, swatch: { bg: '#0a0a0f', accent: '#e040fb' } },
  { key: 'retrowave', label: 'Retrowave', light: false, swatch: { bg: '#1a1a2e', accent: '#e94560' } },
  { key: 'forest', label: 'Forest', light: false, swatch: { bg: '#1b2a1b', accent: '#7cb871' } },
  { key: 'ocean', label: 'Ocean', light: false, swatch: { bg: '#0b1a2c', accent: '#4facfe' } },
  { key: 'ume', label: 'Ume', light: false, swatch: { bg: '#2b1b2e', accent: '#f5a0c0' } },
  { key: 'copper', label: 'Copper', light: false, swatch: { bg: '#1c1410', accent: '#d4764e' } },
  { key: 'terminal', label: 'Terminal', light: false, swatch: { bg: '#000000', accent: '#00ff41' } },
  { key: 'organs', label: 'Organs', light: false, swatch: { bg: '#0a0406', accent: '#c83240' } },
  { key: 'lavender', label: 'Lavender', light: true, swatch: { bg: '#f3eef8', accent: '#9b6dcc' } },
  { key: 'gpt', label: 'GPT', light: false, swatch: { bg: '#212121', accent: '#949494' } },
  { key: 'claude', label: 'Claude', light: false, swatch: { bg: '#262624', accent: '#c6613f' } },
  { key: 'cute', label: 'Cute', light: true, swatch: { bg: '#fff0f5', accent: '#ff6b9d' } },
]

export const THEME_KEYS = THEMES.map((t) => t.key)
export const DEFAULT_THEME = 'putty'

const byKey = new Map(THEMES.map((t) => [t.key, t]))

export function getTheme(key: string): ThemeOption {
  return byKey.get(key) ?? byKey.get(DEFAULT_THEME)!
}
