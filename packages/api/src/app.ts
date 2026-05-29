import { existsSync } from 'node:fs'
import { staticPlugin } from '@elysiajs/static'
import { swagger } from '@elysiajs/swagger'
import { Elysia } from 'elysia'
import { authPlugin } from './lib/auth'
import { correlationPlugin, REQUEST_ID_HEADER } from './lib/correlation'
import { env } from './lib/env'
import { AppError } from './lib/errors'
import { logger } from './lib/logger'
import { errorResponse, ok } from './lib/response'
import { routes } from './routes'

const SECURITY_HEADERS: Record<string, string> = {
  'x-content-type-options': 'nosniff',
  'x-frame-options': 'DENY',
  'referrer-policy': 'no-referrer',
  'permissions-policy': 'camera=(), microphone=(), geolocation=()',
  // connect-src is explicit: with same-origin (the default) 'self' is correct.
  // For split-origin (a non-empty VITE_API_URL) widen it to that origin AND add
  // CORS on the API — see GOTCHAS G13.
  'content-security-policy':
    "default-src 'self'; connect-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'",
}

export const app = new Elysia()
  .use(correlationPlugin)
  // onRequest runs before routing, so this applies to EVERY response — including
  // 401/404/500/validation errors and unmatched routes (onAfterHandle would only
  // run on success). Sets the correlation id + all security headers.
  .onRequest(({ request, set }) => {
    set.headers[REQUEST_ID_HEADER] =
      request.headers.get(REQUEST_ID_HEADER) ?? crypto.randomUUID()
    for (const [k, v] of Object.entries(SECURITY_HEADERS)) set.headers[k] = v
  })
  .onError(({ error, code, set, request }) => {
    const requestId =
      (set.headers[REQUEST_ID_HEADER] as string | undefined) ??
      request.headers.get(REQUEST_ID_HEADER) ??
      'unknown'

    if (error instanceof AppError) {
      set.status = error.statusCode
      logger.warn({ requestId, code: error.code }, error.message)
      return errorResponse(error.code, error.expose ? error.message : 'Something went wrong', requestId)
    }
    if (code === 'VALIDATION') {
      set.status = 422
      return errorResponse('VALIDATION', 'Invalid request', requestId)
    }
    if (code === 'NOT_FOUND') {
      set.status = 404
      return errorResponse('NOT_FOUND', 'Not found', requestId)
    }
    set.status = 500
    logger.error(
      { requestId, err: error instanceof Error ? (error.stack ?? error.message) : String(error) },
      'unhandled error',
    )
    return errorResponse('INTERNAL', 'Something went wrong', requestId)
  })
  .use(authPlugin)
  .get('/api/health', () => ok({ status: 'ok', uptime: process.uptime() }))
  // whoami — protected; also the stable target for the auth test.
  .get('/api/me', ({ user }) => ok({ user }))
  .use(routes)

// Swagger dev docs — gated by env, doesn't affect the App type.
if (env.ENABLE_SWAGGER) {
  app.use(swagger({ path: '/docs', documentation: { info: { title: 'App API', version: '0.0.0' } } }))
}

// In the container STATIC_DIR points at the built SPA: serve it + SPA fallback.
const staticDir = env.STATIC_DIR
if (staticDir && existsSync(staticDir)) {
  app.use(staticPlugin({ assets: staticDir, prefix: '/' }))
  app.get('/*', ({ request, set }) => {
    if (new URL(request.url).pathname.startsWith('/api')) {
      set.status = 404
      return errorResponse('NOT_FOUND', 'Not found', 'unknown')
    }
    return Bun.file(`${staticDir}/index.html`)
  })
}

// The type Eden Treaty consumes on the frontend — full API surface, no codegen.
export type App = typeof app
