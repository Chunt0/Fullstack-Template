#!/usr/bin/env bash
# Run the API (watch, :4000) and the Vite dev server (:3000) together. Both are
# long-running, so they must run in PARALLEL.
#
# Why not `bun --filter '*' dev`? Bun runs filtered scripts in workspace-dependency
# order and waits for each to finish. The frontend depends on @app/api, so Bun
# starts the API's dev first and blocks the frontend behind it — but the API's
# watch server never exits, so Vite never starts. Single-package filters + shell
# backgrounding sidestep that. Ctrl-C stops both.
trap 'kill 0' EXIT
cd "$(dirname "$0")/.."
bun run --filter '@app/api' dev &
bun run --filter '@app/frontend' dev &
wait
