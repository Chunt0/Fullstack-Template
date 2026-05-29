#!/usr/bin/env bash
# Restore a gzipped backup. Test this monthly — an untested backup is not a backup.
# Usage: scripts/restore.sh backups/app-YYYYMMDD-HHMMSS.db.gz
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
GZ="${1:?Usage: scripts/restore.sh backups/app-YYYYMMDD-HHMMSS.db.gz}"
[ -f "$GZ" ] || { echo "No such file: $GZ" >&2; exit 1; }

if docker compose ps --status running 2>/dev/null | grep -q app; then
  echo "==> Restoring into the running stack (the app will restart)"
  CID="$(docker compose ps -q app)"
  TMP="$(mktemp)"
  gunzip -c "$GZ" > "$TMP"
  docker cp "$TMP" "$CID":/data/app.db
  rm -f "$TMP"
  docker compose exec -T app sh -c 'rm -f /data/app.db-wal /data/app.db-shm' || true
  docker compose restart app
else
  echo "==> Restoring the local dev DB to data/app.db"
  mkdir -p data
  rm -f data/app.db-wal data/app.db-shm
  gunzip -c "$GZ" > data/app.db
fi
echo "==> Restore complete"
