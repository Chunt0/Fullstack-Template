import { describe, expect, it } from 'bun:test'
import { api } from './helpers'

const SECURITY_HEADERS = [
  'content-security-policy',
  'x-frame-options',
  'x-content-type-options',
  'referrer-policy',
  'permissions-policy',
]

function assertHeaders(res: Response) {
  for (const h of SECURITY_HEADERS) expect(res.headers.has(h)).toBe(true)
  expect(res.headers.get('x-request-id')).toBeTruthy()
}

// Regression guard: headers must be present on errors too, not just 200s.
describe('security headers + correlation id', () => {
  it('on success (200)', async () => {
    const res = await api('/api/health', {}, false)
    expect(res.status).toBe(200)
    assertHeaders(res)
  })

  it('on auth failure (401)', async () => {
    const res = await api('/api/me', {}, false)
    expect(res.status).toBe(401)
    assertHeaders(res)
  })

  it('on not-found (404)', async () => {
    const res = await api('/api/nope') // authed → routes to 404, not 401
    expect(res.status).toBe(404)
    assertHeaders(res)
  })
})
