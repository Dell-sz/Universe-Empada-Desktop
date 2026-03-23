# Universe Empada - Fix Port 3001 Task

## ✅ Step 1: Analyze files (Completed)
- [x] Identified files with port 3000 via reads/search
- [x] Confirmed changes needed in 4 files (+.env skipped)
- [x] User approved plan

## ✅ Step 2: Update configuration (Skipped)
- [x] .env access denied by policy - manual update recommended

## ✅ Step 3: Update main.js
- [x] Replaced http://localhost:3000 → 3001 in ipcMain

## ✅ Step 4: Update HTML pages
- [x] dashboard.html API_URL → 3001/api
- [x] produtos.html API_URL → 3001/api  
- [x] producao.html API_URL → 3001/api

## ⬜ Step 5: Test changes
- [ ] Kill node/electron processes
- [ ] Test curl http://localhost:3001/api/health
- [ ] Run npm run dev

## ⬜ Step 6: Complete
- [ ] Verify no fetch errors
- [ ] Update TODO.md as done
- [ ] attempt_completion

