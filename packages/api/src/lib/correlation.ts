import { Elysia } from 'elysia'

export const REQUEST_ID_HEADER = 'x-request-id'

// Reads an inbound X-Request-ID or generates one, exposes it on the context as
// `requestId`, and echoes it on the response. Logged on every request + error.
export const correlationPlugin = new Elysia({ name: 'correlation' }).derive(
  { as: 'global' },
  ({ request, set }) => {
    const requestId = request.headers.get(REQUEST_ID_HEADER) ?? crypto.randomUUID()
    set.headers[REQUEST_ID_HEADER] = requestId
    return { requestId }
  },
)
