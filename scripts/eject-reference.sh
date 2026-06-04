#!/usr/bin/env bash
# Remove the reference feature in one shot: delete the dedicated files and strip
# the REFERENCE-START..END blocks (and any single REFERENCE line) from shared
# files. Run this before (or as) you build your first real feature.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

echo "==> Ejecting the reference feature (announcements + categories)"

# 1. Delete files that are entirely reference.
rm -f \
  packages/api/src/routes/announcements.ts \
  packages/api/src/routes/categories.ts \
  packages/api/src/tests/announcements.test.ts \
  packages/frontend/src/hooks/use-announcements.ts \
  packages/frontend/src/hooks/use-categories.ts \
  packages/frontend/src/pages/AnnouncementsPage.tsx \
  specs/announcements.md

# 2. Strip REFERENCE blocks + stray REFERENCE lines from shared files.
SHARED=(
  packages/api/src/routes/index.ts
  packages/api/src/db/schema.ts
  packages/api/src/db/seed.ts
  packages/frontend/src/routes.manifest.ts
)
for f in "${SHARED[@]}"; do
  [ -f "$f" ] || continue
  awk '
    /REFERENCE-START/ { skip=1; next }
    /REFERENCE-END/   { skip=0; next }
    skip              { next }
    /REFERENCE/       { next }
    { print }
  ' "$f" > "$f.tmp" && mv "$f.tmp" "$f"
done

# 3. Drop the reference migration + local dev DB (schema changed).
rm -f packages/api/src/db/migrations/*.sql
rm -rf packages/api/src/db/migrations/meta
rm -f data/app.db data/app.db-shm data/app.db-wal

cat <<'EOF'
==> Reference feature removed.
    Next:
      1. Add your tables to packages/api/src/db/schema.ts
      2. bun run db:generate && bun run db:migrate
      3. Verify clean:  bun run check:reference  &&  bun run check
EOF
