# Design System

Re-read this whenever you write UI. Compose pages from these — reach for a
primitive before writing a custom component.

## Tokens

Semantic CSS variables in `src/styles/tailwind.css` (`:root` + `.dark`), exposed
as Tailwind utilities via `@theme inline`. Use the semantic colors, never raw
ones:

`bg-background` `text-foreground` · `bg-card` · `bg-primary text-primary-foreground`
· `bg-secondary` · `bg-muted text-muted-foreground` · `bg-accent` · `bg-destructive`
· `border-border` · `border-input` · `ring-ring`. Radius: `rounded-sm|md|lg`.

Dark mode: `ThemeProvider` toggles `.dark` on `<html>` (light/dark/system,
persisted). Use `focusRing` from `lib/utils` for keyboard focus.

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
manifest) · `TopBar` (theme toggle) · `PageHeader` (title + description + actions)
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
