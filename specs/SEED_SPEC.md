# SEED_SPEC.md — Full-Stack Template Generator

- **status:** done @ dd329aa  *(archived — generated this template; superseded by the live code)*
- **kind:** archive

> **Archived.** This is the build-time spec that *generated* the template. It is
> kept as a historical record, not a guide. The code is now the source of truth;
> to extend the template, write a feature spec (`specs/SPEC_TEMPLATE.md`), not
> edits here. See `specs/README.md` for the workflow.

> **Naming note.** This historical generator refers to the per-project brief as
> `NEW_PROJECT_SPEC`. In the built template that file is now `PROJECT_BRIEF.md`
> (same idea: a short, fill-in brief you hand to Claude to build a new app). This
> file is the record of how the template was generated, not a guide for extending
> it — to build features, read `CLAUDE.md`.

A self-contained spec that, when followed, **builds a reusable full-stack
template repo**. It is a *one-time generator*: run it once to birth the template,
push that template to GitHub, and from then on you never touch this file again —
you pull the template and write a per-project spec instead.

The template it produces is **opinionated and general-purpose**: a single locked
stack, sensible defaults wired end-to-end, and a worked reference feature you
delete on the way out. It is sized for "an app I (and maybe a few of my own
devices) use" — but nothing in it *forbids* growing into multi-user; see
§16 escape hatches.

---

## 0. How to use this document (read first)

There are **three artifacts**, with three audiences and three lifetimes:

| Artifact | Who acts on it | Lifetime |
|----------|----------------|----------|
| **This seed spec** (`SEED_SPEC.md`) | you + Claude, once | run once to generate the template, then archived |
| **The template repo** (the generated code) | pulled per project | the reusable thing; lives on GitHub |
| **The project spec** (`NEW_PROJECT_SPEC.md`, filled from a template inside the repo) | Claude, per new app | one per project you build |

So the flow is:

```
SEED_SPEC.md  ──(run once, §10)──►  template repo  ──(push to GitHub)
                                          │
                                          ▼
            new project  ◄──(pull, fill NEW_PROJECT_SPEC, §11)── template repo
```

The whole point: by the time you start a real project, the architecture
decisions, primitives, conventions, and build order are already made. You write
a short project spec describing *what the app does*, and Claude builds features
into an already-wired skeleton.

**Two things make that magic work**, and they deserve as much care as the code:
- `CLAUDE.md` in the template — the reading order + per-project build sequence.
- `NEW_PROJECT_SPEC.template.md` — the fill-in-the-blanks brief Claude consumes.

---

## 1. Scope & non-goals

**The template is:**

- A *wiring-only* skeleton. Architecture decided, primitives built, ready to extend.
- Bun + Elysia API that also serves the built React SPA (one process, one
  origin, no CORS) · React 19 + Vite SPA · SQLite on a mounted volume · one
  `docker compose` to run it all.
- Type-safe end to end: Eden Treaty for API calls (no codegen), TanStack Query
  for fetch/cache, Drizzle for SQL.
- A design system (~26 Radix + CVA primitives, three pattern components, an
  AppShell layout) and a worked reference feature.

**The template is NOT:**

- A SaaS starter — no billing, no multi-tenancy, no users table by default.
- A hardened public-internet deployment — see §13 before exposing it anywhere.
- A devops platform — no K8s/Helm/observability stack. `docker compose` and
  `docker compose logs -f` are the operational toolkit.

**Default operating assumptions** (these shape the defaults, not hard walls):

| Assumption | Implication |
|------------|-------------|
| Small number of trusted users (often just you) | No RBAC, no row-level ownership by default. Auth is a single gate (§3). |
| Runs on a box you control (home server / NAS / VPS / laptop) | One `.env`, one box, no environment promotion. |
| You operate, build, and use it | No release process, no PR-review gate required (lefthook covers commit-time). |
| Reachability is the first line of defense | LAN-only by default; expose via Tailscale/Caddy/Cloudflare Tunnel (§13). |
| x86-64 **or** arm64 Linux/macOS | Images build for both arches; no OS-specific paths. |

If you outgrow these (real multi-user, public exposure, compliance data),
§16 lists the mechanical changes — none require reshaping your domain code.

---

## 2. Stack (locked, opinionated — one choice per layer)

