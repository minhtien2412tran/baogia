#!/usr/bin/env bash
set -euo pipefail
KEY="media/enquiries/1783744033899-dc5c1669-tu-bep-chu-l-hien-dai.webp"
ROOT="/var/www/jetbay-be/uploads"
FP="${ROOT}/${KEY#media/}"
FP2="$(python3 -c "import os; print(os.path.join('$ROOT', '$KEY'))")"
echo "key: $KEY"
echo "fp1: $FP"
echo "fp2: $FP2"
ls -la "$FP2" || true
python3 <<PY
import os
root="/var/www/jetbay-be/uploads"
key="media/enquiries/1783744033899-dc5c1669-tu-bep-chu-l-hien-dai.webp"
fp=os.path.join(root, key)
print("join", fp, os.path.exists(fp))
PY
