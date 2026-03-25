const { pool } = require('./database');

class ProducaoModel {
    async findAll(days = 30) {
        const [rows] = await pool.query(`
            SELECT p.*, pr.nome as produto_nome 
            FROM producao p
            JOIN produtos pr ON p.produto_id = pr.id
            WHERE p.data_producao >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
            ORDER BY p.data_producao DESC, p.created_at DESC
        `, [days]);
        return rows;
    }
    
    async findByDate(date) {
        const [rows] = await pool.query(`
            SELECT p.*, pr.nome as produto_nome 
            FROM producao p
            JOIN produtos pr ON p.produto_id = pr.id
            WHERE p.data_producao = ?
            ORDER BY p.created_at DESC
        `, [date]);
        return rows;
    }
    
    async findByProduto(produtoId) {
        const [rows] = await pool.query(`
            SELECT * FROM producao 
            WHERE produto_id = ?
            ORDER BY data_producao DESC
        `, [produtoId]);
        return rows;
    }
    
    async create(producao) {
        const { produto_id, quantidade, funcionario, observacoes, data_producao } = producao;
        const data = data_producao || new Date().toISOString().split('T')[0];
        
        const [result] = await pool.query(
            'INSERT INTO producao (produto_id, quantidade, funcionario, observacoes, data_producao) VALUES (?, ?, ?, ?, ?)',
            [produto_id, quantidade, funcionario, observacoes || null, data]
        );
        return result.insertId;
    }
    
    async update(id, producao) {
        const { quantidade, funcionario, observacoes } = producao;
        const [result] = await pool.query(
            'UPDATE producao SET quantidade = ?, funcionario = ?, observacoes = ? WHERE id = ?',
            [quantidade, funcionario, observacoes || null, id]
        );
        return result.affectedRows > 0;
    }
    
    async delete(id) {
        const [result] = await pool.query('DELETE FROM producao WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }
    
    async getProducaoLast7Days() {
        const [rows] = await pool.query(`
            SELECT 
                DATE(data_producao) as dia,
                SUM(quantidade) as total
            FROM producao 
            WHERE data_producao >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
            GROUP BY DATE(data_producao)
            ORDER BY dia
        `);
        return rows;
    }
}

module.exports = new ProducaoModel();

