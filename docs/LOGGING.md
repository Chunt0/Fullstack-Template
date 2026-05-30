# Logging

One structured logger, [pino](https://getpino.io), shared across the API. Logs go
to **stdout** — in the container, `docker compose logs -f` is your log stream. No
log files, no second logging system.

## The logger

`packages/api/src/lib/logger.ts` exports a single `logger`. Import it anywhere in
the API:

```ts
import { logger } from '../lib/logger'
```

Behaviour by environment:

| Env | Output | Level |
|-----|--------|-------|
| `test` | silent | `silent` (keeps the test suite quiet) |
| `development` | pretty, colorized, `HH:MM:ss` via `pino-pretty` | `LOG_LEVEL` |
| `production` | raw JSON, one line per event (for log collectors) | `LOG_LEVEL` |

Level is `env.LOG_LEVEL` (`.env`, default `info`; one of
`trace|debug|info|warn|error`). Per the env convention, only `lib/env.ts` reads
`process.env` — add new log-related vars there if you ever need them.

## Calling convention (read this)

pino is **object first, message second**. The metadata object is the first
argument; the human string is the second:

```ts
logger.info({ requestId, userId }, 'created announcement')   // correct
logger.error({ requestId, err }, 'unhandled error')          // correct

logger.info('created announcement', { requestId })           // WRONG: 2nd arg is dropped
```

Put structured fields in the object so they stay queryable in JSON; keep the
message a short constant string.

## Correlation: trace one request end to end

Every response carries an `x-request-id` header (set in `app.ts` `onRequest`,
exposed as `requestId` on the handler context by `lib/correlation.ts`). That same
id is attached to error logs **and** returned in the error envelope
(`error.requestId`). To trace a request, grep its id:

```bash
docker compose logs api | grep <request-id>
```

When you log inside a route, include `requestId` so your line joins the trace:

```ts
.post('/', ({ body, requestId }) => {
  const created = db.insert(announcements).values(body).returning().get()
  logger.info({ requestId, id: created.id }, 'announcement created')
  return ok(created)
})
```

## What is logged today

| Where | Level | Event |
|-------|-------|-------|
| `index.ts` | info | boot ("API listening"), shutdown signal |
| `app.ts` `onError` | warn | any thrown `AppError` (with `requestId`, `code`) |
| `app.ts` `onError` | error | unhandled 500s (with `requestId` + stack) |
| `db/migrate.ts` | info/warn | migration lifecycle |
| `db/seed.ts` | info | seed complete |

`AppError`s are warnings (expected, client-facing); only genuinely unexpected
failures are `error`. The global `onError` already logs both — **do not** also
`logger.error` inside a route before throwing, or you double-log.

## Deliberate non-logging

- **`lib/env.ts` uses raw `console.error`** before `process.exit(1)`. That is
  on purpose: env validation fails fast at boot, before the logger config is
  trustworthy. Leave it.
- **Framework `VALIDATION` / `NOT_FOUND` errors** return an envelope but are not
  logged (they are routine client mistakes, not incidents).
- **Frontend** (`components/ErrorBoundary.tsx`) only `console.error`s in the
  browser. Client errors stay in the user's devtools; nothing reaches the server.

## Adding to it (only if you actually need it)

The template logs errors, not traffic. These are the common extensions, listed so
you copy the existing shape instead of inventing one:

- **Access log (one line per request).** Add an `onAfterResponse` in `app.ts` that
  logs `method`, `path`, `status`, duration, and `requestId`. Capture a start time
  in `onRequest`. This is the highest-value addition if you need request visibility.
- **Per-request child logger.** In `lib/correlation.ts`, also derive
  `log: logger.child({ requestId })` so handlers call `log.info('...')` without
  passing `requestId` every time.
- **Ship frontend errors to the server.** Add an `/api/client-logs` route that
  accepts a small validated payload (message, stack, url) and writes it via
  `logger`, then POST to it from `ErrorBoundary.componentDidCatch`. Decide whether
  it sits behind the bearer auth (logs only when authenticated) or is public with
  input caps (also captures pre-login crashes).

Keep any addition within the existing conventions: structured object-first calls,
`requestId` on every line, stdout only.
