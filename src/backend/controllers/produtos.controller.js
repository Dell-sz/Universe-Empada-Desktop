const produtoModel = require('../models/produto.model');

class ProdutosController {
    async listar(req, res) {
        try {
            const produtos = await produtoModel.findAll();
            res.json(produtos);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async buscarPorId(req, res) {
        try {
            const produto = await produtoModel.findById(req.params.id);
            if (!produto) {
                return res.status(404).json({ error: 'Produto não encontrado' });
            }
            res.json(produto);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async criar(req, res) {
        try {
            const { nome, categoria, preco_venda, estoque_minimo } = req.body;
            
            // Validações básicas
            if (!nome || !categoria || !preco_venda) {
                return res.status(400).json({ error: 'Campos obrigatórios não preenchidos' });
            }

            const id = await produtoModel.create(req.body);
            res.status(201).json({ id, message: 'Produto criado com sucesso' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async atualizar(req, res) {
        try {
            const updated = await produtoModel.update(req.params.id, req.body);
            if (!updated) {
                return res.status(404).json({ error: 'Produto não encontrado' });
            }
            res.json({ message: 'Produto atualizado com sucesso' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async excluir(req, res) {
        try {
            const deleted = await produtoModel.delete(req.params.id);
            if (!deleted) {
                return res.status(404).json({ error: 'Produto não encontrado' });
            }
            res.json({ message: 'Produto excluído com sucesso' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async estoqueBaixo(req, res) {
        try {
            const produtos = await produtoModel.findLowStock();
            res.json(produtos);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new ProdutosController();

