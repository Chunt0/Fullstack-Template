# Spec: announcements

- **status:** done @ dd329aa
- **tests:** packages/api/src/tests/announcements.test.ts
- **kind:** reference

> Worked example: this is the spec the shipped reference feature satisfies, so
> you can see the format applied to real code. `bun run eject:reference` removes
> it along with the feature. Copy `SPEC_TEMPLATE.md` for your own, not this.

## Goal

A list of announcements, each filed under a category, with create + delete. The
worked vertical slice that the whole template is shaped around.

## Out of scope

- Editing an announcement (create + soft-delete only).
- Managing categories from the UI (they're seeded; a read-only list feeds the
  create form's `<Select>`).
- Hard delete, pagination UI controls, search/filter, per-user ownership.

## Reference

This *is* the reference. The conventions it inherits, called out once: response
envelope (`ok()` / `AppError`), auth Mode B (`lib/auth.ts`), `lib/pagination.ts`,
`lib/schemas.ts` (`idParam`), `lib/env.ts`.

## Data model  → `db/schema.ts`

```
categories(
  id         integer pk autoincrement,
  name       text not null unique,
  createdAt  text default current_timestamp
)

announcements(
  id          integer pk autoincrement,
  title       text not null,
  body        text not null,
  categoryId  integer not null references categories(id),   -- the relation
  createdAt   text default current_timestamp,
  deletedAt   text null                                     -- soft delete
)
```

Seed (idempotent): a handful of categories + a few announcements.

## API contract  → `routes/announcements.ts`, `routes/categories.ts`

Registered in `routes/index.ts`.

| Method | Path | Request | Success | Errors |
|--------|------|---------|---------|--------|
| GET | `/api/announcements` | query: `paginationQuery` | `ok(Row[], pageMeta)` — joined to category, `deletedAt IS NULL`, newest first | — |
| POST | `/api/announcements` | body: `{ title 1–200, body 1–5000, categoryId number }` | `ok(Row)` | **400** unknown `categoryId`, **422** invalid body |
| DELETE | `/api/announcements/:id` | params: `idParam` | `ok({ id, deleted: true })` (sets `deletedAt`) | **404** not found / already deleted |
| GET | `/api/categories` | — | `ok(Category[])` (name asc) — feeds the form | — |

`Row` = `{ id, title, body, categoryId, categoryName, createdAt }`.

## UI  → `pages/AnnouncementsPage.tsx`

One entry in `routes.manifest.ts` (`Megaphone` icon).

- `PageHeader` (title + "New" button) + `DataTable` + `FormDialog` (create) +
  `ConfirmDialog` (destructive delete).
- Columns: Title (bold), Category (`Badge`), Created (locale date), row delete
  action (icon button, `aria-label`).
- Form fields: Title (`Input`, maxLength 200), Body (`Textarea`, maxLength 5000),
  Category (`Select` populated from `/api/categories`).
- States: loading skeleton / empty ("No announcements") / error with retry.
  Toast on create/delete success + error.

## Acceptance  → `tests/announcements.test.ts`

- [x] unauthed request → **401** (covered by `auth.test.ts` via `/api/me`)
- [x] list response carries `meta.total` / `meta.limit` / `meta.offset`
- [x] POST with empty title → **422**
- [x] POST with unknown `categoryId` → **400**
- [x] create then DELETE → row soft-deleted (gone from list, `deletedAt` set)
