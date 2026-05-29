import './env-setup' // must be first — sets env before db/app are imported
import { runMigrations } from '../db/migrate'
import { seed } from '../db/seed'

// Hermetic test DB: in-memory, migrated + seeded once per test process.
runMigrations()
seed()
