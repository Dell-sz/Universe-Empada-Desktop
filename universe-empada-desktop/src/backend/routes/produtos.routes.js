const express = require('express');
const router = express.Router();
const ProdutoController = require('../controllers/produtos.controller');
const { validateId, validateProduto } = require('../middlewares/validators');

// GET /api/produtos - Lista todos produtos
router.get('/', async (req, res, next) => {
  try {
    const produtos = await ProdutoController.listar();
    res.json(produtos);
  } catch (error) {
    next(error);
  }
});

// GET /api/produtos/:id
router.get('/:id', validateId, async (req, res, next) => {
  try {
    const produto = await ProdutoController.buscar(req.params.id);
    if (!produto) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }
    res.json(produto);
  } catch (error) {
    next(error);
  }
});

// POST /api/produtos
router.post('/', validateProduto, async (req, res, next) => {
  try {
    const id = await ProdutoController.criar(req.body);
    res.status(201).json({ id, message: 'Produto criado com sucesso' });
  } catch (error) {
    next(error);
  }
});

// PUT /api/produtos/:id
router.put('/:id', validateId, validateProduto, async (req, res, next) => {
  try {
    await ProdutoController.atualizar(req.params.id, req.body);
    res.json({ message: 'Produto atualizado com sucesso' });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/produtos/:id
router.delete('/:id', validateId, async (req, res, next) => {
  try {
    await ProdutoController.excluir(req.params.id);
    res.json({ message: 'Produto excluído com sucesso' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
