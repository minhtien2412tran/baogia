#!/usr/bin/env bash
set -euo pipefail
export SYNC_MODE=prod-docs
while IFS= read -r line; do
  case "$line" in
    SWAGGER_BASIC_USER=*|SWAGGER_BASIC_PASSWORD=*)
      key="${line%%=*}"
      val="${line#*=}"
      val="${val%\"}"; val="${val#\"}"
      val="${val%\'}"; val="${val#\'}"
      export "$key=$val"
      ;;
  esac
done < <(grep -E '^SWAGGER_BASIC_(USER|PASSWORD)=' /var/www/jetbay-be/.env | sed 's/\r$//')
if [[ -z "${SWAGGER_BASIC_USER:-}" || -z "${SWAGGER_BASIC_PASSWORD:-}" ]]; then
  echo "BLOCKED_OWNER_CREDENTIAL: SWAGGER_BASIC_* missing"
  exit 2
fi
echo "smoke-api-sync remote: user_set=yes pass_len=${#SWAGGER_BASIC_PASSWORD} mode=$SYNC_MODE"
cd /tmp
node smoke-api-sync.mjs