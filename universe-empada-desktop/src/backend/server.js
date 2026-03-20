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
app.use(express.urlencoded({ extended: true }));

// Serve static files for renderer
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

const server = app.listen(PORT, 'localhost', () => {
  console.log(`🚀 Backend rodando em http://localhost:${PORT}`);
  console.log(`📊 Health: http://localhost:${PORT}/health`);
});

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
