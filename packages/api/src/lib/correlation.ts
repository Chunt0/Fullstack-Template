import { Elysia } from 'elysia'

export const REQUEST_ID_HEADER = 'x-request-id'

// The X-Request-ID header itself is set in app.ts `onRequest` (so it applies to
// every request, including unmatched routes). This plugin just exposes that id
// as `requestId` on the handler context for convenience.
export const correlationPlugin = new Elysia({ name: 'correlation' }).derive(
  { as: 'global' },
  ({ set }) => ({
    requestId: (set.headers[REQUEST_ID_HEADER] as string | undefined) ?? 'unknown',
  }),
)
