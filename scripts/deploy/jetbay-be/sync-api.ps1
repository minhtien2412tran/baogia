# Sync apps/api to VPS (Windows)
$ErrorActionPreference = "Stop"
$Vps = if ($env:VPS_HOST) { $env:VPS_HOST } else { "root@103.200.20.100" }
$AppRoot = "/var/www/jetbay-be"
$Repo = (Resolve-Path (Join-Path $PSScriptRoot "..\..\..")).Path

Write-Host "[sync-api] packing..."
$tmp = Join-Path $env:TEMP "jetbay-api-sync"
if (Test-Path $tmp) { Remove-Item $tmp -Recurse -Force }
New-Item -ItemType Directory -Path "$tmp\api", "$tmp\i18n", "$tmp\deploy" | Out-Null

robocopy "$Repo\apps\api" "$tmp\api" /E /XD node_modules dist coverage /XF .env .env.local /NFL /NDL /NJH /NJS /nc /ns /np
if ($LASTEXITCODE -ge 8) { throw "robocopy api failed: $LASTEXITCODE" }
robocopy "$Repo\packages\i18n" "$tmp\i18n" /E /XD node_modules dist /NFL /NDL /NJH /NJS /nc /ns /np
if ($LASTEXITCODE -ge 8) { throw "robocopy i18n failed: $LASTEXITCODE" }
Remove-Item "$tmp\api\.env" -ErrorAction SilentlyContinue
Remove-Item "$tmp\api\.env.local" -ErrorAction SilentlyContinue
robocopy "$Repo\scripts\deploy\jetbay-be" "$tmp\deploy" /E /NFL /NDL /NJH /NJS /nc /ns /np
if ($LASTEXITCODE -ge 8) { throw "robocopy deploy failed: $LASTEXITCODE" }

$pkgPath = Join-Path $tmp "api\package.json"
$pkg = Get-Content $pkgPath -Raw | ConvertFrom-Json
$pkg.dependencies | Add-Member -NotePropertyName "@jetbay/i18n" -NotePropertyValue "file:vendor/i18n" -Force
[System.IO.File]::WriteAllText($pkgPath, ($pkg | ConvertTo-Json -Depth 20) + "`n")

$tar = Join-Path $env:TEMP "jetbay-api-sync.tar.gz"
if (Test-Path $tar) { Remove-Item $tar -Force }
Push-Location $tmp
tar -czf $tar api i18n deploy
Pop-Location

$extractBody = @'
#!/usr/bin/env bash
set -euo pipefail
APP_ROOT=/var/www/jetbay-be
cd /tmp
rm -rf jetbay-api-unpack
mkdir -p jetbay-api-unpack
tar -xzf jetbay-api-sync.tar.gz -C jetbay-api-unpack
mkdir -p "$APP_ROOT"
find "$APP_ROOT" -mindepth 1 -maxdepth 1 ! -name node_modules ! -name dist ! -name .env ! -name logs ! -name uploads ! -name deploy ! -name vendor ! -name .db_password.generated -exec rm -rf {} +
cp -a /tmp/jetbay-api-unpack/api/. "$APP_ROOT/"
mkdir -p "$APP_ROOT/vendor/i18n"
rm -rf "$APP_ROOT/vendor/i18n"/*
cp -a /tmp/jetbay-api-unpack/i18n/. "$APP_ROOT/vendor/i18n/"
mkdir -p "$APP_ROOT/deploy"
cp -a /tmp/jetbay-api-unpack/deploy/. "$APP_ROOT/deploy/"
python3 -c 'import json; from pathlib import Path; p=Path("/var/www/jetbay-be/package.json"); d=json.loads(p.read_text()); d.setdefault("dependencies",{})["@jetbay/i18n"]="file:vendor/i18n"; p.write_text(json.dumps(d,indent=2)+"\n"); print("patched",p)'
chmod +x "$APP_ROOT/deploy"/*.sh 2>/dev/null || true
echo "[sync-api] OK"
'@
$remoteSh = Join-Path $env:TEMP "jetbay-api-extract.sh"
[System.IO.File]::WriteAllText($remoteSh, $extractBody.Replace("`r`n", "`n"))

Write-Host "[sync-api] upload..."
ssh -o BatchMode=yes $Vps "mkdir -p $AppRoot/deploy $AppRoot/logs $AppRoot/uploads $AppRoot/vendor"
scp -o BatchMode=yes $tar "${Vps}:/tmp/jetbay-api-sync.tar.gz"
scp -o BatchMode=yes $remoteSh "${Vps}:/tmp/jetbay-api-extract.sh"
ssh -o BatchMode=yes $Vps "bash /tmp/jetbay-api-extract.sh"
Write-Host "[sync-api] Done. Next: deploy-api.sh on VPS"
