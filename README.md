# Full-Stack Template

An opinionated, wiring-only full-stack template. Architecture decided, primitives
built, a worked reference feature included — clone it, write a short project spec,
and build features into an already-wired skeleton.

**One Bun process** serves the API **and** the React SPA (same-origin, no CORS,
no nginx). Type-safe end to end, SQLite-backed, one Docker image.

## Stack

| Layer | Choice |
|-------|--------|
| Runtime | Bun |
| API | Elysia (+ Eden Treaty for end-to-end types, zero codegen) |
| DB | SQLite (`bun:sqlite`) + Drizzle ORM |
| Frontend | React 19 + Vite + React Router v7 + TanStack Query v5 |
| UI | Tailwind v4 + Radix Primitives + CVA |
| Deploy | one multi-stage Docker image + `docker compose` |
| Tests | `bun:test` (API) + Vitest + Testing Library (frontend) |

## Quickstart

```bash
scripts/init-project.sh myapp     # rename scope, generate .env, install, migrate, seed

bun run dev                       # API :4000 + Vite :3000 (HMR)
# or the containerized stack (mirrors deploy):
docker compose up -d --build      # http://localhost:3000
```

## Everyday commands

```bash
bun run check          # type-check + lint + test (the gate)
bun run dev            # local dev with HMR
bun run db:generate    # after editing packages/api/src/db/schema.ts
bun run db:migrate     # apply migrations (also runs on API boot)
bun run db:seed        # idempotent seed
bun run eject:reference # remove the example feature once you don't need it
./scripts/backup.sh     # gzipped SQLite snapshot (cron-friendly)
```

## Where things live

- `packages/api` — Bun + Elysia API (also serves the SPA in production)
- `packages/frontend` — React SPA
- `docs/ARCHITECTURE.md` — topology, decisions, deploy, escape hatches
- `docs/DESIGN_SYSTEM.md` — UI primitives + page archetypes
- `CLAUDE.md` — how to build features (the build sequence + conventions)
- `WIRED.md` — one-page index of every wired capability
- `GOTCHAS.md` — the sharp edges

## Auth

Ships **Mode B** (shared bearer token in `.env`, baked into the SPA). See
`docs/ARCHITECTURE.md` for Mode A (none) and Mode C (login + cookie).

## Deploying & exposing

`docker compose up -d --build` runs the whole thing on `:3000`. To reach it from
other devices, put Tailscale / Caddy / Cloudflare Tunnel in front — see the
**pre-expose checklist** in `docs/ARCHITECTURE.md` before exposing it anywhere.
