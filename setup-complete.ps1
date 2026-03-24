# setup-complete.ps1 - Versão Simplificada e Corrigida
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   UNIVERSE DA EMPADA - INSTALACAO" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 1. Parar processos
Write-Host "[1/4] Parando processos..." -ForegroundColor Yellow
taskkill /F /IM node.exe 2>$null
taskkill /F /IM electron.exe 2>$null
Write-Host "OK" -ForegroundColor Green

# 2. Verificar Node.js
Write-Host "[2/4] Verificando Node.js..." -ForegroundColor Yellow
$nodePath = (Get-Command node -ErrorAction SilentlyContinue).Source
if (-not $nodePath) {
    Write-Host "ERRO: Node.js nao encontrado!" -ForegroundColor Red
    Write-Host "Instale o Node.js em: https://nodejs.org/" -ForegroundColor Yellow
    pause
    exit 1
}
Write-Host "Node.js encontrado: $nodePath" -ForegroundColor Green

# 3. Instalar dependencias
Write-Host "[3/4] Instalando dependencias..." -ForegroundColor Yellow
npm install
Write-Host "Dependencias instaladas" -ForegroundColor Green

# 4. Gerar build
Write-Host "[4/4] Gerando build do app..." -ForegroundColor Yellow

# Limpar build anterior
if (Test-Path "dist") {
    Remove-Item -Recurse -Force "dist" -ErrorAction SilentlyContinue
}

# Executar build
npm run build:win

# Verificar resultado
if (Test-Path "dist") {
    $installers = Get-ChildItem "dist\*.exe" -ErrorAction SilentlyContinue
    if ($installers) {
        Write-Host ""
        Write-Host "========================================" -ForegroundColor Green
        Write-Host "   INSTALACAO CONCLUIDA!" -ForegroundColor Green
        Write-Host "========================================" -ForegroundColor Green
        Write-Host ""
        Write-Host "Instalador criado: $($installers[0].Name)" -ForegroundColor White
        Write-Host "Local: $($installers[0].FullName)" -ForegroundColor White
        Write-Host ""
        Write-Host "Para instalar, execute o arquivo acima." -ForegroundColor Yellow
        Write-Host ""
        
        # Perguntar se quer abrir a pasta
        $resposta = Read-Host "Abrir pasta do instalador? (S/N)"
        if ($resposta -eq 'S' -or $resposta -eq 's') {
            explorer.exe /select,$installers[0].FullName
        }
    } else {
        Write-Host "ERRO: Nenhum instalador encontrado na pasta dist" -ForegroundColor Red
    }
} else {
    Write-Host "ERRO: Pasta dist nao criada. Build falhou!" -ForegroundColor Red
}