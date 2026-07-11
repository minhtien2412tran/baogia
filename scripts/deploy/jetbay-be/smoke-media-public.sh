#!/usr/bin/env bash
set -euo pipefail
FILE="$(find /var/www/jetbay-be/uploads/media -type f 2>/dev/null | head -1)"
if [ -z "$FILE" ]; then
  echo "no upload files"
  exit 1
fi
REL="${FILE#/var/www/jetbay-be/uploads/}"
OBJ="${REL#media/}"
URL="https://api.minhtien.online/media/${OBJ}"
echo "file: $FILE"
echo "url:  $URL"
CODE="$(curl -sk -o /dev/null -w '%{http_code}' "$URL")"
echo "http: $CODE"
CT="$(curl -skI "$URL" | grep -i content-type | head -1)"
echo "$CT"
