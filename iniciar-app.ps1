# iniciar-app.ps1 - Script completo para iniciar o sistema
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   UNIVERSE DA EMPADA" -ForegroundColor Cyan
Write-Host "   Iniciando sistema..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 1. Verificar se backend já está rodando
Write-Host "[1/3] Verificando backend..." -ForegroundColor Yellow
$backendRunning = $false
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3001/api/health" -UseBasicParsing -TimeoutSec 2 -ErrorAction SilentlyContinue
    if ($response.StatusCode -eq 200) {
        $backendRunning = $true
        Write-Host "  ✓ Backend já está rodando" -ForegroundColor Green
    }
} catch {
    Write-Host "  Backend não está rodando" -ForegroundColor Yellow
}

# 2. Iniciar backend se necessário
if (-not $backendRunning) {
    Write-Host "[2/3] Iniciando backend..." -ForegroundColor Yellow
    $backendPath = "C:\projetos\Universe-Empada-Desktop\src\backend\server.js"
    
    # Iniciar backend em janela oculta
    Start-Process powershell -ArgumentList "-WindowStyle Hidden", "-NoExit", "-Command", "cd C:\projetos\Universe-Empada-Desktop; node src/backend/server.js"
    
    Write-Host "  ✓ Backend iniciado (aguardando...)" -ForegroundColor Green
    Start-Sleep -Seconds 4
}

# 3. Iniciar o app
Write-Host "[3/3] Iniciando aplicativo..." -ForegroundColor Yellow
$appPath = "C:\projetos\Universe-Empada-Desktop\dist\win-unpacked\Universe da Empada.exe"

if (Test-Path $appPath) {
    Start-Process $appPath
    Write-Host "  ✓ App iniciado!" -ForegroundColor Green
} else {
    Write-Host "  ✗ App não encontrado em: $appPath" -ForegroundColor Red
    Write-Host "  Tentando executar em modo desenvolvimento..." -ForegroundColor Yellow
    npm run dev
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "   SISTEMA INICIADO COM SUCESSO!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Para fechar o sistema:" -ForegroundColor Yellow
Write-Host "  1. Feche a janela do app" -ForegroundColor White
Write-Host "  2. O backend continuará rodando em segundo plano" -ForegroundColor White
Write-Host "  3. Para parar o backend, feche a janela do PowerShell que está rodando" -ForegroundColor White
Write-Host ""