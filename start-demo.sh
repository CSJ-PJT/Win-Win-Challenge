#!/usr/bin/env sh
set -eu
cd "$(dirname "$0")"
command -v node >/dev/null 2>&1 || { echo 'Node.js 22+ is required. Or open dist/handoff-demo.html directly.'; exit 1; }
exec node server.js
