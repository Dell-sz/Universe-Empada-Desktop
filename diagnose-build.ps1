Write-Host "Diagnóstico do Build - Universe da Empada" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Verificar pasta dist
if (Test-Path "dist") {
    Write-Host "✅ Pasta dist existe" -ForegroundColor Green
    
    # Procurar pelo executável
    $exe = Get-ChildItem "dist" -Recurse -Filter "*.exe" | Where-Object { $_.Name -like "*Universe*" }
    if ($exe) {
        Write-Host "✅ Executável encontrado: $($exe.Name)" -ForegroundColor Green
    }
    
    # Procurar unpacked
    $unpackedPaths = @("dist\\win-unpacked", "dist\\win-x64-unpacked", "dist\\win-ia32-unpacked")
    foreach ($upath in $unpackedPaths) {
        if (Test-Path $upath) {
            Write-Host "`n📁 Analisando $upath" -ForegroundColor Yellow
            $backendServer = Join-Path $upath "resources\\backend\\server.js"
            if (Test-Path $backendServer) {
                Write-Host "✅ Backend server.js: $backendServer" -ForegroundColor Green
            } else {
                Write-Host "❌ Backend server.js NÃO encontrado: $backendServer" -ForegroundColor Red
            }
            
            $resources = Join-Path $upath "resources"
            if (Test-Path $resources) {
                $backendDir = Join-Path $resources "backend"
                if (Test-Path $backendDir) {
                    $files = Get-ChildItem $backendDir -Recurse
                    Write-Host "📂 Backend files ($($files.Count)):" -ForegroundColor Gray
                    $files | ForEach-Object { Write-Host "  - $($_.FullName)" -ForegroundColor Gray }
                } else {
                    Write-Host "❌ Pasta backend não existe: $backendDir" -ForegroundColor Red
                }
            }
        }
    }
    
} else {
    Write-Host "❌ Pasta dist não existe. Execute: npm run build:win" -ForegroundColor Red
}

Write-Host ""
Write-Host "Para build completo com backend: .\\build-with-backend.ps1" -ForegroundColor Yellow
