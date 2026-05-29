import { existsSync } from 'node:fs'
import { migrate } from 'drizzle-orm/bun-sqlite/migrator'
import { logger } from '../lib/logger'
import { db, sqlite } from './index'

const migrationsFolder = new URL('./migrations', import.meta.url).pathname

// Applies any pending migrations. Called on API boot (index.ts) and by
// `bun run db:migrate`. No-ops when no migrations exist yet (fresh project, or
// right after `eject:reference`) — run `bun run db:generate` to create them.
export function runMigrations(): void {
  if (!existsSync(`${migrationsFolder}/meta/_journal.json`)) {
    logger.warn('No migrations found — run `bun run db:generate` after editing schema.ts')
    return
  }
  migrate(db, { migrationsFolder })
}

if (import.meta.main) {
  runMigrations()
  logger.info('migrations applied')
  sqlite.close()
}
