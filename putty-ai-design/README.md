# putty-ai Design System

A complete brand & UI design system for **putty-ai** — a self-hosted AI workspace, dressed
in a near-greyscale identity with one accent hue: the coral putty. Soft, calm, and modern.
Use it to build well-branded interfaces, marketing pages, slides, and prototypes that look
and feel like the product.

```
( ˶ᵔ ᵕ ᵔ˶ )   putty-ai
```

---

## 1. What putty-ai is

putty-ai is a **self-hosted AI workspace** — a private, local-first interface for talking to
language models. It runs on your own hardware against your own endpoints: chat, autonomous
agents, tools, local model serving, deep research, email triage, notes, calendar, and more.
Local-first, privacy-first, no telemetry.

The brand personality is **soft, friendly, and quietly confident** — squishy on the outside,
capable on the inside. The visual identity is the opposite of loud: a near-greyscale system
where a single coral hue — shared by the **putty mascot** and the interactive UI — is the only color.

| Surface | What it does |
|---|---|
| **Chat & Agents** | Multi-turn chat with any local/API model; agents that plan, call tools, and run tasks. |
| **Cookbook** | Hardware-aware model recommendations + one-click download & serving. |
| **Deep Research** | Multi-step runs that gather, read, and synthesize sources into a cited report. |
| **Compare** | Send one prompt to many models at once; blind side-by-side scoring. |
| **Documents / Library** | Multi-tab markdown/HTML/CSV editor where *you* write and the AI assists. |
| **Memory / Skills** | Persistent vector memory + self-evolving skills the agent writes and reuses. |
| **Email · Notes · Tasks · Calendar · Gallery** | Inbox triage, quick notes, todos, CalDAV calendar, image tools. |

### Lineage & sources
The interface foundations (layout, components, type, the modular chat front-end) are
distilled and **re-skinned** from a real self-hosted AI-workspace codebase. If you have
access, read it to recreate any screen more faithfully than this kit covers:

- **GitHub:** https://github.com/pewdiepie-archdaemon/odysseus
  - `static/index.html` + `static/style.css` (1.1 MB) — the real app UI & component structure.
  - `static/app.js`, `static/js/*` — modular front-end (chat, compare, cookbook, calendar, document editor…).
  - `docs/index.html` — a marketing landing page.

> This design system takes that front-end and turns it into a reusable, **TypeScript**
> template under a new **putty-ai monochrome** brand. Explore the repo above for deeper,
> screen-exact recreations.

---

## 2. CONTENT FUNDAMENTALS — how putty-ai writes

The voice is **casual, warm, first-person, and lightly playful** — never corporate, never
shouty. It matches the soft mascot: approachable and unpretentious.

**Person & address.** First-person singular for the product's own voice ("I'm running
locally on your hardware"), second-person for the reader ("**your** models, **your** data").
Avoid corporate "we."

**Tone.** Friendly and a little self-aware. Confident about privacy and being local-first,
relaxed about everything else. A small joke is welcome; hard-sell is not.

**Casing.** **Sentence case** everywhere — headlines, buttons, nav. The wordmark itself is
**lowercase**: `putty-ai`. The only uppercase is small **eyebrows** with wide letter-spacing.
UI section labels are short nouns: *Brain, Compare, Cookbook, Notes, Tasks, Theme.*

**Punctuation & rhythm.** Em-dashes for asides. Short, plain sentences. Occasional lowercase
parenthetical whisper for a joke. Kaomoji/ASCII only in dev-facing docs, never in product chrome.

**Word choices.** Plain and technical-but-friendly: "self-hosted," "local-first," "bring your
own models," "no telemetry," "MCP-ready."

**Emoji.** **Not used** as UI. Iconography is line-stroke SVG. The mascot covers "personality."

**Microcopy examples:**
- Input placeholder: `Message putty-ai...`
- Slogan: `Soft. Local. Yours.`
- Welcome: `Welcome, <name>` · tip line `Type /setup, then choose Local models or API.`
- Pills: `Self-hosted · Bring your own models · Local-first · MCP-ready · No telemetry`

---

## 3. VISUAL FOUNDATIONS

The defining look: **a near-greyscale system — ink → grey → white — on a dark canvas, with the
coral putty as the single accent** (buttons, links, focus, active state, and the mascot).
Calm, modern, and high-contrast.

