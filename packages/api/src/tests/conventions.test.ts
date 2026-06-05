import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { describe, expect, it } from 'bun:test'

// ── Convention fitness gates ──────────────────────────────────────────────
// The conventions in CLAUDE.md are only real if a failing build enforces them.
// These are deliberately cheap, grep-style structural checks — not a type
// system. They catch the obvious "forgot the pattern" mistakes an agent makes
// across sessions. (Soft-delete filtering is intentionally NOT gated here: a
// static check for "every query on a deletedAt table filters isNull(...)" is
// too brittle and false-positive-prone to be worth the alert fatigue — it's a
// documented convention in CLAUDE.md instead.)

function repoRoot(): string {
  let dir = import.meta.dir
  for (let i = 0; i < 8; i++) {
    if (existsSync(join(dir, 'package.json')) && existsSync(join(dir, 'specs'))) return dir
    dir = dirname(dir)
  }
  throw new Error('could not locate repo root')
}

const ROOT = repoRoot()
const API_SRC = join(ROOT, 'packages/api/src')

function walk(dir: string, ext: RegExp): string[] {
  const out: string[] = []
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) out.push(...walk(full, ext))
    else if (ext.test(entry.name)) out.push(full)
  }
  return out
}

describe('conventions / fitness gates', () => {
  it('only lib/env.ts reads process.env (outside tests)', () => {
    const offenders = walk(API_SRC, /\.ts$/)
      .filter((f) => !f.includes('/tests/') && !f.endsWith('/lib/env.ts'))
      .filter((f) => /process\.env/.test(readFileSync(f, 'utf8')))
      .map((f) => f.slice(ROOT.length + 1))
    expect(offenders, 'route process.env access through lib/env.ts').toEqual([])
  })

  const routeFiles = walk(join(API_SRC, 'routes'), /\.ts$/).filter(
    (f) => !f.endsWith('/index.ts'),
  )

  for (const file of routeFiles) {
    const rel = file.slice(ROOT.length + 1)
    const src = readFileSync(file, 'utf8')

    describe(rel, () => {
      it('returns responses via ok() (the envelope, not a bare object)', () => {
        expect(/\bok\(/.test(src), `${rel}: handlers must return ok(...)`).toBe(true)
      })

      it('validates request bodies on mutations', () => {
        const mutates = /\.(post|put|patch)\(/.test(src)
        if (mutates) {
          expect(/body:\s*(t\.|[A-Za-z])/.test(src), `${rel}: add a "body:" schema`).toBe(true)
        }
      })
    })
  }
})

// ── Docs-as-context gate ──────────────────────────────────────────────────
// WIRED.md tells the agent "if it's here, don't rebuild it" — so every file it
// points at must exist. (This gate is what would have caught the stale
// lib/correlation.ts reference.)
describe('WIRED.md points only at files that exist', () => {
  const wired = readFileSync(join(ROOT, 'WIRED.md'), 'utf8')
  const roots = [ROOT, API_SRC, join(ROOT, 'packages/frontend/src')]

  const tokens = [...wired.matchAll(/`([^`]+)`/g)]
    .flatMap((m) => m[1].split(/[\s,]+/))
    // keep only path-like tokens: a source/script file, or a directory
    .filter((t) => /\.(ts|tsx|sh)$/.test(t) || t.endsWith('/'))

  it('extracts some referenced paths', () => {
    expect(tokens.length).toBeGreaterThan(5)
  })

  for (const token of [...new Set(tokens)]) {
    it(`resolves: ${token}`, () => {
      const found = roots.some((r) => {
        const p = join(r, token)
        return existsSync(p) && (token.endsWith('/') ? statSync(p).isDirectory() : true)
      })
      expect(found, `WIRED.md references "${token}" but it doesn't exist`).toBe(true)
    })
  }
})
