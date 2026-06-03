#!/usr/bin/env bash
# Bootstrap a fresh clone: generate .env (fresh token + display name), install,
# migrate, seed, install git hooks.
#
# Note: the @app/* workspace scope is a FIXED internal name and is intentionally
# NOT renamed — it's never published or seen, so renaming it only risks drift
# (e.g. the Dockerfile / lockfile referencing a stale scope). The project's
# display name lives in VITE_APP_NAME and shows up in the browser tab + sidebar.
#
# Usage: scripts/init-project.sh "My App"
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

APP_NAME="${1:-App}"
echo "==> Initializing project: $APP_NAME"

# 1. .env with a fresh token + the display name
if [ ! -f .env ]; then
  echo "==> Generating .env (fresh AUTH_TOKEN, VITE_APP_NAME=\"$APP_NAME\")"
  TOKEN="$(openssl rand -hex 32)"
  sed -e "s|^AUTH_TOKEN=.*|AUTH_TOKEN=$TOKEN|" \
      -e "s|^VITE_AUTH_TOKEN=.*|VITE_AUTH_TOKEN=$TOKEN|" \
      -e "s|^VITE_APP_NAME=.*|VITE_APP_NAME=\"$APP_NAME\"|" \
      .env.example > .env
else
  echo "==> .env already exists — leaving it untouched"
fi

# 2. Install + DB
echo "==> Installing dependencies"
bun install
echo "==> Migrating + seeding"
bun run db:migrate
bun run db:seed

# 3. Git hooks (best effort — needs the gitleaks binary for the secret-scan hook)
bunx lefthook install >/dev/null 2>&1 || echo "    (skip) run 'bunx lefthook install' once gitleaks is on PATH"

cat <<EOF

==> Done.
    Dev:     bun run dev        (API :4000, Vite :3000)
    Docker:  docker compose up -d --build   (http://localhost:3000)
    Next:    fill in PROJECT_BRIEF.md, then read CLAUDE.md and build your
             first feature (the per-resource build sequence).
EOF
