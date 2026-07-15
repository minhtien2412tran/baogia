#!/usr/bin/env python3
"""Debug Swagger Basic — prints meta only, never secrets."""
from __future__ import annotations

import re
import subprocess
from pathlib import Path

BK = Path("/root/backups/jetbay-security-ops-20260715-165745/demo-passwords.txt")
ENV = Path("/var/www/jetbay-be/.env")


def kv(path: Path, key: str) -> str:
    m = re.search(rf"^{re.escape(key)}=(.*)$", path.read_text(encoding="utf-8", errors="replace"), re.M)
    if not m:
        return ""
    return m.group(1).strip().strip('"').strip("'")


u = kv(BK, "SWAGGER_BASIC_USER")
p = kv(BK, "SWAGGER_BASIC_PASSWORD")
eu = kv(ENV, "SWAGGER_BASIC_USER")
ep = kv(ENV, "SWAGGER_BASIC_PASSWORD")
print(f"user_len={len(u)} pass_len={len(p)}")
print(f"env_vs_backup_user_match={u == eu}")
print(f"env_vs_backup_pass_match={p == ep}")
print(f"pass_alnum={p.isalnum()}")

urls = [
    "https://api.minhtien.online/swagger",
    "https://docs.minhtien.online/swagger",
    "https://api.minhtien.online/openapi.json",
    "https://docs.minhtien.online/openapi.json",
]
for url in urls:
    a = subprocess.check_output(["curl", "-sS", "-o", "/dev/null", "-w", "%{http_code}", url], text=True)
    b = subprocess.check_output(
        ["curl", "-sS", "-o", "/dev/null", "-w", "%{http_code}", "-u", f"{u}:{p}", url],
        text=True,
    )
    print(f"{url} anon={a} auth={b}")

conf = Path("/etc/nginx/sites-enabled/docs.minhtien.online")
if conf.exists():
    for line in conf.read_text(errors="replace").splitlines():
        if any(x in line for x in ("proxy_pass", "server_name", "listen", "auth_basic")):
            print("nginx:", line.strip())
