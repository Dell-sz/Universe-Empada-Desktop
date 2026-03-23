const express = require('express');
const router = express.Router();

// Placeholder routes para vendas
router.get('/', (req, res) => {
  res.json({
    message: 'API Vendas',
    features: ['Listar vendas', 'Registrar venda', 'Relatório diário']
  });
});

router.post('/', (req, res) => {
  res.status(201).json({ message: 'Venda registrada com sucesso' });
});

module.exports = router;
