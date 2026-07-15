#!/usr/bin/env bash
# Install/run JetBay Mailpit on VPS (SMTP :1025, UI :8025 — bound to loopback only).
# Usage (on VPS): bash scripts/deploy/jetbay-be/install-mailpit.sh
set -euo pipefail

IMAGE="${MAILPIT_IMAGE:-axllent/mailpit:v1.21}"
NAME="${MAILPIT_NAME:-jetbay-mailpit}"

if ! command -v docker >/dev/null 2>&1; then
  echo "FAIL: docker not installed"
  exit 1
fi

if docker ps -a --format '{{.Names}}' | grep -qx "$NAME"; then
  echo "container exists: $NAME — restarting"
  docker start "$NAME" >/dev/null || docker restart "$NAME" >/dev/null
else
  echo "creating $NAME from $IMAGE (bind 127.0.0.1 only)"
  docker run -d \
    --name "$NAME" \
    --restart always \
    -p 127.0.0.1:1025:1025 \
    -p 127.0.0.1:8025:8025 \
    "$IMAGE" >/dev/null
fi

sleep 1
if ss -lnt 2>/dev/null | grep -q ':1025' || netstat -lnt 2>/dev/null | grep -q ':1025'; then
  echo "OK: SMTP listening on 127.0.0.1:1025"
else
  docker ps --filter "name=$NAME" --format '{{.Names}} {{.Status}} {{.Ports}}'
  echo "WARN: could not confirm :1025 via ss/netstat — check docker ps"
fi

echo "UI: http://127.0.0.1:8025 (SSH tunnel: ssh -L 8025:127.0.0.1:8025 root@VPS)"
docker ps --filter "name=$NAME" --format '{{.Names}} {{.Status}} {{.Ports}}'
