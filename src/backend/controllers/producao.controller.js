const producaoModel = require('../models/producao.model');

class ProducaoController {
    async listar(req, res) {
        try {
            const producoes = await producaoModel.findAll();
            res.json(producoes);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async criar(req, res) {
        try {
            const id = await producaoModel.create(req.body);
            res.status(201).json({ id, message: 'Produção registrada' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async buscarPorId(req, res) {
        try {
            const producao = await producaoModel.findById(req.params.id);
            if (!producao) return res.status(404).json({ error: 'Produção não encontrada' });
            res.json(producao);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async porData(req, res) {
        try {
            const producoes = await producaoModel.findByDate(req.params.data);
            res.json(producoes);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async excluir(req, res) {
        try {
            const deleted = await producaoModel.delete(req.params.id);
            if (!deleted) return res.status(404).json({ error: 'Produção não encontrada' });
            res.json({ message: 'Produção excluída' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new ProducaoController();

