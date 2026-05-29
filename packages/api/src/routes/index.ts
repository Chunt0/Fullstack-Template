import { Elysia } from 'elysia'
// REFERENCE-START
import announcementsRoutes from './announcements'
import categoriesRoutes from './categories'
// REFERENCE-END

// ── The single place API routes are registered ───────────────────────────
// Add a resource: create routes/<name>.ts (default-export an Elysia instance
// prefixed `/api/<name>`), then add one `.use(...)` line below. This stays an
// explicit chain (not a runtime glob) on purpose — it's what lets Eden Treaty
// infer the whole API surface as a static type for the frontend. SEED_SPEC §5.13.
export const routes = new Elysia()
  // REFERENCE-START
  .use(announcementsRoutes)
  .use(categoriesRoutes)
// REFERENCE-END
