#!/usr/bin/env bash
python3 <<'PY'
from pathlib import Path
import re
raw = Path("/www/server/dkim/minhtien.online/default.pub").read_text()
print("".join(re.findall(r'"([^"]*)"', raw)))
PY
