#!/usr/bin/env python3
"""Ensure SMTP_ALLOW_CATCHER=true in VPS .env without printing secrets."""
from pathlib import Path
import sys

path = Path(sys.argv[1] if len(sys.argv) > 1 else "/var/www/jetbay-be/.env")
text = path.read_text(errors="replace")
lines = text.splitlines()
key = "SMTP_ALLOW_CATCHER"
found = False
out = []
for line in lines:
    if line.startswith(f"{key}=") or line.startswith(f"#{key}="):
        out.append(f"{key}=true")
        found = True
    else:
        out.append(line)
if not found:
    out.append("")
    out.append("# Mailpit catcher (not real inbox) — set by install-mailpit")
    out.append(f"{key}=true")
path.write_text("\n".join(out) + ("\n" if text.endswith("\n") or not text else "\n"))
print(f"{key}=SET")
