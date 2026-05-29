#!/usr/bin/env bash
# Consistent online SQLite snapshot (VACUUM INTO, safe under WAL) → gzipped,
# rotated. Cron-friendly: 0 3 * * * cd /opt/myapp && ./scripts/backup.sh
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
mkdir -p backups
TS="$(date +%Y%m%d-%H%M%S)"
OUT="backups/app-$TS.db"

if docker compose ps --status running 2>/dev/null | grep -q app; then
  echo "==> Snapshotting from the running container"
  CID="$(docker compose ps -q app)"
  docker compose exec -T app bun -e "import {Database} from 'bun:sqlite'; new Database(process.env.DATABASE_PATH).run(\"VACUUM INTO '/data/backup.db'\")"
  docker cp "$CID":/data/backup.db "$OUT"
  docker compose exec -T app rm -f /data/backup.db
else
  echo "==> Snapshotting the local dev DB"
  DBPATH="${DATABASE_PATH:-data/app.db}"
  bun -e "import {Database} from 'bun:sqlite'; new Database('$DBPATH').run(\"VACUUM INTO '$ROOT/$OUT'\")"
fi

gzip -f "$OUT"
echo "==> Wrote $OUT.gz"

# Keep the 30 most recent backups; delete older.
ls -1t backups/app-*.db.gz 2>/dev/null | tail -n +31 | xargs -r rm -f
echo "==> Rotation done"
