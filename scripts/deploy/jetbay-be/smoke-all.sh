#!/usr/bin/env bash
# Full production smoke: BE + docs + admin CRUD + web contract
set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "=== smoke-prod ==="
bash "${SCRIPT_DIR}/smoke-prod.sh"
echo
echo "=== smoke-docs ==="
bash "${SCRIPT_DIR}/smoke-docs.sh"
echo
echo "=== node smokes ==="
bash "${SCRIPT_DIR}/run-node-smokes.sh"
