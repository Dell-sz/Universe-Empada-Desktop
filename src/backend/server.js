const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors({
  origin: 'app://./', // Electron origin
  methods: ['GET', 'POST', 'PUT', 'DELETE']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));\napp.use(require('body-parser').json());\napp.use(require('body-parser').urlencoded({ extended: true }));\n\n// Serve static files for renderer
app.use('/assets', express.static(path.join(__dirname, '../renderer/assets')));
app.use('/pages', express.static(path.join(__dirname, '../renderer/pages')));

// API Routes
app.use('/api/produtos', require('./routes/produtos.routes'));
app.use('/api/producao', require('./routes/producao.routes'));
app.use('/api/vendas', require('./routes/vendas.routes'));
app.use('/api/estoque', require('./routes/estoque.routes'));
app.use('/api/relatorios', require('./routes/relatorios.routes'));
app.use('/api/dashboard', require('./routes/dashboard.routes'));

// Error handler
app.use(require('./middlewares/error.handler'));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

const { testConnection } = require('./models/database');\n\nconst startServer = async () => {\n  const dbConnected = await testConnection();\n  \n  if (!dbConnected) {\n    console.error('❌ Não foi possível conectar ao banco de dados. Encerrando...');\n    process.exit(1);\n  }\n\n  const server = app.listen(PORT, 'localhost', () => {\n    console.log(`🚀 Servidor rodando na porta ${PORT}`);\n  });\n  return server;\n};\n\nstartServer().catch(console.error);

// Graceful shutdown
process.on('SIGTERM', shutDown);
process.on('SIGINT', shutDown);

function shutDown() {
  console.log('🛑 Encerrando servidor...');
  server.close(() => {
    process.exit(0);
  });
}

module.exports = app;