| Layer | Choice | Why |
|-------|--------|-----|
| Runtime | **Bun** | One binary: package manager + runtime + test runner. `bun:sqlite` built in. Tiny container. |
| API framework | **Elysia** | Native Bun, end-to-end type inference surfaced to the client via Eden Treaty. |
| DB | **SQLite** (`bun:sqlite`) + **Drizzle ORM** + drizzle-kit | One file, WAL mode, comfortable to ~10 GB. Type-safe queries + generated migrations. |
| API client | **Eden Treaty** (`@elysiajs/eden`) | Type-*only* import of the Elysia `App` type → zero codegen, full req/res types in the browser. |
| Frontend | **React 19 + Vite + React Router v7** (data routes) + **TanStack Query v5** | Modern, fast HMR, no Next.js complexity. |
| Styling | **Tailwind v4** (CSS-first) + **Radix Primitives** + **class-variance-authority** | Token-driven, fully accessible, no runtime CSS-in-JS. |
| SPA serving | **the Bun process itself** (`@elysiajs/static`) | The API process serves the built SPA *and* `/api/*` → always same-origin, no CORS, no separate web server. |
| Build/run | **single `docker-compose.yml`**, one multi-stage image (the Bun app) | One command, one volume, one network. |
| Logging | **Pino** → stdout → `docker compose logs` | No external aggregator. |
| Testing | **`bun:test`** (API) + **Vitest + jsdom + Testing Library** (frontend) | Playwright smoke E2E optional. |
| Pre-commit | **lefthook** + ESLint + TypeScript + **gitleaks** | Local gate; CI optional. |

**Version policy:** use normal caret (`^`) ranges; `bun install` resolves latest
on clone. No exact pins, no `.bun-version` lockstep. (One caveat carried as a
gotcha: keep the `@elysiajs/*` packages on the same minor as `elysia` itself, since
Eden's types track Elysia's — bump them together.)

**Dependency discipline:** every dep is a thing to keep updated. Before adding
one, check §15.

---

## 3. Auth — the one pluggable axis (ship **Mode B**)

Auth is isolated behind a single Elysia plugin (`lib/auth.ts`) so swapping modes
is a localized change. The template ships **Mode B**.

### Mode A — no auth
- `authPlugin` is a no-op (still registered, so swapping to B later is trivial).
- Use when: localhost-only, or a fully trusted LAN.

### Mode B — shared bearer token (DEFAULT)
- `AUTH_TOKEN` in root `.env`, required-validated in `env.ts`.
- `authPlugin` derives `user: { id: 'me' }` when `Authorization: Bearer <AUTH_TOKEN>`
  matches; throws `UnauthorizedError` otherwise. Public paths: `/api/health` only.
- The same token is read at **frontend build time** as `VITE_AUTH_TOKEN`, baked
  into the bundle, and attached to every Eden Treaty request via a static
  `headers()` callback.
- The token is recoverable from the bundle — acceptable because the bundle is
  only served to clients that can already reach the frontend (same network
  boundary the token protects), and its job is to stop opportunistic scanning,
  not to resist credential theft.
- Generate with `openssl rand -hex 32` in `scripts/init-project.sh`.

### Mode C — single password + cookie session
- `/api/login` compares a password against an argon2id hash in `.env`, sets a
  signed `httpOnly; SameSite=Lax` cookie; `authPlugin` validates the cookie HMAC.
- Frontend gets a `SignInPage`, `useSession()`, an `AuthGuard`.
- ~60 lines of additional code. Documented as an escape hatch (§16); not shipped.

**Rule of thumb:** start with **B**. Drop to **A** by stubbing the plugin; rise
to **C** when you want a real login form. Never run "Mode A + exposed beyond
your LAN" — transport encryption (Tailscale, etc.) is not authentication.

---

## 4. Repository layout

