@echo off
REM JetBay / JetVina — Windows pre-commit (Git for Windows calls this via husky-style shim)
cd /d "%~dp0..\.."
node scripts/security/scan-secrets.mjs --staged
if errorlevel 1 exit /b 1
