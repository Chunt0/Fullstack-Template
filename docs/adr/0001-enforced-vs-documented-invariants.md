# 1. Enforced vs. documented invariants

- **Status:** accepted
- **Date:** 2026-06-05

## Context

This template's value proposition is "the architecture is decided once and
*enforced*, so every feature is the same boring shape." The sole builder and
maintainer is an AI coding agent, which forgets conventions between sessions but
cannot bypass a failing build. So an invariant that is only written in prose is,
in practice, optional — it survives exactly until the session that doesn't recall
it.

A review found that several rules CLAUDE.md described as "enforced" were actually
conventions with no mechanical gate:

- "return `ok()`, never a bare object" — nothing failed on a bare return.
- "validate every input with `t`" — a route with no `body:` schema passed `check`.
- "only `lib/env.ts` reads `process.env`" — a stray `process.env` passed `check`.
- "end-to-end type safety" held for the **request** direction (Eden infers path /
  query / body) but **not the response**: `unwrap<T>` took a caller-supplied `T`
  and cast `res.data`, and each hook re-declared the entity shape by hand. A route
  whose response projection changed left those hand-written types — and their
  callers — compiling against a stale shape. Three independent declarations
  existed for one entity (Drizzle row, route projection, frontend interface).

`WIRED.md` (an agent-facing "if it's here, don't rebuild it" index) also pointed
at a file that did not exist.

## Decision

We will treat every load-bearing invariant as belonging to exactly one of three
enforcement classes, and record which class it is next to the rule.

1. **Type-enforced** — the compiler rejects violations. We will keep the response
   contract here: `unwrap` infers the payload from Eden's response and entity
   types are derived from the API (`Payload<typeof api.x.get>`), never
   hand-written. Renaming or dropping a route field must break the caller's
   `type-check`.

2. **Gated by a fitness function** — `tests/conventions.test.ts` (part of
   `bun run check`) fails the build on violation. We will gate the invariants that
   are cheaply and reliably checkable by structure:
   - only `lib/env.ts` reads `process.env`;
   - every route file returns via `ok(`;
   - every mutation route (`post`/`put`/`patch`) declares a `body:` schema;
   - every path referenced in `WIRED.md` exists.

3. **Documented convention (no gate)** — enforced only by a sharp, explicit note
   in CLAUDE.md, used **only** where a gate would be too brittle to be worth the
   false positives. Currently this is exactly one rule: **soft-delete filtering**
   (`isNull(table.deletedAt)` on every read of a soft-deletable table). A static
   "every query filters the column" check is too false-positive-prone; gating it
   would create alert fatigue and erode trust in the gate.

We will not let class 3 grow silently. A new rule defaults to class 1 or 2; a rule
lands in class 3 only with a written reason for why it cannot be mechanized.

The mechanizable half of the pre-expose checklist is likewise promoted from prose
to a runnable gate: `scripts/preflight.sh` (`bun run preflight`).

## Consequences

- The "enforced" claim is now literally true for classes 1 and 2: a violating
  change fails `bun run check`, with no human reviewer in the loop.
- Adding a fitness function carries a standing bar (significant, measurable,
  deterministic, at real risk of silent regression). Spamming low-value gates is a
  regression of this decision, not an extension of it.
- The response-side type derivation uses a small conditional-type helper
  (`Payload<…>`). That is mild "cleverness" we accept because it removes
  hand-duplicated types that demonstrably drift — the helper is named, commented,
  and lives in one file.
- The single documented-only convention (soft delete) is a known, accepted hole.
  If a reliable check is found later, it moves to class 2 and this ADR is
  superseded rather than edited.

## Verification

- Response drift: renaming a projected route field breaks the page's `type-check`.
- Fitness gate: introducing a `process.env` read outside `lib/env.ts`, a route
  without `ok(`, a mutation without `body:`, or a missing `WIRED.md` path fails
  `bun run check`.
