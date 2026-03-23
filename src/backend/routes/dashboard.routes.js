const express = require('express');
const router = express.Router();
const db = require('../models/database');

// GET /api/dashboard - Métricas principais
router.get('/', async (req, res, next) => {
  try {
    const hoje = new Date().toISOString().split('T')[0];

    const [vendasHoje] = await db.execute(
      'SELECT COUNT(*) as total FROM vendas WHERE DATE(data_venda) = ?',
      [hoje]
    );

    const [producaoHoje] = await db.execute(
      'SELECT SUM(quantidade) as total FROM producao WHERE data_producao = ?',
      [hoje]
    );

    const [estoqueTotal] = await db.execute(`
      SELECT SUM(CASE WHEN tipo_movimento = 'ENTRADA' THEN quantidade ELSE -quantidade END) as total
      FROM estoque
    `);

    res.json({
      vendasHoje: vendasHoje[0].total || 0,
      producaoHoje: producaoHoje[0].total || 0,
      estoqueTotal: estoqueTotal[0].total || 0
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
