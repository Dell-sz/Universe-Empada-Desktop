## 📁 ESTRUTURA DE PASTAS PROPOSTA

```
universe-empada-desktop/
├── src/                          
│   ├── main/                      
│   │   ├── main.js                
│   │   ├── preload.js             
│   │   └── menu.js                
│   ├── renderer/                  
│   │   ├── index.html             
│   │   ├── renderer.js            
│   │   ├── styles/                
│   │   │   ├── main.css
│   │   └── pages/                 
│   ├── backend/                    
│   │   ├── server.js              
│   │   ├── routes/                
│   │   │   ├── produtos.routes.js 
│   │   │   ├── producao.routes.js 
│   │   │   └── vendas.routes.js   
│   │   ├── controllers/           
│   │   ├── models/                
│   │   └── services/              
│   └── database/                  
│       ├── schema.sql             
│       └── seeds.sql              
├── .env                           
├── package.json                   
└── README.md                      
```

## 🚀 COMO EXECUTAR

1. **Configure o MySQL:** Edit `.env` with your MySQL creds (DB_USER=root, DB_PASSWORD=, DB_NAME=universe_empada). Create DB/tables:\n   ```bash\n   npm run db:init\n   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Execute em desenvolvimento:**
   ```bash
   npm run dev
   ```

4. **Para build do instalador Windows:**
   ```bash
   npm run build:win
   ```

Backend API available at http://localhost:3000/api/produtos

Frontend loaded via Electron.

## 📝 PRÓXIMOS PASSOS

1. Implement routes to use controllers (basic CRUD working)
2. Expand frontend pages
3. Add authentication
4. Reports with charts
5. Backup system

Backend functional with produtos CRUD. Database universe_empada with all tables.

