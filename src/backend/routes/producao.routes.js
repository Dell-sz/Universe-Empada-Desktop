const express = require('express');
const router = express.Router();
const producaoController = require('../controllers/producao.controller');

router.get('/', producaoController.listar);
router.get('/today', producaoController.producaoHoje);
router.get('/produto/:id', producaoController.porProduto);
router.post('/', producaoController.registrar);
router.put('/:id', producaoController.atualizar);
router.delete('/:id', producaoController.excluir);

module.exports = router;

