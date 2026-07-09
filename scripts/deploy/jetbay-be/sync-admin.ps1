# Sync apps/admin + packages/ui to VPS (Windows)
$ErrorActionPreference = "Stop"
$Vps = if ($env:VPS_HOST) { $env:VPS_HOST } else { "root@103.200.20.100" }
$AppRoot = "/var/www/jetbay-admin"
$Repo = (Resolve-Path (Join-Path $PSScriptRoot "..\..\..")).Path

Write-Host "[sync-admin] packing..."
$tmp = Join-Path $env:TEMP "jetbay-admin-sync"
if (Test-Path $tmp) { Remove-Item $tmp -Recurse -Force }
New-Item -ItemType Directory -Path "$tmp\admin", "$tmp\ui", "$tmp\deploy" | Out-Null

robocopy "$Repo\apps\admin" "$tmp\admin" /E /XD node_modules .next coverage /NFL /NDL /NJH /NJS /nc /ns /np
if ($LASTEXITCODE -ge 8) { throw "robocopy admin failed: $LASTEXITCODE" }
robocopy "$Repo\packages\ui" "$tmp\ui" /E /XD node_modules /NFL /NDL /NJH /NJS /nc /ns /np
if ($LASTEXITCODE -ge 8) { throw "robocopy ui failed: $LASTEXITCODE" }
Copy-Item "$Repo\scripts\deploy\jetbay-be\deploy-admin.sh" "$tmp\deploy\"
Copy-Item "$Repo\scripts\deploy\jetbay-be\admin.minhtien.online.http.conf" "$tmp\deploy\" -ErrorAction SilentlyContinue
Copy-Item "$Repo\scripts\deploy\jetbay-be\admin.minhtien.online.ssl.conf" "$tmp\deploy\" -ErrorAction SilentlyContinue

$pkgPath = Join-Path $tmp "admin\package.json"
$pkg = Get-Content $pkgPath -Raw | ConvertFrom-Json
$pkg.name = "jetbay-admin"
$pkg.dependencies | Add-Member -NotePropertyName "@jetbay/ui" -NotePropertyValue "file:vendor/ui" -Force
[System.IO.File]::WriteAllText($pkgPath, ($pkg | ConvertTo-Json -Depth 20) + "`n")

$tar = Join-Path $env:TEMP "jetbay-admin-sync.tar.gz"
if (Test-Path $tar) { Remove-Item $tar -Force }
Push-Location $tmp
tar -czf $tar admin ui deploy
Pop-Location

$extractBody = @'
#!/usr/bin/env bash
set -euo pipefail
APP_ROOT=/var/www/jetbay-admin
cd /tmp
rm -rf jetbay-admin-unpack
mkdir -p jetbay-admin-unpack
tar -xzf jetbay-admin-sync.tar.gz -C jetbay-admin-unpack
mkdir -p "$APP_ROOT"
find "$APP_ROOT" -mindepth 1 -maxdepth 1 ! -name node_modules ! -name .next ! -name .env.local ! -name logs ! -name vendor ! -name deploy -exec rm -rf {} +
cp -a /tmp/jetbay-admin-unpack/admin/. "$APP_ROOT/"
mkdir -p "$APP_ROOT/vendor/ui"
rm -rf "$APP_ROOT/vendor/ui"/*
cp -a /tmp/jetbay-admin-unpack/ui/. "$APP_ROOT/vendor/ui/"
mkdir -p "$APP_ROOT/deploy"
cp -a /tmp/jetbay-admin-unpack/deploy/. "$APP_ROOT/deploy/"
chmod +x "$APP_ROOT/deploy"/*.sh 2>/dev/null || true
python3 -c 'import json; from pathlib import Path; p=Path("/var/www/jetbay-admin/package.json"); d=json.loads(p.read_text()); d["name"]="jetbay-admin"; d.setdefault("dependencies",{})["@jetbay/ui"]="file:vendor/ui"; p.write_text(json.dumps(d,indent=2)+"\n"); print("patched",p)'
echo "[sync-admin] OK"
'@
$remoteSh = Join-Path $env:TEMP "jetbay-admin-extract.sh"
[System.IO.File]::WriteAllText($remoteSh, $extractBody.Replace("`r`n", "`n"))

Write-Host "[sync-admin] upload..."
ssh -o BatchMode=yes $Vps "mkdir -p $AppRoot/deploy $AppRoot/vendor $AppRoot/logs"
scp -o BatchMode=yes $tar "${Vps}:/tmp/jetbay-admin-sync.tar.gz"
scp -o BatchMode=yes $remoteSh "${Vps}:/tmp/jetbay-admin-extract.sh"
ssh -o BatchMode=yes $Vps "bash /tmp/jetbay-admin-extract.sh"
Write-Host "[sync-admin] Done."
