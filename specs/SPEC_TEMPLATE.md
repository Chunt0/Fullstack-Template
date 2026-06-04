# Spec: <resource>

- **status:** draft   <!-- draft → building → done @ <short-commit> -->
- **tests:**          <!-- e.g. packages/api/src/tests/<resource>.test.ts (fill when done) -->
- **kind:** feature   <!-- feature | reference | archive -->

> Copy this file to `specs/<resource>.md`, fill it in, hand it to the agent:
> *"Implement specs/<resource>.md per CLAUDE.md."* Delete the HTML comments as
> you go. See `specs/README.md` for the why.

## Goal

One sentence: what this resource is for and who uses it.

## Out of scope

- What this feature does **not** do (bounds the agent — be explicit).
- Anything from CLAUDE.md → "Don't add" that someone might reach for here.

## Reference

Mirror the shape of the reference feature, with the deltas below:

- API: `routes/announcements.ts` + `routes/categories.ts`
- Hook: `hooks/use-announcements.ts`
- Page: `pages/AnnouncementsPage.tsx`
- Conventions inherited (do **not** restate): response envelope (`ok()` /
  `AppError`), `lib/env.ts`, auth Mode B, `lib/pagination.ts`, `lib/schemas.ts`.

## Data model  → `db/schema.ts` (then `bun run db:generate`)

```
<resource>(
  id          integer pk autoincrement,
  <col>       <type> <constraints>,
  createdAt   text default current_timestamp,
  deletedAt   text null            -- include only if soft-delete
)
```

Relations / indexes / seed rows (idempotent, in `db/seed.ts`): …

## API contract  → `routes/<resource>.ts` (register in `routes/index.ts`)

Every input validated with `t`; every response `ok(...)` or a thrown `AppError`.

| Method | Path | Request | Success | Errors |
|--------|------|---------|---------|--------|
| GET | `/api/<r>` | query: `paginationQuery` | `ok(Row[], pageMeta)` | — |
| POST | `/api/<r>` | body: `t.Object({ ...exact... })` | `ok(Row)` | 400 `<when>`, 422 invalid |
| DELETE | `/api/<r>/:id` | params: `idParam` | `ok({ id, deleted: true })` | 404 not found |

`Row` shape (what the client receives): `{ id, …, createdAt }`.

## UI  → `pages/<R>Page.tsx` (add one entry to `routes.manifest.ts`)

- Compose: `PageHeader` + `DataTable` + `FormDialog` (create) + `ConfirmDialog`
  (delete). See `docs/DESIGN_SYSTEM.md`.
- Columns: …
- Form fields: …  (match the POST body)
- States: loading skeleton / empty (`"<message>"`) / error with retry.

## Acceptance  → becomes `tests/<resource>.test.ts`, 1:1

Each box is one assertion. Keep them concrete and runnable.

- [ ] unauthed request → **401**
- [ ] list response carries `meta.total` / `meta.limit` / `meta.offset`
- [ ] POST with invalid body → **422**
- [ ] POST violating `<rule>` → **400**
- [ ] create then DELETE → row is soft-deleted (hidden from list, `deletedAt` set)
- [ ] <one row per domain rule worth pinning>
