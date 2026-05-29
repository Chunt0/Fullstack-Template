# CLAUDE.md

Guidance for building features into this template. Read this first, every session.

## What this is

A wiring-only full-stack template: **one Bun process** serves an Elysia API *and*
the built React SPA (same-origin, no CORS, no nginx). Type-safe end to end via
Eden Treaty. SQLite + Drizzle. One Docker image, one `docker compose`.

The architecture decisions are already made. Your job is to add features by
**copying the reference feature's shape**, not by inventing new patterns.

## Tiered reading (read only what the task needs)

| When | Read |
|------|------|
| Always | This file |
| Starting a project | `NEW_PROJECT_SPEC.md` (the filled brief), then the reference feature (below) |
| Writing UI | `docs/DESIGN_SYSTEM.md` |
| Placement / "where does X go" | `WIRED.md`, then `docs/ARCHITECTURE.md` |
| Before shipping | `GOTCHAS.md`, the pre-expose checklist in `docs/ARCHITECTURE.md` |

Don't read `SEED_SPEC.md` to build features — it's the doc that generated this
template, not a guide for extending it.

## The reference feature (the golden path — copy it)

`announcements` (+ a `categories` relation) is a complete vertical slice. Read it
in this order, then mirror it for your own resources:

1. `packages/api/src/db/schema.ts` — tables
2. `packages/api/src/routes/announcements.ts` — GET/POST/DELETE, validated, enveloped
3. `packages/api/src/routes/index.ts` — where routes are registered
4. `packages/frontend/src/hooks/use-announcements.ts` — query/mutation hooks + key factory
5. `packages/frontend/src/pages/AnnouncementsPage.tsx` — the CRUD page archetype
6. `packages/frontend/src/routes.manifest.ts` — the one line that adds route + nav

Remove it with **`bun run eject:reference`** once your first feature replaces it.

## Build sequence (per resource)

1. **Schema** → add a table to `db/schema.ts`, then `bun run db:generate`. Add
   idempotent upserts to `db/seed.ts`.
2. **Route** → `routes/<name>.ts` default-exporting an Elysia instance prefixed
   `/api/<name>`. Validate every input with `t.Object(...)`; return `ok(...)` or
   throw an `AppError`. Register it: add one `.use(...)` line in `routes/index.ts`.
3. **Hook** → `hooks/use-<name>.ts` — TanStack Query, with a key factory.
4. **Page** → compose from the design system (PageHeader + DataTable + FormDialog
   + ConfirmDialog for CRUD). See `docs/DESIGN_SYSTEM.md`.
5. **Route + nav** → add one entry to `routes.manifest.ts` (router *and* sidebar
   read it).
6. **Tests** → at least 401 + happy-path per route (`bun:test`); a component test
   for non-trivial pages (Vitest).

## Conventions (these are enforced — follow them)

- **API responses:** return `ok(data, meta?)`; never a bare object. Errors: throw
  an `AppError` subclass (`NotFoundError`, `BadRequestError`, …). The global
  `onError` makes the envelope.
- **Validation:** every route input via Elysia `t`. Reuse `lib/schemas.ts` +
  `lib/pagination.ts`.
- **Env:** only `lib/env.ts` reads `process.env`. Add new vars there (fail-fast).
- **Frontend data:** all API calls go through `lib/api.ts` (`api.<resource>...`)
  and `unwrap(...)`. Query keys come from a factory, never hand-written arrays.
- **Routes:** API routes register in `routes/index.ts`; pages register in
  `routes.manifest.ts`. One place each — nothing else to touch.
- **Auth:** `lib/auth.ts` (Mode B shared bearer). `user` is on the context.

## Definition of done

```bash
bun run check            # type-check + lint + test — must be green
bun run check:reference  # before shipping: no reference markers left
```

Keep docs aligned with what you built — treat drift as a build failure.

## Don't add

Error trackers, a second datastore, a job queue, a users table/RBAC, CORS, a
runtime config endpoint, or a second frontend framework — unless you've outgrown
the template (see `docs/ARCHITECTURE.md` → Escape hatches). Every dependency is a
maintenance cost; justify it.

## Commands

```bash
bun run dev          # API :4000 + Vite :3000 (HMR)
bun run check        # type-check + lint + test
bun run db:generate  # after schema.ts changes
bun run db:migrate   # apply migrations
bun run db:seed      # idempotent
docker compose up -d --build   # full stack on :3000
```
