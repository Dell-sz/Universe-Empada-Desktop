const vendaModel = require('../models/venda.model');

class VendasController {
    async listar(req, res) {
        try {
            const vendas = await vendaModel.findAll();
            res.json(vendas);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async criar(req, res) {
        try {
            const id = await vendaModel.create(req.body);
            res.status(201).json({ id, message: 'Venda registrada' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async buscarPorId(req, res) {
        try {
            const venda = await vendaModel.findById(req.params.id);
            if (!venda) return res.status(404).json({ error: 'Venda não encontrada' });
            res.json(venda);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new VendasController();

