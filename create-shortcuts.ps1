# create-shortcuts.ps1 - Criar atalhos na área de trabalho
$WshShell = New-Object -comObject WScript.Shell
$Desktop = [Environment]::GetFolderPath("Desktop")
$projectDir = "C:\projetos\Universe-Empada-Desktop"

Write-Host "Criando atalhos na área de trabalho..." -ForegroundColor Yellow

# 1. Atalho PRINCIPAL (roda setup completo)
$Shortcut1 = $WshShell.CreateShortcut("$Desktop\🚀 Universe da Empada.lnk")
$Shortcut1.TargetPath = "powershell.exe"
$Shortcut1.Arguments = "-NoProfile -ExecutionPolicy Bypass -File `"$projectDir\setup-complete-fixed.ps1`""
$Shortcut1.WorkingDirectory = $projectDir
$Shortcut1.Description = "Universe da Empada - Instalação Completa (Backend + App)"
$Shortcut1.IconLocation = "$projectDir\src\renderer\assets\logo.png,0"
$Shortcut1.Save()

# 2. Atalho APP DIRETO (após instalação, backend serviço roda separado)
$Shortcut2 = $WshShell.CreateShortcut("$Desktop\📱 Universe da Empada (App).lnk")
$appPath = "$projectDir\dist\win-unpacked\Universe da Empada.exe"
if (Test-Path $appPath) {
    $Shortcut2.TargetPath = $appPath
} else {
    $Shortcut2.TargetPath = "explorer.exe"
    $Shortcut2.Arguments = "`"$projectDir\dist`""
}
$Shortcut2.WorkingDirectory = Split-Path $appPath -Parent
$Shortcut2.Description = "Universe da Empada - App Desktop (backend como serviço)"
$Shortcut2.IconLocation = "$projectDir\src\renderer\assets\logo.png,0"
$Shortcut2.Save()

# 3. Atalho VERIFICAÇÃO RÁPIDA
$Shortcut3 = $WshShell.CreateShortcut("$Desktop\🔍 Status Universe da Empada.lnk")
$Shortcut3.TargetPath = "powershell.exe"
$Shortcut3.Arguments = "-NoProfile -Command `"Get-Service UniverseEmpadaBackend; Write-Host 'API: http://localhost:3000/health'; pause`""
$Shortcut3.WorkingDirectory = $projectDir
$Shortcut3.Description = "Verificar status do serviço backend"
$Shortcut3.IconLocation = "$projectDir\src\renderer\assets\logo.png,0"
$Shortcut3.Save()

Write-Host "✅ 3 atalhos criados!" -ForegroundColor Green
Write-Host ""
Write-Host "📂 Área de trabalho:" -ForegroundColor Cyan
Write-Host "  🚀 Universe da Empada              ← Instalação completa" -ForegroundColor White
Write-Host "  📱 Universe da Empada (App)        ← App direto" -ForegroundColor White
Write-Host "  🔍 Status Universe da Empada       ← Verificar serviço" -ForegroundColor White
Write-Host ""
Read-Host "Pressione Enter para finalizar"

