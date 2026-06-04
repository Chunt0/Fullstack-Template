import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { describe, expect, it } from 'bun:test'

// ── Spec drift guard ──────────────────────────────────────────────────────
// Asserts the specs/ workflow stays honest (see specs/README.md):
//   • every spec is well-formed (a status line + an Acceptance section);
//   • every spec marked `done` carries a commit stamp AND its `tests:` file(s)
//     exist — a done spec whose tests vanished is a build failure.
// `kind: archive` is skipped entirely; `kind: reference` is structural-only
// (it's removed by `bun run eject:reference`).

function repoRoot(): string {
  let dir = import.meta.dir
  // Walk up to the directory that holds both package.json and specs/.
  for (let i = 0; i < 8; i++) {
    if (existsSync(join(dir, 'package.json')) && existsSync(join(dir, 'specs'))) return dir
    dir = dirname(dir)
  }
  throw new Error('could not locate repo root (a dir with package.json + specs/)')
}

const SPECS_DIR = join(repoRoot(), 'specs')
const SKIP_FILES = new Set(['SPEC_TEMPLATE.md', 'README.md'])

function meta(body: string, key: string): string | null {
  const m = body.match(new RegExp(`\\*\\*${key}:\\*\\*\\s*(.+)`))
  if (!m) return null
  return m[1].replace(/<!--.*?-->/g, '').trim()
}

const specFiles = readdirSync(SPECS_DIR).filter((f) => f.endsWith('.md') && !SKIP_FILES.has(f))

describe('specs/ drift guard', () => {
  it('there is at least one spec to check', () => {
    expect(specFiles.length).toBeGreaterThan(0)
  })

  for (const file of specFiles) {
    const body = readFileSync(join(SPECS_DIR, file), 'utf8')
    const status = meta(body, 'status') ?? ''
    const kind = meta(body, 'kind') ?? 'feature'

    if (kind === 'archive') continue

    describe(file, () => {
      it('declares a status', () => {
        expect(status, `${file} needs a "- **status:** …" line`).not.toBe('')
      })

      it('has an Acceptance section', () => {
        expect(body, `${file} needs an "## Acceptance" section`).toContain('## Acceptance')
      })

      if (status.startsWith('done') && kind !== 'reference') {
        it('done spec is stamped with a commit', () => {
          expect(status, `${file}: use "done @ <short-commit>"`).toMatch(/done @ \w+/)
        })

        it('done spec points at test file(s) that exist', () => {
          const tests = (meta(body, 'tests') ?? '')
            .split(/[\s,]+/)
            .filter((p) => p.includes('/'))
          expect(tests.length, `${file}: a done spec must list its tests:`).toBeGreaterThan(0)
          for (const rel of tests) {
            expect(existsSync(resolve(repoRoot(), rel)), `${file} → missing ${rel}`).toBe(true)
          }
        })
      }
    })
  }
})
