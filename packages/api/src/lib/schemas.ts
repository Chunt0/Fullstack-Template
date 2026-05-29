import { t } from 'elysia'

// Reusable Elysia `t` validators. Import these instead of re-declaring shapes.

/** Numeric `:id` path param, coerced from the URL string. */
export const idParam = t.Object({ id: t.Numeric() })

/** Timestamp fields as they appear in API responses (SQLite stores ISO text). */
export const timestampFields = {
  createdAt: t.String(),
}
