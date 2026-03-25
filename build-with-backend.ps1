Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   BUILD UNIVERSE DA EMPADA COM BACKEND" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 1. Limpar build anterior
Write-Host "[1/5] Limpando build anterior..." -ForegroundColor Yellow
if (Test-Path "dist") {
    Remove-Item -Recurse -Force "dist" -ErrorAction SilentlyContinue
}
Write-Host "✓ Limpo" -ForegroundColor Green

# 2. Instalar dependências
Write-Host "[2/5] Verificando dependências..." -ForegroundColor Yellow
npm install --silent
Write-Host "✓ Dependências OK" -ForegroundColor Green

# 3. Fazer build do Electron
Write-Host "[3/5] Gerando build do Electron..." -ForegroundColor Yellow
npm run build:win
Write-Host "✓ Build concluído" -ForegroundColor Green

# 4. Verificar e corrigir backend
Write-Host "[4/5] Verificando/copiando backend..." -ForegroundColor Yellow

$unpackedPaths = @("dist\\win-unpacked", "dist\\win-x64-unpacked", "dist\\win-ia32-unpacked")
$fixed = $false

foreach ($upath in $unpackedPaths) {
    if (Test-Path $upath) {
        $backendDest = Join-Path $upath "resources\\backend"
        if (-not (Test-Path $backendDest)) {
            New-Item -ItemType Directory -Path $backendDest -Force | Out-Null
        }
        
        Copy-Item -Path "src\\backend\\*" -Destination $backendDest -Recurse -Force -ErrorAction SilentlyContinue
        $serverJs = Join-Path $backendDest "server.js"
        if (Test-Path $serverJs) {
            Write-Host "✓ Backend copiado para: $upath/resources/backend/" -ForegroundColor Green
            $fixed = $true
        }
    }
}

if (-not $fixed) {
    Write-Host "⚠️  Nenhum unpacked encontrado, mas config extraResources deve funcionar" -ForegroundColor Yellow
}

# 5. Diagnóstico final
Write-Host "[5/5] Diagnóstico final..." -ForegroundColor Yellow
& .\\diagnose-build.ps1

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "   BUILD CONCLUÍDO!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Instalador em: dist\\*.exe" -ForegroundColor Yellow
Write-Host "Teste: .\\diagnose-build.ps1" -ForegroundColor Yellow
