#!/usr/bin/env bash
# Generate DKIM for minhtien.online (aaPanel/rspamd style)
# Does NOT modify baotienweb.cloud or appdesignbuild.com keys.
set -euo pipefail

DOMAIN="minhtien.online"
SELECTOR="default"
DKIM_DIR="/www/server/dkim/${DOMAIN}"
RSPAMD_CONF="/etc/rspamd/local.d/dkim_signing.conf"
BACKUP_DIR="/root/backups/jetbay-dkim-$(date +%Y%m%d-%H%M%S)"

mkdir -p "${BACKUP_DIR}"
cp -a "${RSPAMD_CONF}" "${BACKUP_DIR}/dkim_signing.conf.bak"

if [ -f "${DKIM_DIR}/default.private" ]; then
  echo "[dkim] Keys already exist at ${DKIM_DIR} — reuse"
else
  mkdir -p "${DKIM_DIR}"
  openssl genrsa -out "${DKIM_DIR}/default.private" 2048
  chmod 600 "${DKIM_DIR}/default.private"

  python3 <<PY
from pathlib import Path
import subprocess, textwrap, re

priv = Path("${DKIM_DIR}/default.private")
# Extract base64 public key (SPKI DER -> base64)
pem = subprocess.check_output(
    ["openssl", "rsa", "-in", str(priv), "-pubout"],
    stderr=subprocess.DEVNULL,
)
der = subprocess.check_output(
    ["openssl", "rsa", "-pubin", "-outform", "DER"],
    input=pem,
    stderr=subprocess.DEVNULL,
)
import base64
pub = base64.b64encode(der).decode("ascii")

chunks = textwrap.wrap(pub, 200)
sel = "${SELECTOR}"
lines = [f'{sel}._domainkey IN TXT ( "v=DKIM1; k=rsa;" ']
lines.append(f'\t"p={chunks[0]}"')
for c in chunks[1:]:
    lines.append(f'\t"{c}"')
lines.append(") ;")
Path("${DKIM_DIR}/default.pub").write_text("\n".join(lines) + "\n")
print("[dkim] Generated keys in ${DKIM_DIR}")
PY
  chmod 644 "${DKIM_DIR}/default.pub"
fi

if grep -q "minhtien.online" "${RSPAMD_CONF}"; then
  echo "[dkim] rspamd already has minhtien.online"
else
  python3 <<'PY'
from pathlib import Path
p = Path("/etc/rspamd/local.d/dkim_signing.conf")
text = p.read_text()
block = """#minhtien.online_DKIM_BEGIN
  minhtien.online {
    selectors [
     {
       path: "/www/server/dkim/minhtien.online/default.private";
       selector: "default"
     }
   ]
 }
#minhtien.online_DKIM_END
"""
marker = "#BT_DOMAIN_DKIM_END"
if marker not in text:
    raise SystemExit("marker #BT_DOMAIN_DKIM_END not found")
p.write_text(text.replace(marker, block + marker))
print("[dkim] rspamd config updated")
PY
fi

systemctl reload rspamd 2>/dev/null || systemctl restart rspamd

echo
echo "=== DKIM PUBLIC DNS RECORD (paste into P.A Vietnam) ==="
echo "Host: default._domainkey"
echo "Type: TXT"
echo "TTL: 3600"
echo "Value:"
python3 <<'PY'
from pathlib import Path
import re
raw = Path("/www/server/dkim/minhtien.online/default.pub").read_text()
parts = re.findall(r'"([^"]*)"', raw)
print("".join(parts))
PY

echo
echo "=== BIND-style (reference) ==="
cat "${DKIM_DIR}/default.pub"
echo
echo "[dkim] Backup: ${BACKUP_DIR}"
