const { pool } = require('./database');

class PerdaModel {
    async create(perda) {
        const { produto_id, quantidade, motivo, observacao, data_perda } = perda;
        const [result] = await pool.query(
            'INSERT INTO perdas (produto_id, quantidade, motivo, observacao, data_perda) VALUES (?, ?, ?, ?, ?)',
            [produto_id, quantidade, motivo, observacao, data_perda]
        );
        return result.insertId;
    }

    async findAll() {
        const [rows] = await pool.query(
            'SELECT p.*, pr.nome as produto_nome FROM perdas p JOIN produtos pr ON p.produto_id = pr.id ORDER BY data_perda DESC'
        );
        return rows;
    }

    async findByDate(data_perda) {
        const [rows] = await pool.query(
            'SELECT p.*, pr.nome as produto_nome FROM perdas p JOIN produtos pr ON p.produto_id = pr.id WHERE data_perda = ?',
            [data_perda]
        );
        return rows;
    }

    async delete(id) {
        const [result] = await pool.query('DELETE FROM perdas WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }
}

module.exports = new PerdaModel();

