const express = require('express');
const router = express.Router();

// Placeholder routes para estoque
router.get('/', (req, res) => {
  res.json({
    message: 'API Estoque',
    saldo: 1250,
    movimentacoesHoje: 45
  });
});

router.post('/entrada', (req, res) => {
  res.status(201).json({ message: 'Entrada registrada' });
});

router.post('/saida', (req, res) => {
  res.status(201).json({ message: 'Saída registrada' });
});

module.exports = router;
