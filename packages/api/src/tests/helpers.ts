import { app } from '../app'

const TOKEN = process.env.AUTH_TOKEN ?? 'test-token'

// Drive the app in-process (no network) via app.handle(Request).
export function api(path: string, init: RequestInit = {}, auth = true): Promise<Response> {
  const headers = new Headers(init.headers)
  if (auth && !headers.has('authorization')) headers.set('authorization', `Bearer ${TOKEN}`)
  return app.handle(new Request(`http://localhost${path}`, { ...init, headers }))
}

export async function json<T = any>(res: Response): Promise<T> {
  return (await res.json()) as T
}