```
.
├── CLAUDE.md                       # reading order + per-project build sequence (the linchpin)
├── README.md                       # quickstart + stack snapshot
├── WIRED.md                        # one-page cheatsheet of every wired capability (mirror of §5/§6/§7)
├── GOTCHAS.md                      # §14
├── NEW_PROJECT_SPEC.template.md    # fill this in to brief Claude on a new project (§11)
├── .env.example                    # §9
├── .gitignore                      # .env, dist/, node_modules, data/, backups/
├── .lefthook.yml                   # pre-commit hooks
├── .gitleaks.toml                  # gitleaks allowlist
├── package.json                    # workspaces: packages/*
├── tsconfig.base.json
├── Dockerfile                      # single multi-stage image: build SPA → build API → runtime serving both
├── docker-compose.yml              # one app service, one network, one named volume
├── scripts/
│   ├── init-project.sh             # generate .env (fresh token + display name), install, migrate, seed
│   ├── backup.sh                   # sqlite VACUUM INTO → gzipped tarball, rotation
│   └── restore.sh                  # untar + replace + restart
├── docs/
│   ├── ARCHITECTURE.md             # topology + the design decisions in this spec, in prose
│   └── DESIGN_SYSTEM.md            # the doc you re-read every time you write UI
├── packages/
│   ├── api/
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── drizzle.config.ts
│   │   └── src/
│   │       ├── index.ts            # serve + graceful shutdown
│   │       ├── app.ts              # plugin chain + .use(routes) + health + swagger + static SPA + fallback
│   │       ├── lib/
│   │       │   ├── env.ts          # fail-fast validator
│   │       │   ├── auth.ts         # auth plugin (Mode B)
│   │       │   ├── correlation.ts  # X-Request-ID
│   │       │   ├── response.ts     # ok() / errorResponse()
│   │       │   ├── errors.ts       # AppError + subclasses
│   │       │   ├── pagination.ts   # parse + meta helpers
│   │       │   ├── schemas.ts      # reusable Elysia t-schemas
│   │       │   └── logger.ts       # pino
│   │       ├── db/
│   │       │   ├── index.ts        # bun:sqlite + drizzle + WAL pragmas (singleton)
│   │       │   ├── migrate.ts      # drizzle migrator (runs on boot)
│   │       │   ├── schema.ts       # table defs        ← REFERENCE: announcements
│   │       │   ├── seed.ts         # idempotent upserts ← REFERENCE block
│   │       │   └── migrations/     # generated SQL
│   │       ├── routes/
│   │       │   └── announcements.ts  # REFERENCE: safe to delete
│   │       └── tests/
│   │           ├── setup.ts        # hermetic env, in-memory db
│   │           ├── helpers.ts      # request(), json()
│   │           ├── auth.test.ts    # 401 on missing/wrong token
│   │           └── health.test.ts
│   └── frontend/
│       ├── package.json
│       ├── tsconfig.json
│       ├── vite.config.ts
│       ├── index.html
│       └── src/
│           ├── main.tsx            # createRoot
│           ├── App.tsx             # <RouterProvider>
│           ├── routes.manifest.ts  # SINGLE source of routes → router + Sidebar both read it
│           ├── router.tsx          # builds RR v7 data routes from the manifest (+ error elements)
│           ├── env.d.ts            # VITE_API_URL, VITE_AUTH_TOKEN
│           ├── lib/
│           │   ├── api.ts          # treaty<App>(origin) + static bearer header
│           │   ├── query-client.ts # TanStack Query config
│           │   └── utils.ts        # cn(), focusRing
│           ├── hooks/
│           │   └── use-announcements.ts  // REFERENCE: safe to delete
│           ├── components/
│           │   ├── ErrorBoundary.tsx
│           │   ├── ui/             # ~26 Radix + CVA primitives
│           │   ├── feedback/       # Loading / Empty / Error states
│           │   ├── patterns/       # DataTable, FormDialog, ConfirmDialog
│           │   └── layout/         # AppShell, Sidebar, TopBar, PageHeader, ThemeProvider
│           ├── pages/
│           │   ├── Home.tsx
│           │   ├── NotFound.tsx
│           │   ├── RouteError.tsx
│           │   └── AnnouncementsPage.tsx  // REFERENCE: safe to delete
│           ├── styles/
│           │   └── tailwind.css    # @theme tokens
│           └── tests/
│               └── setup.ts        # jsdom + testing-library
```

Optional add-ons (off by default, documented in README): `.github/workflows/ci.yml`,
`e2e/` (Playwright smoke).

---

## 5. API contracts (the decisions that make the skeleton consistent)

These are the conventions every route follows. The reference feature demonstrates
all of them; new features copy the pattern.

