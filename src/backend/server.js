const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors({
  origin: 'app://./',
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

// Error handler middleware
app.use(require('./middlewares/error.handler').errorHandler);

const { testConnection } = require('./models/database');
testConnection().catch(err => {
  console.error('❌ Database connection failed:', err);
  process.exit(1);
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Server ready
const server = app.listen(PORT, 'localhost', () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
});

// Graceful shutdown
// Fixed: const server = app.listen(...) above

process.on('SIGTERM', () => {
  console.log('🛑 Shutting down server...');
  server.close(() => {
    process.exit(0);
  });
});
process.on('SIGINT', () => {
  console.log('🛑 Shutting down server...');
  server.close(() => {
    process.exit(0);
  });
});

module.exports = app;

