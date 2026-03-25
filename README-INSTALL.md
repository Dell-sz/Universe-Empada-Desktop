# 🚀 Guia de Instalação Completa - Universe da Empada

## 📋 PASSOS PARA INSTALAÇÃO

### 1. **Executar Setup Completo**
```powershell
.\setup-complete-fixed.ps1
```
Faz **tudo automaticamente**:
- ✅ Verifica Node.js + MySQL
- ✅ Instala dependências 
- ✅ Cria serviço `UniverseEmpadaBackend`
- ✅ Testa API `localhost:3000/health`
- ✅ `npm run build:win` → `.exe` em `dist/`

### 2. **Instalar App**
```
dist/Universe da Empada Setup*.exe
```
✅ Atalho desktop + backend serviço ativo

### 3. **✅ Verificar**
```powershell
Get-Service UniverseEmpadaBackend
curl http://localhost:3000/health
```

## 🎯 **ATALHOS PRONTOS**
```powershell
.\create-shortcuts.ps1
```
Cria 3 atalhos Desktop:
- `🚀 Universe da Empada` ← Setup completo
- `📱 Universe da Empada (App)` ← App direto  
- `🔍 Status Universe da Empada` ← Ver serviço

## 🔧 Problemas Comuns
| Problema | Solução |
|----------|---------|
| Serviço falha | `Restart-Service UniverseEmpadaBackend` |
| API offline | Ver MySQL + `.env` |
| Sem instalador | `npm run build:win` |

## 🛠️ Comandos Rápidos
```powershell
Restart-Service UniverseEmpadaBackend
npm run build:win
.\setup-complete-fixed.ps1
```

**🎉 Instalação one-click pronta! Use `setup-complete-fixed.ps1`**
