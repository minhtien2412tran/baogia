# Sync apps/web + packages/ui to VPS (Windows — no local rsync required)
$ErrorActionPreference = "Stop"
$Vps = if ($env:VPS_HOST) { $env:VPS_HOST } else { "root@103.200.20.100" }
$AppRoot = "/var/www/jetbay-web"
$Repo = (Resolve-Path (Join-Path $PSScriptRoot "..\..\..")).Path

Write-Host "[sync-web] packing from $Repo ..."
$tmp = Join-Path $env:TEMP "jetbay-web-sync"
if (Test-Path $tmp) { Remove-Item $tmp -Recurse -Force }
New-Item -ItemType Directory -Path "$tmp\web", "$tmp\ui", "$tmp\i18n", "$tmp\deploy" | Out-Null

robocopy "$Repo\apps\web" "$tmp\web" /E /XD node_modules .next coverage /NFL /NDL /NJH /NJS /nc /ns /np
if ($LASTEXITCODE -ge 8) { throw "robocopy web failed: $LASTEXITCODE" }
robocopy "$Repo\packages\ui" "$tmp\ui" /E /XD node_modules /NFL /NDL /NJH /NJS /nc /ns /np
if ($LASTEXITCODE -ge 8) { throw "robocopy ui failed: $LASTEXITCODE" }
robocopy "$Repo\packages\i18n" "$tmp\i18n" /E /XD node_modules /NFL /NDL /NJH /NJS /nc /ns /np
if ($LASTEXITCODE -ge 8) { throw "robocopy i18n failed: $LASTEXITCODE" }

Copy-Item "$Repo\scripts\deploy\jetbay-be\www.minhtien.online.http.conf" "$tmp\deploy\"
Copy-Item "$Repo\scripts\deploy\jetbay-be\www.minhtien.online.ssl.conf" "$tmp\deploy\"
Copy-Item "$Repo\scripts\deploy\jetbay-be\deploy-web.sh" "$tmp\deploy\"

# Patch package.json before upload
$pkgPath = Join-Path $tmp "web\package.json"
$pkg = Get-Content $pkgPath -Raw | ConvertFrom-Json
$pkg.name = "jetbay-web"
$pkg.dependencies | Add-Member -NotePropertyName "@jetbay/ui" -NotePropertyValue "file:vendor/ui" -Force
$pkg.dependencies | Add-Member -NotePropertyName "@jetbay/i18n" -NotePropertyValue "file:vendor/i18n" -Force
[System.IO.File]::WriteAllText($pkgPath, ($pkg | ConvertTo-Json -Depth 20) + "`n")

$tar = Join-Path $env:TEMP "jetbay-web-sync.tar.gz"
if (Test-Path $tar) { Remove-Item $tar -Force }
Push-Location $tmp
tar -czf $tar web ui i18n deploy
Pop-Location

Write-Host "[sync-web] upload..."
ssh -o BatchMode=yes $Vps "mkdir -p $AppRoot/deploy $AppRoot/vendor $AppRoot/logs"
scp -o BatchMode=yes $tar "${Vps}:/tmp/jetbay-web-sync.tar.gz"

# Remote extract script (uploaded to avoid PowerShell quoting hell)
$remoteSh = Join-Path $env:TEMP "jetbay-web-extract.sh"
$extractBody = @'
#!/usr/bin/env bash
set -euo pipefail
APP_ROOT=/var/www/jetbay-web
cd /tmp
rm -rf jetbay-web-unpack
mkdir -p jetbay-web-unpack
tar -xzf jetbay-web-sync.tar.gz -C jetbay-web-unpack
mkdir -p "$APP_ROOT"
find "$APP_ROOT" -mindepth 1 -maxdepth 1 ! -name node_modules ! -name .next ! -name .env.local ! -name logs ! -name vendor ! -name deploy -exec rm -rf {} +
cp -a /tmp/jetbay-web-unpack/web/. "$APP_ROOT/"
mkdir -p "$APP_ROOT/vendor/ui"
rm -rf "$APP_ROOT/vendor/ui"/*
cp -a /tmp/jetbay-web-unpack/ui/. "$APP_ROOT/vendor/ui/"
mkdir -p "$APP_ROOT/vendor/i18n"
rm -rf "$APP_ROOT/vendor/i18n"/*
cp -a /tmp/jetbay-web-unpack/i18n/. "$APP_ROOT/vendor/i18n/"
mkdir -p "$APP_ROOT/deploy"
cp -a /tmp/jetbay-web-unpack/deploy/. "$APP_ROOT/deploy/"
chmod +x "$APP_ROOT/deploy"/*.sh
python3 -c 'import json; from pathlib import Path; p=Path("/var/www/jetbay-web/package.json"); d=json.loads(p.read_text()); d["name"]="jetbay-web"; d.setdefault("dependencies",{})["@jetbay/ui"]="file:vendor/ui"; d.setdefault("dependencies",{})["@jetbay/i18n"]="file:vendor/i18n"; p.write_text(json.dumps(d,indent=2)+"\n"); print("patched",p)'
echo "[sync-web] OK"
'@
[System.IO.File]::WriteAllText($remoteSh, $extractBody.Replace("`r`n", "`n"))

Write-Host "[sync-web] extract on VPS..."
scp -o BatchMode=yes $remoteSh "${Vps}:/tmp/jetbay-web-extract.sh"
ssh -o BatchMode=yes $Vps "bash /tmp/jetbay-web-extract.sh"

Write-Host "[sync-web] Done. Next: deploy-web.sh on VPS"
