import './env-setup' // must be first — sets env before db/app are imported
import { seed } from '../db/seed'

// Hermetic test DB: in-memory, seeded once per test process.
// seed() runs migrations itself, so we don't migrate separately.
seed()
