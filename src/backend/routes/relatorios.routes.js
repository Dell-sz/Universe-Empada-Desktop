const express = require('express');
const router = express.Router();

// Placeholder routes para relatórios
router.get('/vendas', (req, res) => {
  res.json({
    message: 'Relatório de Vendas',
    total: 2450.50,
    periodo: '01/12 a 31/12'
  });
});

router.get('/lucro', (req, res) => {
  res.json({
    lucroBruto: 1250.75,
    margem: '51%'
  });
});

module.exports = router;
