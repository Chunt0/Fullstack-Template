# Design System

Re-read this whenever you write UI. Compose pages from these — reach for a
primitive before writing a custom component.

## Tokens

`src/styles/tailwind.css` is theme-driven. The kit's raw hex tokens
(`--bg` / `--panel` / `--accent` / `--border` …) live in `[data-theme="<key>"]`
blocks and are **bridged** to the app's semantic Tailwind colors in
`@theme inline`. Use the semantic colors, never raw ones:

`bg-background` `text-foreground` · `bg-card` · `bg-primary text-primary-foreground`
· `bg-secondary` · `bg-muted text-muted-foreground` · `bg-accent` (neutral hover
fill) · `bg-destructive` · `bg-success` · `bg-warning` · `border-border` ·
`border-input` · `ring-ring` · `bg-chart-1…6`. Radius: `rounded-sm|md|lg|xl`.

**`primary` is the coral interactive accent** (was monochrome) — primary
buttons, links, focus ring, and active nav all read the active theme's accent.
It maps to `--accent-solid` (AA-safe on fills) and falls back to `--accent` for
themes that define no solid variant. Re-skin by changing tokens, never component
classes.

## Theming

`ThemeProvider` sets `data-theme="<key>"` on `<html>` (persisted to
`localStorage`, applied pre-paint by an inline script in `index.html` to avoid
flash) and toggles `.dark` for dark-canvas themes. The 18 built-in themes live
in `lib/themes.ts` (mirrors `putty-ai-design/themes.ts`); the `TopBar` palette
menu switches between them live. `useTheme()` exposes `{ theme, setTheme,
resolvedTheme }` — `resolvedTheme` ('light'|'dark') is for theme-aware widgets
like sonner. To add a theme: add its `[data-theme]` block to `tailwind.css` and
one row to `lib/themes.ts`.

## Primitives (`components/ui/`)

`Button` (variants: default/secondary/outline/ghost/destructive/link; sizes:
default/sm/lg/icon; `asChild`) · `Input` · `Textarea` · `Label` · `Select` ·
`Dialog` (+ Header/Footer/Title/Description) · `Card` (+ Header/Title/Description/
Content/Footer) · `Badge` · `Table` (+ Header/Body/Row/Head/Cell) · `DropdownMenu`
· `Tooltip` · `Switch` · `Checkbox` · `Tabs` · `Skeleton` · `Separator` ·
`Toaster` + `toast` (sonner, theme-aware).

`cn(...)` merges classes (Tailwind-conflict-aware).

## Feedback (`components/feedback/`)

`LoadingState` · `EmptyState` · `ErrorState`. Every async surface uses these — no
ad-hoc spinners. `DataTable` wires all three for you.

## Patterns (`components/patterns/`)

- **`DataTable`** — typed `columns` + `rows`; owns loading/empty/error states.
- **`FormDialog`** — dialog wrapping a form; always renders Title + Description
  (sr-only when decorative — GOTCHAS G8).
- **`ConfirmDialog`** — confirm an action (`destructive` variant for deletes).

## Layout (`components/layout/`)

`AppShell` (Sidebar + TopBar + `<Outlet/>`) · `Sidebar` (built from the route
manifest) · `TopBar` (18-theme palette switcher) · `PageHeader` (title + description + actions)
· `ThemeProvider`.

## Archetypes

**CRUD page** = `PageHeader` (with a "New" action) + `DataTable` + `FormDialog`
(create/edit) + `ConfirmDialog` (delete). The reference `AnnouncementsPage.tsx`
*is* this archetype — copy it. Toasts via `toast.success/error`.

**Detail / form page** = `PageHeader` + `Card`s + `Input`/`Select`/`Textarea`
with `Label`s.

## Adding a page

1. Build it in `pages/<Name>.tsx` (default export).
2. Add one entry to `routes.manifest.ts` — it appears in the router *and* the
   sidebar automatically.
