import { logger } from '../lib/logger'
import { sqlite } from './index'
import { runMigrations } from './migrate'
// REFERENCE-START
import { eq, sql } from 'drizzle-orm'
import { db } from './index'
import { announcements, categories } from './schema'

const REFERENCE_CATEGORIES = ['General', 'Maintenance', 'Events']
// REFERENCE-END

// Idempotent seed — safe to run repeatedly. Run via `bun run db:seed`.
export function seed(): void {
  runMigrations()
  // REFERENCE-START
  for (const name of REFERENCE_CATEGORIES) {
    db.insert(categories).values({ name }).onConflictDoNothing().run()
  }
  const existing = db.select({ c: sql<number>`count(*)` }).from(announcements).get()
  if (!existing || existing.c === 0) {
    const general = db.select().from(categories).where(eq(categories.name, 'General')).get()
    if (general) {
      db.insert(announcements)
        .values([
          {
            title: 'Welcome to your new app',
            body: 'This is the example feature. Remove it with `bun run eject:reference` once your first feature replaces it.',
            categoryId: general.id,
          },
          {
            title: 'How to add a feature',
            body: 'Add a table in db/schema.ts, a file in routes/, a hook, a page, and one entry in routes.manifest.ts. See CLAUDE.md.',
            categoryId: general.id,
          },
        ])
        .run()
    }
  }
  // REFERENCE-END
  // Add idempotent upserts for your own seed data here.
}

if (import.meta.main) {
  seed()
  logger.info('seed complete')
  sqlite.close()
}
