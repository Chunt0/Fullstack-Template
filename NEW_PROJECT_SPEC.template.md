# NEW_PROJECT_SPEC

Fill this in, then hand it to Claude with: "Build this per CLAUDE.md." Describe
*what the app does* — not *how* to build it (the template already decided that).
Delete the guidance in parentheses as you go.

## 1. One-liner

(What is this app, in one sentence? e.g. "Track my home server's services and
their uptime.")

## 2. Auth mode

(A = none / B = shared token / C = login. Default B. See docs/ARCHITECTURE.md.)

- Mode: **B**

## 3. Entities

(One block per resource. Fields with types; mark required ones; note relations.
The template's reference feature is `announcements` belonging to `categories` —
follow that shape.)

### <Entity> (e.g. Service)
- `name` — text, required
- `url` — text, required
- `status` — enum: up | down | unknown
- belongs to: <other entity, or none>
- soft-delete? yes/no

### <Entity 2>
- …

## 4. Pages / views

(One line each: what it shows + which entity. CRUD pages get the standard
archetype automatically.)

- **Dashboard** — overview of <…>
- **<Entities>** — CRUD list of <entity>
- …

## 5. Non-defaults / special needs

(Anything beyond standard CRUD: file uploads, charts, a long-running/background
operation, an external API call, a scheduled task. Leave blank if none — most
apps need nothing here. Long-running or different-runtime work → see the escape
hatches in docs/ARCHITECTURE.md.)

-

## 6. Out of scope

(Explicitly list what NOT to build, so it doesn't creep in.)

-

---

When done building: `bun run check` green, `bun run eject:reference` run, docs
updated to match what you built.
