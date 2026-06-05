# putty-ai Design System

A complete brand & UI design system for **putty-ai** — a self-hosted AI workspace, dressed
in a clean **monochrome** identity with one warm pop: a soft, wobbly putty mascot.
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
where the only color is the **putty mascot** (a wobbly coral blob with a little smile).

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

The defining look: **a monochrome system — ink → grey → white — on a dark canvas, with a
single coral mascot as the only color.** Calm, modern, and high-contrast.

### Color
See `colors_and_type.css` for the full token set.
- **Surfaces** — ink canvas `--bg #0e0e10`; panels/cards lift *lighter* to `--panel #161719`; inputs/code use `--bg2 #1c1d21`; hover `--panel2 #222327`.
- **Text** — `--fg #e9eaec` (near-white) for body, `--heading #ffffff` for emphasis, `--muted #8a8e96` (grey) for secondary.
- **Interactive accent is near-white** — `--accent #e9eaec` / `--accent2 #ffffff`. Primary buttons are light fills with **ink text** (`--on-accent #0e0e10`); active states use a subtle white tint (`rgba(255,255,255,0.07)`).
- **Borders** — grey `--border #2e3036` (stronger `--border-2 #3a3c42` for inputs). Almost every surface is defined by a 1px grey border rather than a shadow.
- **The one pop** — the **putty mascot** `--brand-putty #e06c75` (highlight `#f7adb2`). Reserve coral for the mark/mascot only; the rest of the UI stays neutral.
- **Status** — kept functional and lightly desaturated: green `#5bbf8f`, gold `#d6a35c`, error `#e0686e`.

The palette is **neutral and cool-leaning** — pure greyscale warmed only by the coral mascot.

### Type
- **Inter** (400/500/600) — the UI face. Compact, 11–16px for chrome, sentence case.
- **Fira Code** (300/400/600) — the mono/brand-voice face. Code, terminals, the slogan (italic), inline `code`. Reach for mono when you want "putty-ai personality."
- Headings: bold (700), tight tracking (`-0.01em`). Eyebrows: bold, UPPERCASE, `0.12em` tracking, in white/near-white.
- Where the old brand used coral gradient text, monochrome uses a **silver→white** clip gradient for emphasis.

### Backgrounds & texture
- **Dot grid.** A 22–24px radial-dot texture in faint white (`rgba(255,255,255,0.04–0.07)`) — subtle.
- **Radial glows.** Large soft *white* radial blooms from corners — ambient, never colored.
- **No** purple/blue SaaS gradients, no glassmorphism for its own sake, no emoji.

### Cards & surfaces
- Card = `--panel #161719` fill + **1px grey border** + `8px` radius. Feature/CTA cards up to `18px`.
- Elevation is mostly **borders, not shadows.** Shadows are reserved for floating things (modals `0 24px 60px /.55`, docked chip `0 6px 22px /.45`). The mascot gets a soft coral glow `drop-shadow(0 5px 16px rgba(224,108,117,0.4))`.

### Buttons
- **Primary:** light fill (`#c9ccd2 → #fff`) with **ink** text, `10px` radius. Hover = slight brightness lift.
- **Secondary:** `--panel` fill, 1px grey border, near-white text. Hover = `translateY(-1px)` + border brightens to white.
- **Icon buttons:** 16px line icons, ghost by default; active state = subtle white tint.
- **Mode toggle** (Agent / Chat): pill segmented control; active segment is a **white fill with ink text**.

### Motion, hover, press
- One signature easing: **`cubic-bezier(.2,.7,.2,1)`**. Durations `.12s` micro, `.25s` hover, `.5s` entrance.
- **Hover:** subtle upward lift + border brightens to white.
- **Press/active:** white fill / white tint (no big squish). The mascot has a gentle wobble (rotate + squash), and a streaming-cursor block blinks. Everything degrades to static under `prefers-reduced-motion`.
- **Focus:** light border / ring, visible for keyboard nav.

### Layout, transparency, radii
- Content max-width ~`1080px`, gutters `22px`, generous section padding.
- Sticky nav uses `backdrop-filter: blur` over a dark translucent fill. Scrims over media keep labels legible.
- Radii: inputs `4px`, default `8px`, buttons/code `10px`, big cards `18px`, pills/toggles `999px`.

---

## 4. ICONOGRAPHY

**putty-ai uses inline line-stroke SVG icons throughout — a Feather / Lucide visual
language.** No icon font, no PNG set.

- **Style:** outline (stroke), `fill="none"`, `stroke="currentColor"`, **`stroke-width` 2** (1.6 for dense glyphs, 2.5 for bold affordances), round caps & joins. 24×24 viewBox, rendered ~12–20px.
- **Color:** icons inherit `currentColor` (near-white). Sidebar icons sit at `opacity:0.5` until hover/active, then go full white.
- **Recommended source:** **[Lucide](https://lucide.dev)** (`https://unpkg.com/lucide@latest`) — a 1:1 match for the set used here (message, search, calendar, beaker/cookbook, layers, mail, brain, sparkles, image, list-checks, palette, settings, send, plus). Flagged as a close substitute; copy exact `<svg>` from the source repo for parity.
- **The brand mark** is the **putty mascot** — a soft amorphous blob with two eyes and a smile:
  `assets/putty-blob.svg` (coral, full face) and `assets/putty-blob-mono.svg` (`currentColor` silhouette for tinting). The favicon is the mascot.
- **Emoji:** not used as UI. Unicode only for tiny glyphs (window controls, stars, `$`/`>` prompts).

---

## 5. Index — what's in this system

```
README.md                  ← you are here (context, voice, visual foundations, iconography)
SKILL.md                   ← Agent Skill manifest (cross-compatible with Claude Code)
colors_and_type.css        ← all design tokens (monochrome color, type, shape, motion) + classes
fonts/                     ← Inter (400/500/600) + Fira Code (300/400/600), self-hosted woff2
assets/
  putty-blob.svg           ← brand mascot (coral, full face)
  putty-blob-mono.svg      ← mascot silhouette (currentColor, for tinting)
preview/                   ← design-system cards shown in the Design System tab
ui_kits/
  putty-app/               ← high-fidelity, interactive recreation of the workspace
    README.md              ← kit contents & usage
    index.html             ← runnable click-through demo (login → chat → send a message)
    *.tsx                  ← TypeScript React components (sidebar, composer, message, etc.)
```

**Start here:** read this file for the rules, open the UI kit's `index.html` to see the
product, and pull tokens from `colors_and_type.css`. Components are **TypeScript (.tsx)** so
they drop straight into a real codebase.

---

## 6. Caveats & substitutions
- **Icons** map to **Lucide** (CDN) — the closest match to the source app's Feather-style SVGs. Lift exact markup from the repo for 1:1 parity.
- The UI kit covers the **Chat** surface in depth; other surfaces (Cookbook, Compare, Deep Research, Calendar, Documents, Gallery) exist as sidebar entries — extend them from the source modules.
- **Monochrome direction:** coral is reserved for the mascot only. If you ever want a colored UI accent, change `--accent` / `--accent2` (and keep `--on-accent` legible).
- Fonts (Inter, Fira Code) are real self-hosted woff2 files — no substitution.