### Color
See `colors_and_type.css` for the full token set.
- **Surfaces** — ink canvas `--bg #0e0e10`; panels/cards lift *lighter* to `--panel #1b1c1f` (a widened step so cards separate cleanly); inputs/code use `--bg2 #191a1d`; hover `--panel2 #252629`; raised chrome `--surface-3 #2c2d31`.
- **Text** — `--fg #eaeaec` (near-white) for body, `--heading #ffffff` for emphasis, `--muted #93969c` (pure grey) for secondary.
- **Interactive accent is the coral putty** — `--accent #e06c75` / `--accent2 #ef8088`, with **white text** on fills (`--on-accent #ffffff`) and a coral focus ring (`--focus`). Primary buttons, links, the send button, active nav and toggles are coral; active states use a subtle coral tint (`rgba(224,108,117,0.10)`). This is the one hue in an otherwise pure-grey system.
- **Borders** — grey `--border #313338` (stronger `--border-2 #42444a` for inputs). Almost every surface is defined by a 1px grey border rather than a shadow.
- **The mascot** — the putty blob uses the same coral (`--brand-putty #e06c75`, highlight `#f7adb2`) and gets a soft glow; accent and mark share one hue so the system reads as a single idea.
- **Status** — harmonized to sit at the coral's energy: green `#5cc28d`, gold `#e0a95e`, error `#e0686e` (which rhymes with the coral).

The palette is **neutral and cool-leaning** — pure greyscale warmed only by the coral mascot.

### Type
- **Inter** (400/500/600) — the UI face. Compact, 11–16px for chrome, sentence case.
- **Fira Code** (300/400/600) — the mono/brand-voice face. Code, terminals, the slogan (italic), inline `code`. Reach for mono when you want "putty-ai personality."
- Headings: bold (700), tight tracking (`-0.01em`). Eyebrows: bold, UPPERCASE, `0.12em` tracking, in white/near-white.
- Where the old brand used coral gradient text, emphasis words use a **coral → light-coral** clip gradient.

### Backgrounds & texture
- **Dot grid.** A 22–24px radial-dot texture in faint white (`rgba(255,255,255,0.04–0.07)`) — subtle.
- **Radial glows.** Large soft *white* radial blooms from corners — ambient, never colored.
- **No** purple/blue SaaS gradients, no glassmorphism for its own sake, no emoji.

### Cards & surfaces
- Card = `--panel #1b1c1f` fill + **1px grey border** + `8px` radius. Feature/CTA cards up to `18px`.
- Elevation is mostly **borders, not shadows.** Shadows are reserved for floating things (modals `0 24px 60px /.55`, docked chip `0 6px 22px /.45`). The mascot gets a soft coral glow `drop-shadow(0 5px 16px rgba(224,108,117,0.4))`.

### Buttons
- **Primary:** coral fill (`--accent → --accent2`) with **white** text, `10px` radius, soft coral shadow. Hover = slight brightness lift.
- **Secondary:** `--panel` fill, 1px grey border, near-white text. Hover = `translateY(-1px)` + border brightens.
- **Icon buttons:** 16px line icons, ghost by default; active state = coral tint.
- **Mode toggle** (Agent / Chat): pill segmented control; active segment is a **coral fill with white text**.

### Motion, hover, press
- One signature easing: **`cubic-bezier(.2,.7,.2,1)`**. Durations `.12s` micro, `.25s` hover, `.5s` entrance.
- **Hover:** subtle upward lift + border brightens to coral.
- **Press/active:** coral fill / coral tint (no big squish). The mascot has a gentle wobble (rotate + squash), and a streaming-cursor block blinks. Everything degrades to static under `prefers-reduced-motion`.
- **Focus:** coral ring (`box-shadow: 0 0 0 3px var(--focus)`), visible for keyboard nav (`:focus-visible`).

### Color contrast (accessibility)
The coral is mid-toned, so contrast is handled deliberately:
- **Text-bearing coral fills** (primary button label, active toggle text) use **`--accent-solid #c2454f`** with white text — **≈ 4.6:1, passes WCAG AA** for normal text.
- **Icon-only coral fills** (round send button) may use the brighter **`--accent #e06c75`** with a white glyph — icons are graphics, which only need **3:1** (white-on-coral ≈ 3.2:1 ✓).
- **Coral as text/links/icons on the dark canvas** uses `--accent` directly (coral-on-ink ≈ 5.9:1 ✓).
- Components read `var(--accent-solid, var(--accent))`, so non-default themes that don't define a solid variant fall back to their own accent.

