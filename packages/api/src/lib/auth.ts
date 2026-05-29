import { timingSafeEqual } from 'node:crypto'
import { Elysia } from 'elysia'
import { env } from './env'
import { UnauthorizedError } from './errors'

// ── Auth Mode B: shared bearer token ─────────────────────────────────────
// Every /api/* route except the public allowlist requires
//   Authorization: Bearer <AUTH_TOKEN>
// Non-/api paths (the SPA + its assets) are public. To switch to Mode A
// (no auth), make the derive return `{ user: { id: 'me' } }` unconditionally.
// See SEED_SPEC §3 for Mode C (login + cookie).

export type User = { id: string } | null

const PUBLIC_API_PATHS = new Set(['/api/health'])

function tokenMatches(provided: string): boolean {
  const a = Buffer.from(provided)
  const b = Buffer.from(env.AUTH_TOKEN)
  return a.length === b.length && timingSafeEqual(a, b)
}

export const authPlugin = new Elysia({ name: 'auth' }).derive(
  { as: 'global' },
  ({ request }): { user: User } => {
    const path = new URL(request.url).pathname
    const isApi = path.startsWith('/api/')

    if (!isApi || PUBLIC_API_PATHS.has(path)) return { user: null }

    const header = request.headers.get('authorization') ?? ''
    const token = header.startsWith('Bearer ') ? header.slice(7) : ''
    if (!token || !tokenMatches(token)) throw new UnauthorizedError()

    return { user: { id: 'me' } }
  },
)
