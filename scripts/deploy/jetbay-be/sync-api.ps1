# Sync apps/api to VPS (Windows)
$ErrorActionPreference = "Stop"
$Vps = if ($env:VPS_HOST) { $env:VPS_HOST } else { "root@103.200.20.100" }
$AppRoot = "/var/www/jetbay-be"
$Repo = (Resolve-Path (Join-Path $PSScriptRoot "..\..\..")).Path

Write-Host "[sync-api] packing..."
$tmp = Join-Path $env:TEMP "jetbay-api-sync"
if (Test-Path $tmp) { Remove-Item $tmp -Recurse -Force }
New-Item -ItemType Directory -Path "$tmp\api", "$tmp\deploy" | Out-Null

robocopy "$Repo\apps\api" "$tmp\api" /E /XD node_modules dist coverage /XF .env .env.local /NFL /NDL /NJH /NJS /nc /ns /np
if ($LASTEXITCODE -ge 8) { throw "robocopy api failed: $LASTEXITCODE" }
# Never ship local secrets
Remove-Item "$tmp\api\.env" -ErrorAction SilentlyContinue
Remove-Item "$tmp\api\.env.local" -ErrorAction SilentlyContinue
robocopy "$Repo\scripts\deploy\jetbay-be" "$tmp\deploy" /E /NFL /NDL /NJH /NJS /nc /ns /np
if ($LASTEXITCODE -ge 8) { throw "robocopy deploy failed: $LASTEXITCODE" }

$tar = Join-Path $env:TEMP "jetbay-api-sync.tar.gz"
if (Test-Path $tar) { Remove-Item $tar -Force }
Push-Location $tmp
tar -czf $tar api deploy
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
find "$APP_ROOT" -mindepth 1 -maxdepth 1 ! -name node_modules ! -name dist ! -name .env ! -name logs ! -name uploads ! -name deploy ! -name .db_password.generated -exec rm -rf {} +
cp -a /tmp/jetbay-api-unpack/api/. "$APP_ROOT/"
mkdir -p "$APP_ROOT/deploy"
cp -a /tmp/jetbay-api-unpack/deploy/. "$APP_ROOT/deploy/"
chmod +x "$APP_ROOT/deploy"/*.sh 2>/dev/null || true
echo "[sync-api] OK"
'@
$remoteSh = Join-Path $env:TEMP "jetbay-api-extract.sh"
[System.IO.File]::WriteAllText($remoteSh, $extractBody.Replace("`r`n", "`n"))

Write-Host "[sync-api] upload..."
ssh -o BatchMode=yes $Vps "mkdir -p $AppRoot/deploy $AppRoot/logs $AppRoot/uploads"
scp -o BatchMode=yes $tar "${Vps}:/tmp/jetbay-api-sync.tar.gz"
scp -o BatchMode=yes $remoteSh "${Vps}:/tmp/jetbay-api-extract.sh"
ssh -o BatchMode=yes $Vps "bash /tmp/jetbay-api-extract.sh"
Write-Host "[sync-api] Done."
