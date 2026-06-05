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
- **Look:** a **monochrome** system — ink canvas `#0e0e10`, panels lift lighter `#161719`, near-white text `#e9eaec` / white `#ffffff` headings, grey borders `#2e3036`. The interactive accent is near-white (primary buttons = light fill + ink text). The **only color** is the coral **putty mascot** `#e06c75` (a wobbly blob with a smile) — reserve it for the mark/logo only.
- **Type:** Inter (UI), Fira Code (mono / brand voice). Sentence case. Faint white dot-grid + soft white radial glows. Feather/Lucide line icons. Borders over shadows.
- **Tokens:** `colors_and_type.css` (full set). **Fonts:** `fonts/` (real Inter + Fira Code woff2). **Mascot:** `assets/putty-blob.svg`.
- **UI kit:** `ui_kits/putty-app/` — runnable TypeScript/React recreation of the workspace.
- **Don't:** use emoji as UI, colored/purple SaaS gradients, or title-case headings. Keep it monochrome, calm, and let the putty mascot be the single pop of color.
