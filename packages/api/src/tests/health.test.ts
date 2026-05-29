import { describe, expect, it } from 'bun:test'
import { api, json } from './helpers'

describe('health', () => {
  it('is public and returns ok', async () => {
    const res = await api('/api/health', {}, false)
    expect(res.status).toBe(200)
    const body = await json(res)
    expect(body.ok).toBe(true)
    expect(body.data.status).toBe('ok')
  })
})
