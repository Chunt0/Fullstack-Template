# putty-ai App — UI Kit

A high-fidelity, **TypeScript + React** recreation of the putty-ai self-hosted AI
workspace, in the **monochrome** brand. It's a click-through prototype, not production
code — cosmetic components you can piece together into mocks, demos, and new screens that
look exactly like the product.

## Two entry points
- **`index.html`** — the runnable chat product (login → chat → live theme switcher).
- **`Components.html`** — the interactive **component library / showcase** (buttons, forms, overlays, table, charts) in every state.

## Run it (chat)
Open `index.html`. It loads React 18 + Babel standalone (with the **TypeScript** preset),
so the `.tsx` files run directly in the browser — no build step. The demo flow:

1. **Login** — the self-hosted "generated admin password" sign-in.
2. **Welcome** — putty mascot + wordmark + `/setup` tip.
3. **Type a message** → a session is created in the sidebar and the assistant *streams* a
   reply (white blinking cursor; the mascot is the one spot of coral).
4. Toggle **Agent / Chat** mode and the **web** / **shell** tool buttons.

## Component library (`.tsx` + `components.css`)
A reusable primitive set, separate from the chat surface. Styles live in `components.css`
(class prefix `pa-`), which is the **single source of truth** — `Components.html` and the
Design System cards both render from it.

| File | Primitives (exported to `window`) |
|---|---|
| `controls.tsx` | `Button`, `Field`, `Input`, `Textarea`, `Select`, `Checkbox`, `Radio`, `Switch`, `Badge`, `Avatar`, `AvatarStack`, `PAIcons`. |
| `overlays.tsx` | `Menu`, `Modal`, `Toast`, `Tooltip`, `Alert`. |
| `data.tsx` | `Tabs`, `Segment`, `Table`, `Pagination`, `EmptyState`, `Skeleton`, `Progress`, `Legend`, `BarChart`, `LineChart`, `Donut`. |
| `showcase.tsx` | The gallery app that mounts them all in `Components.html`. |
| `components.css` | All primitive styles, reading from the design tokens. |

**Contrast rule baked in:** text-bearing coral fills use `--accent-solid` (white text ≈ 4.6:1, AA); icon-only coral fills use the brighter `--accent` (graphics, 3:1). Components read `var(--accent-solid, var(--accent))` so other themes fall back to their own accent.

## Chat surface (`.tsx`)
| File | What it is |
|---|---|
| `icons.tsx` | The Feather/Lucide line-icon set (stroke 2, round caps) + the `Boat`/`Putty` mascot, as small React components. Exposes `window.Icons`, `window.Boat`, `window.Putty`. |
| `Sidebar.tsx` | Left rail: brand header, New Chat, Search, Chats list, Models picker, the full Tools list (Brain, Calendar, Compare, Cookbook, Deep Research, Gallery, Library, Notes, Tasks, Theme), and the user bar. |
| `Composer.tsx` | The chat input bar: auto-growing textarea, in-box model picker, tool toggles, Agent/Chat segmented control, round send button. |
| `Messages.tsx` | `Welcome` screen + `Transcript` (user bubbles, streaming assistant messages with inline `code`). |
| `Login.tsx` | First-run / sign-in card. |
| `App.tsx` | Wires it together with React state — login, sessions, fake streaming. Mounts to `#root`. |
| `kit.css` | All monochrome tokens + component styles (mirrors `colors_and_type.css`). |
| `themes.css` | All 16 built-in themes + `putty` as `[data-theme]` blocks. The topbar switcher toggles `data-theme` on `<html>`; the whole UI re-skins. |

## Notes
- Components share scope via `window.*` (each Babel script is isolated) — the standard
  pattern for this no-bundler setup. In a real codebase you'd `import`/`export` instead; the
  types and structure port over directly.
- The brand mark is the coral **putty mascot** — the single pop of color in an otherwise
  monochrome UI. Change `--accent` / `--accent2` in `kit.css` if you ever want a colored UI accent.
- This kit covers the **Chat** surface in depth. Other surfaces named in the sidebar are nav
  entries only — extend them by reading the matching modules in the source repo
  (`static/js/compare/`, `static/js/cookbook*.js`, `static/js/calendar.js`, etc.).
- Icons: pull any missing glyph from [Lucide](https://lucide.dev) (a 1:1 visual match).
- **Responsive:** below 720px the sidebar becomes an off-canvas drawer — a burger appears in the topbar, the sidebar slides in over a scrim, and selecting anything closes it. Above 720px it's the fixed rail.
- **Light mode:** pick `putty (light)` in the theme switcher for the house brand on a light canvas. Theme switches set `data-theme-switching` on `<html>` for one frame so transitions can't stick mid-fade.
