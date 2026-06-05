# putty-ai App — UI Kit

A high-fidelity, **TypeScript + React** recreation of the putty-ai self-hosted AI
workspace, in the **monochrome** brand. It's a click-through prototype, not production
code — cosmetic components you can piece together into mocks, demos, and new screens that
look exactly like the product.

## Run it
Open `index.html`. It loads React 18 + Babel standalone (with the **TypeScript** preset),
so the `.tsx` files run directly in the browser — no build step. The demo flow:

1. **Login** — the self-hosted "generated admin password" sign-in.
2. **Welcome** — putty mascot + wordmark + `/setup` tip.
3. **Type a message** → a session is created in the sidebar and the assistant *streams* a
   reply (white blinking cursor; the mascot is the one spot of coral).
4. Toggle **Agent / Chat** mode and the **web** / **shell** tool buttons.

## Components (`.tsx`)
| File | What it is |
|---|---|
| `icons.tsx` | The Feather/Lucide line-icon set (stroke 2, round caps) + the `Boat`/`Putty` mascot, as small React components. Exposes `window.Icons`, `window.Boat`, `window.Putty`. |
| `Sidebar.tsx` | Left rail: brand header, New Chat, Search, Chats list, Models picker, the full Tools list (Brain, Calendar, Compare, Cookbook, Deep Research, Gallery, Library, Notes, Tasks, Theme), and the user bar. |
| `Composer.tsx` | The chat input bar: auto-growing textarea, in-box model picker, tool toggles, Agent/Chat segmented control, round send button. |
| `Messages.tsx` | `Welcome` screen + `Transcript` (user bubbles, streaming assistant messages with inline `code`). |
| `Login.tsx` | First-run / sign-in card. |
| `App.tsx` | Wires it together with React state — login, sessions, fake streaming. Mounts to `#root`. |
| `kit.css` | All monochrome tokens + component styles (mirrors `colors_and_type.css`). |

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