### 5.1 Response envelope (`lib/response.ts`)
Every successful response is wrapped; every error too.
```ts
// success
{ ok: true, data: <T>, meta?: { ... } }
// error
{ ok: false, error: { code: string, message: string, requestId: string } }
```
- `ok(data, meta?)` builds the success envelope.
- `errorResponse(err, requestId)` builds the error envelope.
- `meta` carries pagination (§5.4) and nothing else by convention.

### 5.2 Error model (`lib/errors.ts`)
- `AppError` base: `{ statusCode, code, message, expose }`.
- Subclasses: `NotFoundError` (404), `UnauthorizedError` (401), `ValidationError`
  (422), `ConflictError` (409), `ForbiddenError` (403).
- A single global `onError` in `app.ts`:
  - maps `AppError` → its `statusCode` + envelope,
  - maps Elysia validation errors → 422 `ValidationError`,
  - maps everything else → 500 with a **generic** message (never leak internals),
  - logs every error with the request's correlation ID and stack.

### 5.3 Correlation IDs (`lib/correlation.ts`)
- Read `X-Request-ID` from the request or generate one (`crypto.randomUUID()`).
- Stored on the Elysia context, echoed in the response header and every log line
  and error envelope for that request.

### 5.4 Pagination (`lib/pagination.ts`)
- Offset/limit. Query params `limit` (default 50, max 200) + `offset` (default 0),
  validated via a reusable schema.
- List responses return `meta: { total, limit, offset }`.

### 5.5 Validation (`lib/schemas.ts`)
- **Every** route input (body/query/params) validated with Elysia `t.Object(...)`.
- Common shapes (id params, pagination query, timestamps) live in `schemas.ts`
  and are imported, not re-declared.

### 5.6 Logging (`lib/logger.ts`)
- Pino, structured JSON to stdout. `LOG_LEVEL` env (default `info`).
- A request-logging hook emits `{ method, path, status, durationMs, requestId }`
  per request.

### 5.7 Env (`lib/env.ts`)
- Parse + validate process env **once at boot**; exit non-zero with a clear
  message if a required var is missing/invalid. Export a typed `env` object.
  Nothing else reads `process.env` directly.

### 5.8 Database (`db/index.ts`, `db/migrate.ts`, `db/seed.ts`)
- `bun:sqlite` opened once (singleton), wrapped by Drizzle.
- Pragmas on open: `journal_mode = WAL`, `foreign_keys = ON`, `busy_timeout`.
- `migrate.ts` runs generated migrations on API boot (idempotent).
- `seed.ts` performs idempotent upserts; safe to run repeatedly.

### 5.9 Auth (`lib/auth.ts`)
- Per §3 Mode B. Cross-cutting Elysia plugin — **must end with `.as('global')`**
  so its `derive`/guards apply to routes registered after it (gotcha G4).

### 5.10 Serve + graceful shutdown (`index.ts`)
- Run migrations → start Elysia → on `SIGTERM`/`SIGINT` stop accepting requests,
  close the DB, exit cleanly.

### 5.11 Health + docs (`app.ts`)
- `GET /api/health` — public, returns `{ ok: true, data: { status, uptime } }`.
- Swagger at `/docs` gated behind `ENABLE_SWAGGER` (default off in prod).

### 5.12 Static SPA serving + security headers (`app.ts`)
- After the `/api/*` routes, the app serves the built SPA from `dist/` via
  `@elysiajs/static`, with a catch-all fallback to `index.html` for client-side
  routing (assets get long-lived cache headers; `index.html` is no-cache).
