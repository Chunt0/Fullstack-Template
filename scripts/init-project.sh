#!/usr/bin/env bash
# Bootstrap a fresh clone: rename the @app/* workspace scope, generate .env with
# a fresh token, install, migrate, seed.
# Usage: scripts/init-project.sh <project-name>
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

NAME="${1:-myapp}"
SCOPE="$(echo "$NAME" | tr '[:upper:]' '[:lower:]' | tr -cs 'a-z0-9-' '-' | sed 's/^-//;s/-$//')"
[ -n "$SCOPE" ] || SCOPE="app"

echo "==> Initializing project '$NAME' (scope @$SCOPE)"

# 1. Rename @app/* -> @<scope>/* across package.json + sources
if [ "$SCOPE" != "app" ]; then
  echo "==> Renaming @app/* -> @$SCOPE/*"
  grep -rl '@app/' . \
    --include='*.json' --include='*.ts' --include='*.tsx' \
    --exclude-dir=node_modules --exclude-dir=dist --exclude-dir=.git 2>/dev/null \
    | while IFS= read -r f; do sed -i "s#@app/#@$SCOPE/#g" "$f"; done
fi

# 2. Generate .env with a fresh shared token
if [ ! -f .env ]; then
  echo "==> Generating .env with a fresh AUTH_TOKEN"
  TOKEN="$(openssl rand -hex 32)"
  sed -e "s#^AUTH_TOKEN=.*#AUTH_TOKEN=$TOKEN#" \
      -e "s#^VITE_AUTH_TOKEN=.*#VITE_AUTH_TOKEN=$TOKEN#" \
      .env.example > .env
else
  echo "==> .env already exists — leaving it untouched"
fi

# 3. Install + DB
echo "==> Installing dependencies"
bun install
echo "==> Migrating + seeding"
bun run db:migrate
bun run db:seed

# 4. Git hooks (best effort — needs the gitleaks binary for the secret-scan hook)
bunx lefthook install >/dev/null 2>&1 || echo "    (skip) run 'bunx lefthook install' once gitleaks is on PATH"

cat <<EOF

==> Done.
    Dev:     bun run dev        (API :4000, Vite :3000)
    Docker:  docker compose up -d --build   (http://localhost:3000)
    Next:    read CLAUDE.md, then build your first feature.
EOF
