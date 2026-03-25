Write-Host "Limpando processos..." -ForegroundColor Yellow

# Matar processos Node e Electron
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force
Get-Process electron -ErrorAction SilentlyContinue | Stop-Process -Force

Write-Host "Matando processos na porta 3000..." -ForegroundColor Yellow
$connections = netstat -ano | findstr :3000
if ($connections) {
    $pids = $connections | ForEach-Object {
        if ($_ -match '\s+(\d+)$') { $matches[1] }
    } | Select-Object -Unique
    foreach ($processId in $pids) {
        taskkill /PID $processId /F 2>$null
    }
}

Write-Host "Matando processos na porta 3001..." -ForegroundColor Yellow
$connections = netstat -ano | findstr :3001
if ($connections) {
    $pids = $connections | ForEach-Object {
        if ($_ -match '\s+(\d+)$') { $matches[1] }
    } | Select-Object -Unique
    foreach ($processId in $pids) {
        taskkill /PID $processId /F 2>$null
    }
}

Write-Host "Limpando node_modules cache..." -ForegroundColor Yellow
if (Test-Path node_modules\.cache) {
    Remove-Item -Recurse -Force node_modules\.cache -ErrorAction SilentlyContinue
}

Write-Host "✅ Limpeza concluída!" -ForegroundColor Green
Write-Host "Agora execute: npm run dev" -ForegroundColor Cyan