- Security headers are set in a global Elysia hook (previously nginx's job): CSP
  `default-src 'self'`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`.
  **HSTS only when a real TLS terminator is in front** (§13).

### 5.13 Route registration — single barrel (`routes/index.ts`)
- Routes register in **one place**, `routes/index.ts`, which imports each
  `routes/<name>.ts` (default-exporting an Elysia instance prefixed
  `/api/<name>`) and chains them with `.use()`; `app.ts` does `.use(routes)`.
  Adding a resource = create the file + add one `.use()` line here.
- **Why a barrel and not a runtime glob** (the auto-wiring decision, refined by
  implementation): Eden Treaty infers the entire API as a *static* type from
  `typeof app`. A runtime glob loop erases those types, so the frontend would
  lose end-to-end safety. The barrel keeps one obvious place to register —
  symmetric with the frontend's `routes.manifest.ts` — while preserving the
  types. The frontend manifest *is* a true single-source list (no type cost),
  so it stays as designed in §6.3.

---

## 6. Frontend contracts

### 6.1 API client (`lib/api.ts`)
- `treaty<App>(baseOrigin, { headers })` where `App` is a **type-only** import
  of the API's Elysia app type. `headers()` statically attaches
  `Authorization: Bearer ${import.meta.env.VITE_AUTH_TOKEN}` (Mode B).
- `baseOrigin` is `VITE_API_URL` or `window.location.origin` — **a domain, never
  a path** (gotcha G5: never pass `/api`).

### 6.2 Data fetching (`lib/query-client.ts`, `hooks/use-*.ts`)
- One `QueryClient` (sane defaults: `staleTime`, limited `retry`).
- One hooks module per resource. Query keys are arrays: `['announcements', params]`.
- Mutations invalidate the relevant query key on success.
- Hooks unwrap the response envelope and surface `error` to the UI.

### 6.3 Routing — single manifest (`routes.manifest.ts`, `router.tsx`, `Sidebar.tsx`)
- **One manifest is the single source of truth** for app routes — entries of
  `{ path, label, icon, page: () => import('./pages/...') }`. `router.tsx` builds
  the React Router v7 data routes from it (lazy-loaded, each with an
  `errorElement` → `RouteError`); `Sidebar.tsx` builds its nav from the *same*
  list. **Adding one manifest entry wires both the route and the nav link** — they
  cannot drift, and there is no second place to forget. Unknown paths → `NotFound`.

### 6.4 Design system (`docs/DESIGN_SYSTEM.md` is the source of truth)
- **Tokens:** Tailwind v4 `@theme` CSS variables (color, spacing, radius, …);
  light/dark via a `ThemeProvider` toggling a class on `<html>`.
- **Primitives (`components/ui/`):** ~26 Radix-backed, CVA-variant components
  (Button, Input, Select, Dialog, Sheet, Tabs, Toast, Tooltip, Dropdown, Card,
  Badge, Table, Checkbox, Switch, Label, etc.). `cn()` merges classes;
  `focusRing` standardizes focus styles.
- **Feedback (`components/feedback/`):** `LoadingState`, `EmptyState`,
  `ErrorState` — every async surface uses these, no ad-hoc spinners.
- **Patterns (`components/patterns/`):** `DataTable`, `FormDialog`, `ConfirmDialog`.
- **Layout (`components/layout/`):** `AppShell` (Sidebar + TopBar + outlet),
  `PageHeader`.
- **Archetype:** a CRUD page = `PageHeader` + `DataTable` + `FormDialog` +
  `ConfirmDialog`. The reference page is exactly this.
- **Accessibility:** dialogs/sheets require `DialogTitle` + `DialogDescription`
  (use `sr-only` when decorative) — gotcha G8.

### 6.5 Error boundary (`ErrorBoundary.tsx`)
- Top-level boundary catches render errors and shows `ErrorState`.

---

## 7. Infra & tooling

- **`Dockerfile`** (single, multi-stage, at repo root) — stage 1: `bun install`
  + `vite build` the frontend (env baked) → `dist/`. stage 2: build the API.
  stage 3: slim Bun runtime, non-root user, copies the API + the SPA `dist/`,
  runs migrations on boot, then serves both API and SPA on one port.
- **`docker-compose.yml`** — one `app` service (the Bun process), private bridge
  network, named volume `app-data` for SQLite, `restart: unless-stopped`,
  published on `:3000`. (If you later add a separate service — e.g. a Python
  inference sidecar — it attaches to the same private network and publishes *no*
  host port; the `app` service stays the only public surface.)
- **`.lefthook.yml`** — pre-commit: ESLint, `tsc --noEmit`, gitleaks.
- **Scripts** — `init-project.sh`, `backup.sh`, `restore.sh` (§12).

---

## 8. Reference feature — `announcements` (the worked vertical slice)

A complete, idiomatic slice that exercises every contract above, **including one
relation** so the agent has a relational pattern to copy (the single most common
modeling need). New features copy its shape; then you delete it.

**Files (all marked `// REFERENCE: safe to delete` — a checked invariant):**
1. `db/schema.ts` — `announcements` table **+ a small `categories` table it
   references** (the relation archetype: foreign key, join, nested read, and a
   `<Select>` of categories in the create form).
2. `db/migrations/0000_*.sql` — generated.
3. `db/seed.ts` — `REFERENCE_ANNOUNCEMENTS` block.
4. `routes/announcements.ts` — `GET` list (paginated) / `POST` create / `DELETE`
   soft-delete; every input `t`-validated; every output `ok(...)` or `AppError`.
   *Registered with one `.use()` line in `routes/index.ts` (the barrel).*
5. `hooks/use-announcements.ts` — list query + create/delete mutations.
6. `pages/AnnouncementsPage.tsx` — the CRUD archetype composition.
7. `routes.manifest.ts` — one entry, which drives both the route (`router.tsx`)
   and the nav link (`Sidebar.tsx`).

Registration is exactly two single, obvious lines — one in `routes/index.ts`
(API) and one in `routes.manifest.ts` (page + nav together). The frontend
manifest collapses the two classic half-wiring spots (a separate router edit and
a separate `Sidebar` edit) into one.

**Invariant:** `grep -rn "REFERENCE:" packages/` returns zero matches before a
project is "done" (build-order step, §11).

---

## 9. Environment variables (`.env.example`)

```env
# ── Required (API exits at boot if missing) ──────────────────────────────
DATABASE_PATH=../../data/app.db        # overridden to /data/app.db in compose
AUTH_TOKEN=replace-me-openssl-rand-hex-32   # Mode B; gates every non-public route
NODE_ENV=development

# ── Build-time (frontend, baked into the bundle by Vite) ─────────────────
VITE_API_URL=                          # empty = window.location.origin. Never "/api".
VITE_AUTH_TOKEN=replace-me-must-match-AUTH_TOKEN

# ── Optional ─────────────────────────────────────────────────────────────
ENABLE_SWAGGER=true                    # default false; exposes /docs
LOG_LEVEL=info                         # debug for verbose local logs
```

`scripts/init-project.sh` writes `AUTH_TOKEN` **and** `VITE_AUTH_TOKEN` from one
`openssl rand -hex 32` call — never edit one without the other (gotcha G9).

---

## 10. Build order — generating the template (run this ONCE)

Each step ends with a **verification gate**. Do not proceed past a failing gate.

1. **Workspace skeleton** — root `package.json` (workspaces `packages/*`),
   `tsconfig.base.json`, `.gitignore`, `.env.example`, `.lefthook.yml`,
   `.gitleaks.toml`.
   *Gate:* `bun install` succeeds.
2. **API libs** — `env.ts`, `logger.ts`, `errors.ts`, `response.ts`,
   `correlation.ts`, `pagination.ts`, `schemas.ts`, `auth.ts` (§5).
   *Gate:* `tsc --noEmit` clean.
3. **DB layer** — `db/index.ts` (WAL singleton), `db/schema.ts` (announcements),
   `drizzle.config.ts`, `bun run db:generate`, `db/migrate.ts`, `db/seed.ts`.
   *Gate:* `bun run db:migrate && bun run db:seed` against a scratch DB succeeds.
4. **API app** — `app.ts` (plugin chain, health, swagger, global `onError`),
   `routes/announcements.ts`, `index.ts` (serve + graceful shutdown).
   *Gate:* API boots; `curl /api/health` → 200; `curl /api/announcements`
   without a token → **401**.
5. **API tests** — `tests/setup.ts`, `helpers.ts`, `auth.test.ts`,
   `health.test.ts`.
   *Gate:* `bun run test` (API) green.
6. **Frontend skeleton** — `vite.config.ts`, `tsconfig.json`, `index.html`,
   `main.tsx`, `App.tsx`, `env.d.ts`, Tailwind `@theme` tokens.
   *Gate:* `vite build` succeeds.
7. **Design system** — `lib/utils.ts`, `components/ui/*` (~26), `feedback/*`,
   `patterns/*`, `layout/*`, `ErrorBoundary.tsx`, plus `docs/DESIGN_SYSTEM.md`.
   *Gate:* `tsc --noEmit` clean; primitives render in a smoke test.
8. **Frontend data + pages** — `lib/api.ts`, `lib/query-client.ts`,
   `hooks/use-announcements.ts`, `pages/*`, `router.tsx`.
   *Gate:* `bun run test` (frontend) green; dev server renders the reference page
   end-to-end against the running API.
9. **Infra** — the single multi-stage `Dockerfile`, `docker-compose.yml`.
   *Gate:* `docker compose up --build` boots the `app` service; browsing
   `http://localhost:3000` shows the reference page (served by Bun) talking to
   the API at `/api`.
10. **Scripts + docs** — `init-project.sh`, `backup.sh`, `restore.sh`;
    `CLAUDE.md`, `README.md`, `WIRED.md`, `GOTCHAS.md`, `ARCHITECTURE.md`,
    `NEW_PROJECT_SPEC.template.md`.
    *Gate:* `init-project.sh testapp` on a fresh clone produces a runnable app;
    docs match reality.
11. **Commit & publish** — `git init`, initial commit, push to GitHub.

---

## 11. Downstream workflow — using the template for a new project

This is what `CLAUDE.md` in the template encodes. The per-project build sequence:

1. **Pull the template**, run `scripts/init-project.sh "<display name>"` (generates
   `.env` with a fresh token + `VITE_APP_NAME`, installs, migrates, seeds). The
   `@app/*` workspace scope is a fixed internal name and is left as-is.
2. **Fill `NEW_PROJECT_SPEC.md`** from the template. It captures, at minimum:
   - one-line purpose · the entities/resources (fields + relationships) ·
     the pages/views · auth mode (A/B/C) · any non-default needs.
3. **Build per resource, copying the reference slice:**
   a. **Schema** → add tables to `db/schema.ts`, `bun run db:generate`, idempotent
      `seed.ts` upserts.
   b. **Routes** → one Elysia plugin per resource in `routes/`, registered after
      `authPlugin`; every input `t`-validated, every output `ok(...)`/`AppError`.
   c. **Hooks** → TanStack Query hooks per resource.
   d. **Pages** → compose from design-system archetypes (§6.4).
   e. **Route + nav** → add one entry to `routes.manifest.ts` (the route *and* the
      sidebar link both come from it). API routes register with one `.use()` line
      in `routes/index.ts`.
   f. **Tests** → at least 401 + happy-path per route; component tests for
      non-trivial pages.
4. **Delete the reference feature** — `grep -rn "REFERENCE:" packages/` must
   return zero matches before "done."
5. **Keep docs aligned** — treat README/GOTCHAS/ARCHITECTURE drift as a build
   failure.

`NEW_PROJECT_SPEC.template.md` is the interface you'll use most — it should be
short, structured, and unambiguous, so Claude can build from it without
re-deciding architecture.

---

## 12. Deployment, data, backups

**Deploy on a box:**
```
git clone <your-repo> myapp && cd myapp
scripts/init-project.sh myapp
docker compose up -d --build      # browse http://<box>:3000
```
`restart: unless-stopped` brings both services back after reboot. `git pull &&
docker compose up -d --build` updates in place; migrations run on API boot.

**Where data lives:** SQLite in the `app-data` named volume; logs on stdout
(`docker compose logs -f`); add another named volume for uploads if needed.

**`scripts/backup.sh`** — `VACUUM INTO` a consistent snapshot (safe under WAL),
`docker cp` it off the volume, gzip, rotate (keep ~14 dailies + 8 weeklies).
Cron: `0 3 * * * cd /opt/myapp && ./scripts/backup.sh`. Put `backups/` on a
different disk or rclone it off-box.

**`scripts/restore.sh <backup.gz>`** — `compose down` → gunzip + `docker cp` into
the volume as `app.db` → `compose up -d`. **Test restore monthly** — an untested
backup is not a backup.

---

## 13. Pre-expose checklist (replaces a full security audit)

**Skip entirely if the app only runs on `localhost`.** Run it before making the
app reachable from anything that isn't your machine, and again whenever you
change auth or add a dependency:

- [ ] One auth mode is in force and you **tested it by executing a request** —
      `curl http://<host>:3000/api/announcements` without a bearer → **401**.
- [ ] `.env` is not in git — `git ls-files | grep -E '(^|/)\.env'` returns only
      `.env.example`.
- [ ] `AUTH_TOKEN` was generated by a CSPRNG (`openssl rand -hex 32`), not typed.
- [ ] `ENABLE_SWAGGER=false` in the production `.env`.
- [ ] `bun audit` is clean.
- [ ] Reference feature deleted — `grep -rn "REFERENCE:" packages/` is empty.
- [ ] The reachability boundary you intend is the one you have (Tailscale
      `serve` / Caddy with a real domain + auto-TLS / host firewall blocks
      `3000/tcp` off-LAN). Don't port-forward to the open internet.
- [ ] Backups restored at least once.
- [ ] Built bundle scanned for stray secrets:
      `grep -r 'AKIA\|SECRET\|PRIVATE KEY' packages/frontend/dist/` is empty
      (finding `AUTH_TOKEN` is expected — it's baked in by design).

**Remote-access options, in order of effort:** Tailscale + `tailscale serve`
(5 min, auto-TLS) → Caddy reverse proxy (real domain, auto-TLS) → Cloudflare
Tunnel (free tier, WAF bonus). Public port-forwarding: don't.

---

## 14. Gotchas

| ID | Gotcha | Tag |
|----|--------|-----|
| G1 | `.env` must exist before anything runs | `[setup]` |
| G2 | Use `bun run test`, never bare `bun test` (frontend needs Vitest + jsdom) | `[dev]` |
| G3 | `docker compose up` does **not** hot-reload — use `bun run dev` for HMR | `[dev]` |
| G4 | Cross-cutting Elysia plugins must end with `.as('global')` | `[extend]` |
| G5 | Eden Treaty's first arg is a **domain**, not a path — never pass `/api` | `[extend]` |
| G6 | `/docs` is live whenever `ENABLE_SWAGGER=true` | `[deploy]` |
| G7 | Git hooks need `bunx lefthook install` + the `gitleaks` binary | `[setup]` |
| G8 | Dialogs/sheets need `DialogTitle` + `DialogDescription` (`sr-only` if decorative) | `[extend]` |
| G9 | `VITE_AUTH_TOKEN` ships in the bundle by design — never put other secrets behind a `VITE_` prefix | `[extend]` |
| G10 | Tag-pinned base images drift on rebuild — `bun audit` + scan before re-shipping | `[deploy]` |
| G11 | Keep `@elysiajs/*` on the same minor as `elysia` (Eden types track it) | `[extend]` |

---

## 15. What NOT to add (be aggressive about saying no)

- **Error trackers (Sentry/Datadog).** `docker compose logs -f` is the story.
- **A second datastore (Redis/Postgres).** SQLite + WAL handles the target scale.
- **A job queue.** A `setInterval` or host cron is fine; persist to a `jobs` table
  if work must survive restarts.
- **A users table / RBAC.** Not by default. See §16 if you genuinely go multi-user.
- **Multi-environment configs.** One box, one `.env`. Need dev/prod? Run a second
  compose project on another port.
- **A second frontend framework.** Vite + React + TanStack Query covers it.
- **A runtime `/api/config` endpoint.** Vite build-time env is fine.
- **CORS.** Same-origin (the Bun process serves the SPA). Don't add `@elysiajs/cors`.
- **A new design system.** The ~26 primitives + 3 patterns are the whole UI
  vocabulary — reach for them before writing custom components.

---

## 16. Escape hatches (when you outgrow a default)

One opinionated stack, but a few documented exits. These are *prose notes in
the template*, not toggles — you make the change by hand on the rare project
that needs it.

- **Real multi-user / sharing access** → add a `users` table, switch `authPlugin`
  to Mode C (or a real IdP: `jose` + JWKS), add ownership columns + checks to
  the resources that need them. Domain code shape is unchanged.
- **A separate service (Python/PyTorch inference, heavy native compute, any
  non-Bun runtime)** → it joins the private compose network *behind* the Bun
  process, which stays the single public surface. Publish no host port for it;
  the Bun app calls it over the internal network and reshapes its responses into
  the standard envelope (map upstream failures to a `BadGateway`/`ServiceUnavailable`
  `AppError`). The frontend never talks to it directly, so same-origin and the
  single auth gate are preserved. For long-running inference, pair it with the
  `jobs`-table pattern below (POST → job id → poll/stream).
- **Public internet exposure** → put Caddy/Cloudflare in front (§13), enable HSTS,
  tighten CSP, turn on the optional CI workflow as a second pair of eyes.
- **Outgrow SQLite (>~10 GB or you need real concurrency)** → Drizzle's
  Postgres driver; swap `db/index.ts` + the drizzle config; queries port over.
- **Scheduled work that must survive restarts** → a `jobs` table + a tick loop.

If you hit several of these at once, you've outgrown "a template" — that's a
real backend, and worth building deliberately.
```
