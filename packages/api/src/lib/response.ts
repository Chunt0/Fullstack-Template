// The one response shape. Every handler returns ok(...) (or throws an AppError,
// which the global onError turns into the error envelope). Type the handler's
// return as Envelope<T> and a bare object won't compile — the convention is
// enforced by the compiler, not by docs.

export type Meta = Record<string, unknown>

export interface PageMeta extends Meta {
  total: number
  limit: number
  offset: number
}

export interface OkEnvelope<T> {
  ok: true
  data: T
  meta?: Meta
}

export interface ErrEnvelope {
  ok: false
  error: { code: string; message: string; requestId: string }
}

export type Envelope<T> = OkEnvelope<T> | ErrEnvelope

export function ok<T>(data: T, meta?: Meta): OkEnvelope<T> {
  return meta ? { ok: true, data, meta } : { ok: true, data }
}

export function errorResponse(code: string, message: string, requestId: string): ErrEnvelope {
  return { ok: false, error: { code, message, requestId } }
}
