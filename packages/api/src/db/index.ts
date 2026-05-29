import { mkdirSync } from 'node:fs'
import { dirname } from 'node:path'
import { Database } from 'bun:sqlite'
import { drizzle } from 'drizzle-orm/bun-sqlite'
import { env } from '../lib/env'
import * as schema from './schema'

// Single SQLite connection for the process, wrapped by Drizzle. WAL mode +
// foreign keys + a busy timeout are set on open.

function open() {
  if (env.DATABASE_PATH !== ':memory:') {
    mkdirSync(dirname(env.DATABASE_PATH), { recursive: true })
  }
  const sqlite = new Database(env.DATABASE_PATH, { create: true })
  sqlite.exec('PRAGMA journal_mode = WAL;')
  sqlite.exec('PRAGMA foreign_keys = ON;')
  sqlite.exec('PRAGMA busy_timeout = 5000;')
  return sqlite
}

export const sqlite = open()
export const db = drizzle(sqlite, { schema })
export { schema }
