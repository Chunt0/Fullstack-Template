# WIRED.md — what's already built

One-page index of every wired capability. If it's here, don't rebuild it.

## API (`packages/api/src`)

| Capability | File |
|------------|------|
| Entry point + graceful shutdown | `index.ts` |
| Plugin chain, health, swagger, static SPA + fallback, global `onError`, security headers | `app.ts` |
| Auto-typed API surface for the client (`export type App`) | `app.ts` |
| Route registration (single barrel) | `routes/index.ts` |
| Fail-fast env validation | `lib/env.ts` |
| Auth gate (Mode B shared bearer) | `lib/auth.ts` |
| Correlation IDs (X-Request-ID) | `lib/correlation.ts` |
| Response envelope `ok()` / `errorResponse()` | `lib/response.ts` |
| Typed errors (`AppError` + subclasses) | `lib/errors.ts` |
| Pagination helpers | `lib/pagination.ts` |
| Reusable `t` validators | `lib/schemas.ts` |
| Pino logging → stdout (see `docs/LOGGING.md`) | `lib/logger.ts` |
| DB singleton (WAL, FK, busy timeout) | `db/index.ts` |
| Migration runner (auto on boot) | `db/migrate.ts` |
| Idempotent seed | `db/seed.ts` |
| Health endpoint `/api/health` (public) | `app.ts` |
| Whoami `/api/me` (protected) | `app.ts` |
| Reference route (REFERENCE) | `routes/announcements.ts`, `routes/categories.ts` |
| Test harness (in-memory DB) | `tests/setup.ts`, `tests/helpers.ts` |

## Frontend (`packages/frontend/src`)

| Capability | File |
|------------|------|
| Entry + providers | `main.tsx`, `App.tsx` |
| Eden Treaty client (type-safe, static bearer) + `unwrap()` | `lib/api.ts` |
| TanStack Query client | `lib/query-client.ts` |
| `cn()` + `focusRing` | `lib/utils.ts` |
| Route manifest (single source: router + sidebar) | `routes.manifest.ts` |
| Router (built from manifest) | `router.tsx` |
| UI primitives (Radix + CVA) | `components/ui/` |
| Feedback states (Loading / Empty / Error) | `components/feedback/` |
| Patterns (DataTable / FormDialog / ConfirmDialog) | `components/patterns/` |
| Layout (AppShell / Sidebar / TopBar / PageHeader / ThemeProvider) | `components/layout/` |
| Error boundary | `components/ErrorBoundary.tsx` |
| Standard pages (Home / NotFound / RouteError) | `pages/` |
| Reference page (REFERENCE) | `pages/AnnouncementsPage.tsx`, `hooks/use-announcements.ts` |

## Infra & tooling

| Capability | File |
|------------|------|
| Single multi-stage image (SPA + API) | `Dockerfile` |
| One service, volume, port | `docker-compose.yml` |
| Pre-commit hooks | `.lefthook.yml` |
| Bootstrap | `scripts/init-project.sh` |
| Dev launcher (parallel API + Vite) | `scripts/dev.sh` |
| Backup / restore | `scripts/backup.sh`, `scripts/restore.sh` |
| Reference check / eject | `scripts/check-reference.sh`, `scripts/eject-reference.sh` |
