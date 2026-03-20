# 🥟 Universe Empadas Desktop

Aplicação **completa** desktop para gerenciamento de produção e vendas de empadas.

## 🚀 Como usar

### 1. Pré-requisitos

```
- Node.js 18+
- MySQL 8.0+
```

### 2. Banco de dados

```bash
mysql -u root -p < src/database/schema.sql
mysql -u root empadas_db -p < src/database/seeds.sql
```

**Configurar .env:**

```
DB_HOST=localhost
DB_USER=root  
DB_PASS=sua_senha
DB_NAME=empadas_db
PORT=3000
```

### 3. Instalação e Execução

```bash
cd universe-empada-desktop
npm install
npm start
```

### 4. Build para distribuição

```bash
npm run build
```

## 📁 Estrutura

```
├── src/main/         # Electron (main process)
├── src/renderer/     # Interface (frontend)  
├── src/backend/      # API REST (Express + MySQL)
└── src/database/     # Schema SQL
```

## ✨ Funcionalidades

✅ **Dashboard** com métricas em tempo real  
✅ **Produtos** CRUD completo  
✅ **Produção** registro por turno  
✅ **Vendas** com cliente e pagamento  
✅ **Estoque** entradas/saídas automáticas  
✅ **Relatórios** lucro e performance  

## 📊 Banco de dados

```
produtos, producao, vendas, estoque, perdas
Relacionamentos FK completos
Índices de performance
```

## 🔧 Desenvolvimento

```
npm run dev     # Modo desenvolvimento
npm start       # Produção local
```

**Backend API:** `http://localhost:3000/health`

## 📦 Build multiplataforma

```
Windows: .exe no diretório dist/
Linux/Mac: Suporte nativo
```

---

**Feito com ❤️ para empadas!** 🥟✨
