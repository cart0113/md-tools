#!/usr/bin/env bash
# Serve the docsify site locally for preview.
# Usage: bin/serve-docs.sh [port]
#   default port: 3000

set -euo pipefail

PORT="${1:-3000}"
DIR="$(cd "$(dirname "$0")/.." && pwd)/docs"

echo "Serving docs at http://localhost:${PORT}"
echo "Press Ctrl+C to stop"

python-main -m http.server "$PORT" --directory "$DIR"
