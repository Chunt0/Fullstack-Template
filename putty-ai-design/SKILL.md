---
name: putty-ai-design
description: Use this skill to generate well-branded interfaces and assets for putty-ai (a self-hosted AI workspace with a monochrome identity), either for production or throwaway prototypes/mocks/etc. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping.
user-invocable: true
---

Read the README.md file within this skill, and explore the other available files.

If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets out and create static HTML files for the user to view. If working on production code, you can copy assets and read the rules here to become an expert in designing with this brand.

If the user invokes this skill without any other guidance, ask them what they want to build or design, ask some questions, and act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.

## Quick orientation
- **Brand:** putty-ai — a self-hosted AI workspace (private, local-first). Soft, friendly, quietly confident personality. Wordmark is lowercase: `putty-ai`. Slogan: "Soft. Local. Yours."
- **Look:** a **near-greyscale** system — ink canvas `#0e0e10`, panels lift lighter `#1b1c1f`, near-white text `#eaeaec` / white `#ffffff` headings, grey borders `#313338`. The interactive accent is the **coral putty `#e06c75`** (white text on fills) — primary buttons, links, focus, active nav/toggles, and the mascot. One hue, shared by UI and mark.
- **Type:** Inter (UI), Fira Code (mono / brand voice). Sentence case. Faint white dot-grid + soft white radial glows. Feather/Lucide line icons. Borders over shadows.
- **Tokens:** `colors_and_type.css` (full set). **Fonts:** `fonts/` (real Inter + Fira Code woff2). **Mascot:** `assets/putty-blob.svg`.
- **Themes:** `themes.ts` + `themes.css` reproduce all 16 built-in source-app themes (dark/Original, light, midnight, paper, cyberpunk, retrowave, forest, ocean, ume, copper, terminal, organs, lavender, gpt, claude, cute) plus `putty` (mono). Load `themes.css` and set `data-theme="<key>"` on a container to re-skin. The UI kit has a live switcher.
- **UI kit:** `ui_kits/putty-app/` — runnable TypeScript/React recreation of the workspace. `index.html` = chat product; **`Components.html` = the full component library** (buttons, forms, overlays, table, charts). Primitives in `controls.tsx` / `overlays.tsx` / `data.tsx`, styled by `components.css` (class prefix `pa-`).
- **Contrast rule:** text-on-coral uses `--accent-solid #c2454f` (AA); icon-only coral fills use bright `--accent`. Type uses bundled `.od-type-*` role classes; data-viz uses the `--chart-1..6` palette.
- **Don't:** use emoji as UI, colored/purple SaaS gradients, or title-case headings. Keep the canvas pure-grey and let the coral be the single accent (buttons, links, active state, mascot).
