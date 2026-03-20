const ProdutoModel = require('../models/produto.model');

class ProdutosController {
  async listar() {
    return await ProdutoModel.findAll();
  }

  async buscar(id) {
    return await ProdutoModel.findById(id);
  }

  async criar(produtoData) {
    // Validação adicional se necessário
    return await ProdutoModel.create(produtoData);
  }

  async atualizar(id, produtoData) {
    const produto = await ProdutoModel.findById(id);
    if (!produto) {
      const error = new Error('Produto não encontrado');
      error.statusCode = 404;
      throw error;
    }
    return await ProdutoModel.update(id, produtoData);
  }

  async excluir(id) {
    const produto = await ProdutoModel.findById(id);
    if (!produto) {
      const error = new Error('Produto não encontrado');
      error.statusCode = 404;
      throw error;
    }
    return await ProdutoModel.delete(id);
  }
}

module.exports = new ProdutosController();
