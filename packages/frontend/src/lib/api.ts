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

/** Unwrap the response envelope or throw a useful Error for TanStack Query. */
export async function unwrap<T>(
  promise: Promise<{ data: unknown; error: unknown; status: number }>,
): Promise<T> {
  const res = await promise
  if (res.error) {
    const body = res.error as { value?: { error?: { message?: string } } }
    throw new Error(body?.value?.error?.message ?? `Request failed (${res.status})`)
  }
  const envelope = res.data as { ok: boolean; data: T }
  return envelope.data
}
