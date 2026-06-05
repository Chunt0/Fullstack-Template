import { treaty } from '@elysiajs/eden'
import type { App } from '@app/api'

// Type-safe API client. `App` is a type-only import of the Elysia app — no
// codegen; the full request/response surface is inferred. The first arg is a
// DOMAIN, never a path (GOTCHAS G5): empty VITE_API_URL = same-origin.
const origin = import.meta.env.VITE_API_URL || window.location.origin
const token = import.meta.env.VITE_AUTH_TOKEN

// `.api` roots the client at /api so calls read as api.announcements.get(), etc.
export const api = treaty<App>(origin, {
  headers() {
    return token ? { authorization: `Bearer ${token}` } : {}
  },
}).api

/**
 * Unwrap the response envelope or throw a useful Error for TanStack Query.
 *
 * The payload type is INFERRED from the endpoint — `D` is the `ok(...)` envelope
 * Eden inferred from the route handler, and we return its inner `data`. Don't
 * pass a type argument: `unwrap(api.x.get())` types itself from the API, so a
 * route whose response shape changes makes the caller stop compiling. (Pair with
 * `Payload<…>` below to name that type without re-declaring it by hand.)
 */
export async function unwrap<D extends { ok: true; data: unknown }>(
  promise: Promise<{ data: D | null; error: unknown; status: number }>,
): Promise<D['data']> {
  const res = await promise
  if (res.error) {
    const body = res.error as { value?: { error?: { message?: string } } }
    throw new Error(body?.value?.error?.message ?? `Request failed (${res.status})`)
  }
  return (res.data as D).data
}

/**
 * The success payload type of an Eden Treaty endpoint method — i.e. the `T` in
 * the route's `ok(T)`. Derive entity types from the API instead of hand-writing
 * an interface that can silently drift:
 *
 *   type Announcement = Payload<typeof api.announcements.get>[number]
 */
export type Payload<F extends (...args: never[]) => Promise<{ data: unknown }>> =
  NonNullable<Awaited<ReturnType<F>>['data']> extends { ok: true; data: infer P } ? P : never