### Layout, transparency, radii
- Content max-width ~`1080px`, gutters `22px`, generous section padding.
- Sticky nav uses `backdrop-filter: blur` over a dark translucent fill. Scrims over media keep labels legible.
- Radii: inputs `4px`, default `8px`, buttons/code `10px`, big cards `18px`, pills/toggles `999px`.

### Type ramp
Use the bundled **type-role classes** in `colors_and_type.css` (size + line-height + tracking + weight per step) instead of raw `--text-*`, so spacing stays consistent: `.od-type-display` (52) · `.od-type-title` (40) · `.od-type-h1` (32) · `.od-type-h2` (28) · `.od-type-h3` (24) · `.od-type-subhead` (19) · `.od-type-lead` (16) · `.od-type-body` (14) · `.od-type-small` (13) · `.od-type-caption` (11). The raw scale is gap-free (`--text-xs` 11 → `--text-5xl` 52).

### Data visualization
A categorical **chart palette** is defined for plotting on the ink canvas: `--chart-1` coral · `--chart-2` green · `--chart-3` blue · `--chart-4` gold · `--chart-5` violet · `--chart-6` teal, with `--chart-grid` for gridlines and `--chart-axis` (= `--muted`) for labels. Coral always leads (the brand / primary series).

---

## 4. ICONOGRAPHY

**putty-ai uses inline line-stroke SVG icons throughout — a Feather / Lucide visual
language.** No icon font, no PNG set.

