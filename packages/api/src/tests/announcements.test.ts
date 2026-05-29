// REFERENCE: safe to delete — tests for the reference feature.
import { describe, expect, it } from 'bun:test'
import { api, json } from './helpers'

describe('announcements (reference)', () => {
  it('lists with pagination meta', async () => {
    const body = await json(await api('/api/announcements?limit=10'))
    expect(body.ok).toBe(true)
    expect(body.meta.limit).toBe(10)
    expect(typeof body.meta.total).toBe('number')
  })

  it('creates then soft-deletes (exercises the relation)', async () => {
    const cats = await json(await api('/api/categories'))
    const categoryId = cats.data[0].id

    const created = await json(
      await api('/api/announcements', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ title: 'Test', body: 'Hello', categoryId }),
      }),
    )
    expect(created.ok).toBe(true)

    const del = await api(`/api/announcements/${created.data.id}`, { method: 'DELETE' })
    expect(del.status).toBe(200)
  })

  it('rejects invalid input with 422', async () => {
    const res = await api('/api/announcements', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ title: '' }),
    })
    expect(res.status).toBe(422)
  })

  it('rejects an unknown category with 400', async () => {
    const res = await api('/api/announcements', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ title: 'x', body: 'y', categoryId: 999999 }),
    })
    expect(res.status).toBe(400)
  })
})
