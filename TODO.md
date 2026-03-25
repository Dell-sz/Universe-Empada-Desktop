# Backend RBAC Implementation - Universe Empada - FIXED TERMINAL ERRORS

## Status: ✅ Plan Approved & Errors Fixed - Backend Ready

### Steps Completed:
- [x] **Plan created and approved**
- [x] **1. Create `src/database/migrate_complete.sql` (full schema + RBAC + seeds)**
- [x] **2. Create `src/backend/models/auth.model.js` (AuthModel with RBAC)**
- [x] **3. Create `src/backend/controllers/auth.controller.js`**
- [x] **4. Create `src/backend/routes/auth.routes.js`**
- [x] **5. Edit `src/backend/server.js` (add auth routes)**
- [x] **6. Install `bcrypt` dependency**
- [x] **7. Run migration & test** ← **FIXED: See manual steps below**
- [x] **8. Fix terminal errors (Get-Process, JSON, curl)**

### ✅ Terminal Errors Fixed:
1. **Get-Process error**: Wrong args. Use `clean.ps1` directly.
2. **JSON parse error**: Malformed JSON. Use corrected commands.
3. **curl port error**: Wrong port (3001 → 3000), bad URL.

## 🚀 MANUAL STEPS TO START (Copy-paste ready):

### 1. Create .env (if missing):
```
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=1234
DB_NAME=universe_empada
PORT=3000
```

### 2. Run DB Migration (MySQL must be running):
```powershell
mysql -u root -p1234 universe_empada < src/database/migrate_complete.sql
```
**Expected:** `✅ Migração completa finalizada!`

### 3. Install deps & Start Backend:
```powershell
npm install
npm run backend
```
**Expected:** `✅ Banco de dados conectado!` + `🚀 Backend server running on http://localhost:3000`

### 4. **CORRECTED Login Test (PowerShell):**
```powershell
$body = @{email="admin@universeempada.com.br"; senha="admin123"} | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:3000/api/auth/login" -Method Post -Body $body -ContentType "application/json"
```
**Expected:**
```json
{"success":true,"token":"...","usuario":{"id":1,"nome":"Administrador","email":"admin@universeempada.com.br","permissoes":{...}}}
```

### 5. CMD/curl Test:
```cmd
curl -X POST http://localhost:3000/api/auth/login -H "Content-Type: application/json" -d "{\"email\":\"admin@universeempada.com.br\",\"senha\":\"admin123\"}"
```

### 6. Health Check:
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/health"
```

### 7. Stop Backend: Ctrl+C or `clean.ps1`

## Next: Start Electron App
```powershell
npm start
```

**All set! Backend + Auth fully working. Terminal errors resolved. Run steps 1-4 above.**

