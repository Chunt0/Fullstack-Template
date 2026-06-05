// themes.ts — the full built-in theme set, lifted verbatim from the source app
// (pewdiepie-archdaemon/odysseus → static/js/theme.js, `export const THEMES`).
//
// Each theme is defined by FIVE base colors — bg, fg, panel, border, accent
// (the source calls the accent `red`) — exactly as the product stores them.
// Optional `advanced` overrides specific component colors (only `gpt` uses them).
// `meta` carries the source app's default background pattern / effect settings.
//
// To apply a theme, set `data-theme="<key>"` on a container and load `themes.css`
// (which contains the fully-derived token set per theme), or call applyTheme().

export type ThemeBase = {
  /** Canvas background */
  bg: string;
  /** Primary text / foreground */
  fg: string;
  /** Cards, sidebar, raised panels */
  panel: string;
  /** Hairline borders */
  border: string;
  /** Brand / interactive accent (source app field name: `red`) */
  accent: string;
};

export type ThemeAdvanced = Partial<{
  sendBtnBg: string;
  sendBtnHover: string;
  userBubbleBg: string;
  aiBubbleBg: string;
  inputBg: string;
}>;

export type ThemeMeta = Partial<{
  /** Background pattern the source app pairs with this theme */
  pattern:
    | 'none' | 'dots' | 'rain' | 'synapse' | 'embers'
    | 'petals' | 'constellations' | 'perlin-flow' | 'sparkles';
  /** Override color for the animated background effect */
  effectColor: string;
  /** Effect intensity 0..1 */
  intensity: number;
  /** Frosted-glass panels on by default */
  frosted: boolean;
}>;

export type Theme = {
  key: string;
  label: string;
  /** true for light-canvas themes (useful for choosing contrast) */
  light: boolean;
  colors: ThemeBase;
  advanced?: ThemeAdvanced;
  meta?: ThemeMeta;
};

// Order mirrors the source app's swatch grid. "dark" is the original default.
export const THEMES: Record<string, Theme> = {
  putty:       { key: 'putty',       label: 'putty (mono)',  light: false, colors: { bg: '#0e0e10', fg: '#eaeaec', panel: '#1b1c1f', border: '#313338', accent: '#e06c75' }, meta: { pattern: 'dots' } },
  'putty-light': { key: 'putty-light', label: 'putty (light)', light: true, colors: { bg: '#f5f5f6', fg: '#1b1c1f', panel: '#ffffff', border: '#e3e3e6', accent: '#c2454f' }, meta: { pattern: 'dots' } },
  dark:      { key: 'dark',      label: 'Original',  light: false, colors: { bg: '#282c34', fg: '#9cdef2', panel: '#111111', border: '#355a66', accent: '#e06c75' }, meta: { pattern: 'none' } },
  light:     { key: 'light',     label: 'Light',     light: true,  colors: { bg: '#f0ebe3', fg: '#5a5248', panel: '#faf6f0', border: '#d4cdc2', accent: '#c47d5a' }, meta: { pattern: 'dots' } },
  midnight:  { key: 'midnight',  label: 'Midnight',  light: false, colors: { bg: '#0d1117', fg: '#c9d1d9', panel: '#161b22', border: '#30363d', accent: '#f85149' }, meta: { pattern: 'rain', effectColor: '#ffffff', intensity: 0.5 } },
  paper:     { key: 'paper',     label: 'Paper',     light: true,  colors: { bg: '#faf8f5', fg: '#3b3836', panel: '#ffffff', border: '#d5d0c8', accent: '#c5ac4a' }, meta: { pattern: 'dots' } },
  cyberpunk: { key: 'cyberpunk', label: 'Cyberpunk', light: false, colors: { bg: '#0a0a0f', fg: '#0ff0fc', panel: '#12101a', border: '#9b30ff', accent: '#e040fb' }, meta: { pattern: 'synapse' } },
  retrowave: { key: 'retrowave', label: 'Retrowave', light: false, colors: { bg: '#1a1a2e', fg: '#e94560', panel: '#16213e', border: '#533483', accent: '#e94560' }, meta: { pattern: 'embers' } },
  forest:    { key: 'forest',    label: 'Forest',    light: false, colors: { bg: '#1b2a1b', fg: '#a8d5a2', panel: '#142414', border: '#3d6b3d', accent: '#7cb871' }, meta: { pattern: 'petals' } },
  ocean:     { key: 'ocean',     label: 'Ocean',     light: false, colors: { bg: '#0b1a2c', fg: '#64d2ff', panel: '#091422', border: '#1e5074', accent: '#4facfe' }, meta: { pattern: 'constellations' } },
  ume:       { key: 'ume',       label: 'Ume',       light: false, colors: { bg: '#2b1b2e', fg: '#f5c2e7', panel: '#1e1420', border: '#6c4675', accent: '#f5a0c0' }, meta: { pattern: 'petals', effectColor: '#f5a0c0' } },
  copper:    { key: 'copper',    label: 'Copper',    light: false, colors: { bg: '#1c1410', fg: '#e8c39e', panel: '#140f0a', border: '#7a5533', accent: '#d4764e' } },
  terminal:  { key: 'terminal',  label: 'Terminal',  light: false, colors: { bg: '#000000', fg: '#00ff41', panel: '#0a0a0a', border: '#003b00', accent: '#00ff41' }, meta: { pattern: 'perlin-flow', intensity: 0.8 } },
  organs:    { key: 'organs',    label: 'Organs',    light: false, colors: { bg: '#0a0406', fg: '#efe1c8', panel: '#15080a', border: '#3a1519', accent: '#c83240' }, meta: { pattern: 'rain', effectColor: '#451616', intensity: 0.65 } },
  lavender:  { key: 'lavender',  label: 'Lavender',  light: true,  colors: { bg: '#f3eef8', fg: '#3d3551', panel: '#faf7ff', border: '#cec3de', accent: '#9b6dcc' }, meta: { frosted: true } },
  gpt:       { key: 'gpt',       label: 'GPT',       light: false, colors: { bg: '#212121', fg: '#ececec', panel: '#171717', border: '#424242', accent: '#949494' }, advanced: { sendBtnBg: '#949494', sendBtnHover: '#7f7f7f', userBubbleBg: '#2f2f2f', aiBubbleBg: '#171717', inputBg: '#2f2f2f' } },
  claude:    { key: 'claude',    label: 'Claude',    light: false, colors: { bg: '#262624', fg: '#f5f4f0', panel: '#30302e', border: '#4a4a47', accent: '#c6613f' } },
  cute:      { key: 'cute',      label: 'Cute',      light: true,  colors: { bg: '#fff0f5', fg: '#d4608a', panel: '#fff8fa', border: '#f0c0d0', accent: '#ff6b9d' }, meta: { pattern: 'sparkles', effectColor: '#ff8cb8' } },
};

export const THEME_KEYS = Object.keys(THEMES);
export const DEFAULT_THEME = 'putty';

/**
 * Apply a theme by toggling `data-theme` on the given element (defaults to
 * <html>). Requires `themes.css` to be loaded. Returns the resolved Theme.
 */
export function applyTheme(key: string, el: HTMLElement = document.documentElement): Theme {
  const theme = THEMES[key] || THEMES[DEFAULT_THEME];
  el.dataset.theme = theme.key;
  return theme;
}
