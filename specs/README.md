# specs/ — feature specs the agent follows

A spec is the **input** to one run of the build sequence (CLAUDE.md → "Build
sequence"). You write it; an agent implements it; then it's archived. Specs are
how you get high-fidelity implementation: the more concretely a spec pins the
contract, the less the agent improvises.

## The lifecycle (a spec runs on a different clock than docs)

```
 draft ──► building ──► done @ <commit>
  you      the agent     code is now the source of truth; spec is a record
```

- **Before** implementation, the **spec is the source of truth** — the code
  doesn't exist yet, so detail matters.
- **The moment it's `done`**, the **code becomes the source of truth**. The spec
  is frozen, stamped with the commit that fulfilled it, and not "kept in sync."
  That's the trick that lets a spec be maximally detailed without rotting: you
  don't maintain it, you supersede it.

## The rule that prevents rot: checkable detail becomes a test

Walk down a spec; every line is one of two kinds:

- **Checkable** ("POST with empty title → 422", "table has a `deletedAt`
  column") → it goes in the **Acceptance** section and becomes a real test. The
  detail doesn't evaporate when the spec is archived — it moved into a form that
  *fails loudly* when violated, and that test is the maintenance guard.
- **Intent / why / tradeoff** ("we soft-delete because…") → stays prose, frozen
  with the spec. It explains a past decision; it isn't a live contract.

So a good spec's **Acceptance** list maps 1:1 onto a test file. "Did the agent
follow the spec?" stops being a judgment call and becomes `bun run check`.

## Granularity

- **One spec per resource**, sized to a single build-sequence run. A focused
  80-line spec is followed with far higher fidelity than a section buried in a
  4,000-word monolith (see `SEED_SPEC.md` for what to *avoid* as a working
  format — it's archived for exactly this reason).
- Specs are mostly **deltas from the reference feature.** Don't restate the
  envelope, error types, auth, or validation conventions — point at them
  ("responses follow the standard envelope") and describe only what's different.
- `PROJECT_BRIEF.md` is the whole-project *what*; each feature spec is the
  detailed *how* for one slice of it. Brief → list of features → one spec each.

## What makes a spec the agent actually follows (fidelity levers)

1. **Concrete contracts beat prose.** Give the exact `t.Object({...})`, exact
   columns + types, exact response shape — near-copyable, not described.
2. **An explicit "Out of scope" list.** Bounds the agent; stops gold-plating
   (the #1 way agents drift).
3. **A "Reference" pointer to copy.** "Mirror `routes/announcements.ts`" is the
   highest-fidelity instruction you can give.
4. **Self-checkable Acceptance.** If the agent can run the tests, it
   self-corrects toward the spec instead of declaring victory early.

## How to use

1. `cp specs/SPEC_TEMPLATE.md specs/<resource>.md` and fill it in.
2. Hand it to the agent: *"Implement specs/<resource>.md per CLAUDE.md."*
3. When green, set `status:` to `done @ <short-commit>` and fill `tests:` with
   the test file path. The drift guard (`tests/specs.test.ts`) then asserts that
   file exists — a `done` spec whose tests vanished is a build failure.

## The drift guard

`packages/api/src/tests/specs.test.ts` runs in `bun run check` and asserts:

- every spec is well-formed (has a `status:` line and an `## Acceptance`
  section);
- every spec marked `done` carries a commit stamp and its `tests:` file(s)
  exist.

Specs with `kind: reference` or `kind: archive` are skipped (the reference one
is removed by `bun run eject:reference`).
