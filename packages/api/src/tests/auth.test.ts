import { describe, expect, it } from 'bun:test'
import { api, json } from './helpers'

// Probes /api/me (a permanent protected endpoint) so this stays valid after the
// reference feature is ejected.
describe('auth (mode B shared bearer)', () => {
  it('401s without a token', async () => {
    const res = await api('/api/me', {}, false)
    expect(res.status).toBe(401)
    const body = await json(res)
    expect(body.ok).toBe(false)
    expect(body.error.code).toBe('UNAUTHORIZED')
    expect(typeof body.error.requestId).toBe('string')
  })

  it('401s with a wrong token', async () => {
    const res = await api('/api/me', { headers: { authorization: 'Bearer wrong' } }, false)
    expect(res.status).toBe(401)
  })

  it('200s with the right token', async () => {
    const res = await api('/api/me')
    expect(res.status).toBe(200)
    const body = await json(res)
    expect(body.ok).toBe(true)
    expect(body.data.user.id).toBe('me')
  })
})
