import { t } from 'elysia'
import type { PageMeta } from './response'

export const DEFAULT_LIMIT = 50
export const MAX_LIMIT = 200

// Drop this into a route's `query` schema to get validated, coerced pagination.
// t.Numeric coerces the inbound string query params to numbers.
export const paginationQuery = t.Object({
  limit: t.Optional(t.Numeric({ minimum: 1, maximum: MAX_LIMIT })),
  offset: t.Optional(t.Numeric({ minimum: 0 })),
})

export function resolvePagination(q: { limit?: number; offset?: number }): {
  limit: number
  offset: number
} {
  return { limit: q.limit ?? DEFAULT_LIMIT, offset: q.offset ?? 0 }
}

export function pageMeta(total: number, limit: number, offset: number): PageMeta {
  return { total, limit, offset }
}
