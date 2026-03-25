Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   UNIVERSE DA EMPADA - BUILD FINAL" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 1. Limpar builds anteriores
Write-Host "[1/5] Limpando builds anteriores..." -ForegroundColor Yellow
Remove-Item -Recurse -Force dist -ErrorAction SilentlyContinue
Write-Host "✓ Limpo" -ForegroundColor Green

# 2. Fazer build do Electron
Write-Host "[2/5] Gerando build do Electron..." -ForegroundColor Yellow
npm run build:win
Write-Host "✓ Build concluído" -ForegroundColor Green

# 3. Copiar backend para o local correto (múltiplos locais para garantir)
Write-Host "[3/5] Copiando backend para o app..." -ForegroundColor Yellow

# Locais onde o backend pode estar
$targetPaths = @(
    "dist\win-unpacked\resources\backend",
    "dist\win-unpacked\resources\app.asar.unpacked\backend",
    "dist\win-unpacked\backend"
)

foreach ($targetPath in $targetPaths) {
    $fullPath = Join-Path $PWD.Path $targetPath
    New-Item -ItemType Directory -Path $fullPath -Force | Out-Null
    Copy-Item -Path "src\backend\*" -Destination $fullPath -Recurse -Force
    Write-Host "  ✓ Copiado para: $targetPath" -ForegroundColor Gray
}

# 4. Criar arquivo .env dentro do app
Write-Host "[4/5] Criando .env no app..." -ForegroundColor Yellow
$envContent = @"
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=1234
DB_NAME=universe_empada
DB_PORT=3306
SERVER_PORT=3001
PORT=3001
NODE_ENV=production
"@

foreach ($targetPath in $targetPaths) {
    $envFile = Join-Path $PWD.Path "$targetPath\.env"
    $envContent | Out-File -FilePath $envFile -Encoding UTF8
    Write-Host "  ✓ .env criado em: $targetPath" -ForegroundColor Gray
}

# 5. Verificar
Write-Host "[5/5] Verificando build..." -ForegroundColor Yellow
$backendFound = $false
foreach ($targetPath in $targetPaths) {
    $serverJs = Join-Path $PWD.Path "$targetPath\server.js"
    if (Test-Path $serverJs) {
        Write-Host "  ✅ Backend encontrado em: $targetPath" -ForegroundColor Green
        $backendFound = $true
    }
}

if (-not $backendFound) {
    Write-Host "  ❌ ERRO: Backend não encontrado em nenhum local!" -ForegroundColor Red
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "   BUILD CONCLUÍDO!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Instalador: dist\Universe da Empada Setup *.exe" -ForegroundColor Yellow
Write-Host ""
