// Fail-fast environment validation. Parsed ONCE at boot; the API exits with a
// clear message if a required var is missing. Nothing else reads process.env.

function required(name: string): string {
  const v = process.env[name]
  if (v === undefined || v === '') {
    console.error(`[env] Missing required environment variable: ${name}`)
    console.error('[env] Copy .env.example to .env and run scripts/init-project.sh.')
    process.exit(1)
  }
  return v
}

function optional(name: string, fallback: string): string {
  const v = process.env[name]
  return v === undefined || v === '' ? fallback : v
}

export const env = {
  /** SQLite file path, or ":memory:" in tests. */
  DATABASE_PATH: required('DATABASE_PATH'),
  /** Shared bearer token (auth Mode B). */
  AUTH_TOKEN: required('AUTH_TOKEN'),
  NODE_ENV: optional('NODE_ENV', 'development'),
  PORT: Number(optional('PORT', '3000')),
  LOG_LEVEL: optional('LOG_LEVEL', 'info'),
  ENABLE_SWAGGER: optional('ENABLE_SWAGGER', 'false') === 'true',
  /** Set in the container to the SPA build dir so the API also serves the SPA. */
  STATIC_DIR: process.env.STATIC_DIR,
} as const

export const isProd = env.NODE_ENV === 'production'
export const isTest = env.NODE_ENV === 'test'
