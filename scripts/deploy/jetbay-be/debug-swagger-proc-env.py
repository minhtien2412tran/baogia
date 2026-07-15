#!/usr/bin/env python3
"""Meta-only: compare PM2 process SWAGGER_* env to .env file (lengths / match)."""
from __future__ import annotations

import re
import subprocess
from pathlib import Path

pid = subprocess.check_output(["pm2", "pid", "jetbay-be"], text=True).strip().split()[0]
print("pid", pid)
raw = Path(f"/proc/{pid}/environ").read_bytes().split(b"\0")
proc: dict[str, bytes] = {}
for e in raw:
    if b"=" not in e:
        continue
    k, v = e.split(b"=", 1)
    proc[k.decode("utf-8", "replace")] = v

meta = {
    k: len(v)
    for k, v in proc.items()
    if "SWAGGER" in k or k in ("APP_ENV", "NODE_ENV")
}
print("proc_env_meta", meta)

text = Path("/var/www/jetbay-be/.env").read_bytes()
fm = re.search(rb"^SWAGGER_BASIC_PASSWORD=(.*)$", text, re.M)
fu = re.search(rb"^SWAGGER_BASIC_USER=(.*)$", text, re.M)


def clean(b: bytes | None) -> bytes:
    if not b:
        return b""
    return b.strip().strip(b'"').strip(b"'")


fp, fu_v = clean(fm.group(1) if fm else None), clean(fu.group(1) if fu else None)
print("file_user_len", len(fu_v), "file_pass_len", len(fp))
print("proc_has_swagger_pass", "SWAGGER_BASIC_PASSWORD" in proc)
print("proc_has_swagger_user", "SWAGGER_BASIC_USER" in proc)
if "SWAGGER_BASIC_PASSWORD" in proc:
    print("proc_pass_match_file", proc["SWAGGER_BASIC_PASSWORD"] == fp)
    print("proc_pass_len", len(proc["SWAGGER_BASIC_PASSWORD"]))
if "SWAGGER_BASIC_USER" in proc:
    print("proc_user_match_file", proc["SWAGGER_BASIC_USER"] == fu_v)

# ecosystem files
for p in Path("/var/www/jetbay-be").glob("ecosystem*"):
    print("ecosystem", p)
