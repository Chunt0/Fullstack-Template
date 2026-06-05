#!/usr/bin/env bash
# Pre-expose preflight: the mechanizable half of the checklist in
# docs/ARCHITECTURE.md. Run before reaching the app from any other device.
# Exits non-zero if any hard check fails. The genuinely-manual items (auth
# returns 401 when tested live, reachability, a restore actually performed) are
# printed at the end as reminders — a script can't honestly verify them.
set -uo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

fail=0
pass() { printf '  \033[32m✓\033[0m %s\n' "$1"; }
bad()  { printf '  \033[31m✗\033[0m %s\n' "$1"; fail=1; }

echo "Preflight — pre-expose checks"

# 1. .env is not tracked by git (only .env.example should be).
tracked=$(git ls-files | grep -E '(^|/)\.env$' || true)
if [ -z "$tracked" ]; then pass ".env is not in git"; else bad ".env is tracked by git: $tracked"; fi

# 2. Swagger is off.
if [ -f .env ] && grep -Eq '^ENABLE_SWAGGER=true' .env; then
  bad "ENABLE_SWAGGER=true in .env — turn it off before exposing"
else
  pass "Swagger is not enabled in .env"
fi

# 3. AUTH_TOKEN looks generated, not hand-typed (>= 32 chars, present).
if [ -f .env ]; then
  token=$(grep -E '^AUTH_TOKEN=' .env | head -1 | cut -d= -f2-)
  if [ "${#token}" -ge 32 ]; then pass "AUTH_TOKEN is set and >= 32 chars"
  else bad "AUTH_TOKEN missing or short — use: openssl rand -hex 32"; fi
else
  bad ".env not found (run scripts/init-project.sh)"
fi

# 4. No reference-feature markers left.
if bash scripts/check-reference.sh >/dev/null 2>&1; then pass "no reference markers"
else bad "reference markers remain — run 'bun run eject:reference'"; fi

# 5. Built bundle carries no stray secrets (AUTH_TOKEN is expected; see G9).
dist="packages/frontend/dist"
if [ -d "$dist" ]; then
  if grep -rqE 'AKIA|PRIVATE KEY|BEGIN RSA' "$dist"; then
    bad "possible secret in built bundle ($dist) — inspect before shipping"
  else
    pass "built bundle has no obvious stray secrets"
  fi
else
  printf '  \033[33m–\033[0m %s\n' "no built bundle yet ($dist) — run 'bun run build' to check it"
fi

# 6. Dependency audit.
if bun audit >/dev/null 2>&1; then pass "bun audit clean"
else bad "bun audit found advisories — review 'bun audit'"; fi

echo
echo "Still verify by hand (a script can't):"
echo "  • unauthed /api/... returns 401 (test it live)"
echo "  • reachability is what you intend (Tailscale/Caddy/firewall, not open port-forward)"
echo "  • a backup has actually been restored at least once"

if [ "$fail" -ne 0 ]; then
  echo; printf '\033[31mPreflight FAILED — fix the ✗ items above.\033[0m\n'; exit 1
fi
echo; printf '\033[32mPreflight passed (mechanized checks).\033[0m\n'
