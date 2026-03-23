const { pool } = require('./database');

class ProducaoModel {
    async create(producao) {
        const { produto_id, quantidade, funcionario, observacoes, data_producao } = producao;
        const [result] = await pool.query(
            'INSERT INTO producao (produto_id, quantidade, funcionario, observacoes, data_producao) VALUES (?, ?, ?, ?, ?)',
            [produto_id, quantidade, funcionario, observacoes, data_producao]
        );
        return result.insertId;
    }

    async findAll() {
        const [rows] = await pool.query(
            'SELECT p.*, pr.nome as produto_nome FROM producao p JOIN produtos pr ON p.produto_id = pr.id ORDER BY data_producao DESC'
        );
        return rows;
    }

    async findById(id) {
        const [rows] = await pool.query(
            'SELECT p.*, pr.nome as produto_nome FROM producao p JOIN produtos pr ON p.produto_id = pr.id WHERE p.id = ?',
            [id]
        );
        return rows[0];
    }

    async findByDate(data_producao) {
        const [rows] = await pool.query(
            'SELECT p.*, pr.nome as produto_nome FROM producao p JOIN produtos pr ON p.produto_id = pr.id WHERE data_producao = ?',
            [data_producao]
        );
        return rows;
    }

    async delete(id) {
        const [result] = await pool.query('DELETE FROM producao WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }
}

module.exports = new ProducaoModel();

