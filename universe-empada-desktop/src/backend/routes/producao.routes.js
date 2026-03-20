const express = require('express');
const router = express.Router();

// Placeholder routes para produção
router.get('/', (req, res) => {
  res.json({ message: 'API Produção - Em desenvolvimento', endpoints: ['GET /', 'POST /', 'GET /:id'] });
});

router.post('/', (req, res) => {
  res.status(201).json({ message: 'Produção registrada com sucesso' });
});

module.exports = router;
