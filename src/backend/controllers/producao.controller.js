const producaoModel = require('../models/producao.model');

class ProducaoController {
    async listar(req, res) {
        try {
            const { days } = req.query;
            const producao = await producaoModel.findAll(days);
            res.json(producao);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    
    async producaoHoje(req, res) {
        try {
            const hoje = await producaoModel.findByDate(new Date().toISOString().split('T')[0]);
            res.json({ total: hoje.reduce((sum, p) => sum + p.quantidade, 0), itens: hoje });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    
    async porProduto(req, res) {
        try {
            const producao = await producaoModel.findByProduto(req.params.id);
            res.json(producao);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    
    async registrar(req, res) {
        try {
            const { produto_id, quantidade, funcionario, observacoes, data_producao } = req.body;
            
            if (!produto_id || !quantidade || !funcionario) {
                return res.status(400).json({ error: 'Campos obrigatórios não preenchidos' });
            }
            
            const id = await producaoModel.create(req.body);
            res.status(201).json({ id, message: 'Produção registrada com sucesso' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    
    async atualizar(req, res) {
        try {
            const updated = await producaoModel.update(req.params.id, req.body);
            if (!updated) {
                return res.status(404).json({ error: 'Registro não encontrado' });
            }
            res.json({ message: 'Registro atualizado com sucesso' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    
    async excluir(req, res) {
        try {
            const deleted = await producaoModel.delete(req.params.id);
            if (!deleted) {
                return res.status(404).json({ error: 'Registro não encontrado' });
            }
            res.json({ message: 'Registro excluído com sucesso' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new ProducaoController();