- **Style:** outline (stroke), `fill="none"`, `stroke="currentColor"`, **`stroke-width` 2** (1.6 for dense glyphs, 2.5 for bold affordances), round caps & joins. 24×24 viewBox, rendered ~12–20px.
- **Color:** icons inherit `currentColor` (near-white). Sidebar icons sit at `opacity:0.5` until hover/active, then tint to the coral accent.
- **Recommended source:** **[Lucide](https://lucide.dev)** (`https://unpkg.com/lucide@latest`) — a 1:1 match for the set used here (message, search, calendar, beaker/cookbook, layers, mail, brain, sparkles, image, list-checks, palette, settings, send, plus). Flagged as a close substitute; copy exact `<svg>` from the source repo for parity.
- **The brand mark** is the **putty mascot** — a soft amorphous blob with two eyes and a smile:
  `assets/putty-blob.svg` (coral, full face) and `assets/putty-blob-mono.svg` (`currentColor` silhouette for tinting). The favicon is the mascot.
- **Emoji:** not used as UI. Unicode only for tiny glyphs (window controls, stars, `$`/`>` prompts).

---

## 5. Components

A full **component library** lives in the UI kit as TypeScript/React primitives, with a
shared stylesheet (`components.css`) that is the single source of truth — the interactive
showcase **and** the Design System cards both render from it, so they never drift.

Open **`ui_kits/putty-app/Components.html`** for the live, interactive gallery.

| File | Primitives (class prefix `pa-`, exported to `window`) |
|---|---|
| `controls.tsx` | `Button` (primary/secondary/ghost/danger × sm/md/lg, icon, disabled), `Field`, `Input` (+ leading icon, error), `Textarea`, `Select`, `Checkbox`, `Radio`, `Switch`, `Badge` (6 variants), `Avatar` (+ status/ring/stack), and a shared `PAIcons` set. |
| `overlays.tsx` | `Menu` (sections, shortcuts, danger), `Modal` (scrim/blur, header/body/footer), `Toast` (success/error/info), `Tooltip`, `Alert` (info/success/warn/error). |
| `data.tsx` | `Tabs`, `Segment`, `Table` (hover rows, tabular numerals), `Pagination`, `EmptyState`, `Skeleton`, `Progress`, `Legend`, `BarChart`, `LineChart`, `Donut` (SVG, chart palette). |
| `components.css` | Every component's styles, all reading from the design tokens. Re-theme by changing tokens, not these rules. |

Each Design System card (Form fields, Selection, Menu, Modal, Alerts, Toasts, Tabs, Table,
Badges & avatars, Pagination, Chart palette, Type ramp) is a static specimen that links the
same `components.css`.

---

## 6. Themes

The source app ships a built-in **theme system** — the entire UI is re-skinnable. All
**16 built-in themes** are reproduced here verbatim, plus the house brand in **two modes**:
`putty` (mono, dark — the default) and `putty-light` (the same identity on a pure-grey light
canvas, with a deepened coral that holds AA on white).

| File | What it is |
|---|---|
| `themes.ts` | Typed theme data — each theme's 5 base colors (`bg`, `fg`, `panel`, `border`, `accent`) lifted **verbatim** from the source app, with metadata (default background pattern, effect color) and an `applyTheme()` helper. |
| `themes.css` | A generated `[data-theme="<key>"]` stylesheet. The 5 base colors are exact; every secondary token (`bg2`, `muted`, `on-accent`, hovers, borders…) is **derived** to match. Drop it in and set `data-theme` on any container to re-skin the whole UI. |

**Theme keys:** `putty` (mono, default), `putty-light` (light house mode), `dark` ("Original"), `light`, `midnight`, `paper`,
`cyberpunk`, `retrowave`, `forest`, `ocean`, `ume`, `copper`, `terminal`, `organs`,
`lavender`, `gpt`, `claude`, `cute`.

> Switching themes at runtime briefly sets `data-theme-switching` on `<html>` (the kit's
> `App.tsx` does this) so `var()`-based `background`/`color` can't get stuck mid-fade.

```html
<link rel="stylesheet" href="themes.css">
<html data-theme="ocean">   <!-- or: document.documentElement.dataset.theme = 'ocean' -->
```

The UI kit's topbar has a **live theme switcher** that does exactly this — pick any theme
and the whole product re-skins instantly (and the choice persists). See the "Built-in
themes" card in the Design System tab for all swatches.

> Only `gpt` carries `advanced` per-component overrides in the source; all others derive
> cleanly from the 5 base colors. Background **patterns** (rain, petals, synapse…) are
> recorded in `themes.ts` metadata but not reproduced as live canvas effects here.

---

## 7. Index — what's in this system

```
README.md                  ← you are here (context, voice, visual foundations, iconography)
SKILL.md                   ← Agent Skill manifest (cross-compatible with Claude Code)
styles.css                 ← root entry point — @imports tokens + themes (link this one file)
colors_and_type.css        ← all design tokens (color, type ramp, shape, motion, chart palette) + classes
themes.ts                  ← typed data for all 16 built-in themes + putty (mono) + applyTheme()
themes.css                 ← [data-theme] stylesheet — full derived token set per theme
fonts/                     ← Inter (400/500/600) + Fira Code (300/400/600), self-hosted woff2
assets/
  putty-blob.svg           ← brand mascot (coral, full face)
  putty-blob-mono.svg      ← mascot silhouette (currentColor, for tinting)
preview/                   ← design-system cards shown in the Design System tab
ui_kits/
  putty-app/               ← high-fidelity, interactive recreation of the workspace
    README.md              ← kit contents & usage
    index.html             ← runnable chat demo (login → chat → live theme switcher)
    Components.html        ← interactive component gallery (the showcase)
    components.css         ← component primitive styles (single source of truth)
    controls.tsx / overlays.tsx / data.tsx  ← component primitives (TypeScript/React)
    showcase.tsx           ← the gallery app
    kit.css / themes.css   ← chat-app styles + theme stylesheet
    icons.tsx / Sidebar.tsx / Composer.tsx / Messages.tsx / Login.tsx / App.tsx  ← chat surface
```

**Start here:** read this file for the rules, open the UI kit's `Components.html` for the
components and `index.html` for the product, and pull tokens from `colors_and_type.css`.
Everything is **TypeScript (.tsx)** so it drops straight into a real codebase.

---

## 8. Caveats & substitutions
- **Icons** map to **Lucide** (CDN) — the closest match to the source app's Feather-style SVGs. Lift exact markup from the repo for 1:1 parity.
- The UI kit covers the **Chat** surface in depth; other surfaces (Cookbook, Compare, Deep Research, Calendar, Documents, Gallery) exist as sidebar entries — extend them from the source modules.
- **Accent direction:** coral is the single interactive accent on a pure-grey canvas. If you want a different accent, change `--accent` / `--accent2` (and keep `--on-accent` legible on the fill).
- Fonts (Inter, Fira Code) are real self-hosted woff2 files — no substitution.
