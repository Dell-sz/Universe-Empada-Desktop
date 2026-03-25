# fix-port.ps1 - Corrigir portas para 3001
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   CORRIGINDO PORTAS PARA 3001" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 1. Matar processos
Write-Host "[1/5] Matando processos..." -ForegroundColor Yellow
taskkill /F /IM node.exe 2>$null
taskkill /F /IM electron.exe 2>$null
Start-Sleep -Seconds 2
Write-Host "✓ Processos mortos" -ForegroundColor Green

# 2. Atualizar .env
Write-Host "[2/5] Atualizando .env..." -ForegroundColor Yellow
@"
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=1234
DB_NAME=universe_empada
DB_PORT=3306
SERVER_PORT=3001
PORT=3001
"@ | Out-File -FilePath .env -Encoding UTF8
Write-Host "✓ .env atualizado com porta 3001" -ForegroundColor Green

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   CORREÇÃO CONCLUÍDA!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Agora execute:" -ForegroundColor White
Write-Host "npm run dev" -ForegroundColor White
Write-Host ""

