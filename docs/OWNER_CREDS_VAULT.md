# Owner credentials vault (local only)

Passwords **không** nằm trong Git. Một file gom đủ pass + path quan trọng:

| Location | Role |
|----------|------|
| **`.secrets/OWNER_VAULT.md`** / **`.secrets/OWNER_VAULT.txt`** | Bản local trên máy bạn (gitignored) |
| `/root/backups/jetbay-owner-vault-*.txt` | Bản gom trên VPS (`chmod 600`) |
| `/root/backups/jetbay-security-ops-YYYYMMDD-HHMMSS/` | Backup từng lần rotate |

## Build vault on VPS

```bash
# From repo PC (Windows key: ~/.ssh/baotienweb_ed25519 — Host baotienweb):
scp scripts/deploy/jetbay-be/assemble-owner-vault.sh baotienweb:/var/www/jetbay-be/deploy/

# On VPS:
sed -i 's/\r$//' /var/www/jetbay-be/deploy/assemble-owner-vault.sh
STAMP=20260716-221238 bash /var/www/jetbay-be/deploy/assemble-owner-vault.sh
```

## Pull to Windows

```powershell
scp baotienweb:/root/backups/jetbay-owner-vault-*.txt .secrets/OWNER_VAULT.txt
```

Latest rotate (2026-07-16): `jetbay-security-ops-20260716-221238`.  
Local vault filled: `.secrets/OWNER_VAULT.txt` (gitignored · assembled `20260716-222016`).

See also: [SECURITY_SECRETS.md](./SECURITY_SECRETS.md) · [FE_DEV_HANDOFF_CREDS.md](./FE_DEV_HANDOFF_CREDS.md)
