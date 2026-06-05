# Architecture

## Topology

```
            ┌───────────────────────────────────────────┐
 browser ─► │  Bun process (the only public surface)     │
  (SPA)     │   • serves the built SPA (@elysiajs/static) │
            │   • /api/* routes (Elysia) + auth + envelope│
            │   • SQLite via Drizzle (WAL)                │
            └───────────────────────────────────────────┘
```

One process, one origin, no CORS, no nginx. In production the Bun process serves
the built SPA from `STATIC_DIR` and falls back to `index.html` for client routes;
`/api/*` is handled before the fallback. In dev, Vite serves the SPA on `:3000`
and proxies `/api` to the API on `:4000`.

## Key decisions

- **Single gateway.** Serving the SPA from the API process removes a whole
  service (nginx) and gives same-origin for free. If you later add a different-
  runtime service (e.g. Python inference), put it behind this process on a private
  network — see Escape hatches.
- **Eden Treaty, no codegen.** The frontend imports `type { App }` from the API
  package; the full request/response surface is inferred. This is why routes are
  registered in an explicit barrel (`routes/index.ts`), not a runtime glob — a
  glob would erase the static types.
- **Response envelope + typed errors.** Every response is `{ ok, data, meta? }` or
  `{ ok:false, error:{ code, message, requestId } }`. Handlers return `ok(...)` or
  throw an `AppError`; the global `onError` maps it. Correlation IDs (`X-Request-ID`)
  thread through logs and error bodies.
- **SQLite + WAL.** One file, comfortable to ~10 GB. Migrations run on boot;
  the seed is idempotent.
- **Auth is the one pluggable axis.** Ships Mode B (below).

## Auth modes

- **Mode A — none.** Make `lib/auth.ts`'s derive return `{ user: { id: 'me' } }`
  unconditionally. LAN/localhost only.
- **Mode B — shared bearer (shipped).** `AUTH_TOKEN` gates every `/api/*` route
  except `/api/health`; the same token is baked into the SPA as `VITE_AUTH_TOKEN`.
  Recoverable from the bundle by design — it stops opportunistic scanning, not
  credential theft; the bundle is only served where the token already reaches.
- **Mode C — login + cookie.** Add `/api/login` comparing a password to an
  argon2id hash, set a signed `httpOnly` cookie, validate it in `lib/auth.ts`.
  ~60 lines; not shipped.

## Environment variables

See `.env.example`. Required: `DATABASE_PATH`, `AUTH_TOKEN`, `NODE_ENV`.
Build-time (SPA): `VITE_API_URL` (empty = same-origin), `VITE_AUTH_TOKEN` (= `AUTH_TOKEN`), `VITE_APP_NAME` (display name).
Optional: `ENABLE_SWAGGER`, `LOG_LEVEL`. `init-project.sh` sets the token (in both
places) and the display name. The `@app/*` workspace scope is fixed and not renamed.

## Deploy, data, backups

```bash
git clone <repo> myapp && cd myapp
scripts/init-project.sh myapp
docker compose up -d --build          # http://<host>:3000
```

- Data lives in the `app-data` Docker volume (`/data/app.db`). Logs → stdout
  (`docker compose logs -f`).
- `./scripts/backup.sh` writes a gzipped `VACUUM INTO` snapshot to `backups/`
  (cron: `0 3 * * * cd /opt/myapp && ./scripts/backup.sh`). Keep `backups/` on a
  different disk or rclone it off-box.
- `./scripts/restore.sh backups/app-….db.gz` restores. **Test restore monthly.**
- Update: `git pull && docker compose up -d --build` (migrations run on boot).

## Pre-expose checklist

Skip if the app only runs on `localhost`. Run before reaching it from any other
device, and again whenever you change auth or add a dependency. **`bun run
preflight`** runs the mechanizable items below (marked ⚙) and exits non-zero on
any failure; the rest you verify by hand.

- [ ] Auth tested by executing a request: unauthed `/api/...` returns **401**.
- [ ] ⚙ `.env` is not in git, Swagger off, `AUTH_TOKEN` ≥ 32 chars, reference
      ejected, bundle has no stray secrets, `bun audit` clean — `bun run preflight`.
- [ ] `.env` is not in git (`git ls-files | grep -E '(^|/)\.env'` → only `.env.example`).
- [ ] `AUTH_TOKEN` came from `openssl rand -hex 32`, not typed by hand.
- [ ] `ENABLE_SWAGGER=false`.
- [ ] `bun audit` is clean.
- [ ] Reference feature ejected (`bun run check:reference`).
- [ ] Reachability is what you intend: Tailscale `serve` / Caddy + real domain +
      auto-TLS / host firewall blocks `3000/tcp` off-LAN. Don't port-forward to
      the open internet.
- [ ] A backup has been restored at least once.
- [ ] Built bundle has no stray secrets (`grep -r 'AKIA\|SECRET\|PRIVATE KEY'
      packages/frontend/dist/` is empty; finding `AUTH_TOKEN` is expected).

## Escape hatches (when you outgrow a default)

- **A separate service (Python/ML inference, heavy native compute, any non-Bun
  runtime).** Add it to `docker-compose.yml` on the private network, **publish no
  host port**; the Bun process stays the only public surface and calls it over the
  internal network, reshaping responses into the envelope (map upstream failures
  to `BadGatewayError`/`ServiceUnavailableError`). The SPA never talks to it
  directly — same-origin and the single auth gate are preserved. For long-running
  inference, pair with a `jobs` table (POST → job id → poll/stream).
- **Real multi-user / sharing.** Add a `users` table, switch to Mode C or a real
  IdP (`jose` + JWKS), add ownership columns + checks.
- **Outgrow SQLite.** Swap to Drizzle's Postgres driver (`db/index.ts` + config);
  queries port over.
- **Scheduled work that survives restarts.** A `jobs` table + a tick loop.

If several of these become true at once, you've outgrown "a template."
