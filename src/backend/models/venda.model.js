const { pool } = require('./database');

class VendaModel {
    async create(vendaData) {
        const { data_venda, valor_total, forma_pagamento, itens } = vendaData;
        const conn = await pool.getConnection();
        try {
            await conn.beginTransaction();
            
            const [vendaResult] = await conn.query(
                'INSERT INTO vendas (data_venda, valor_total, forma_pagamento) VALUES (?, ?, ?)',
                [data_venda, valor_total, forma_pagamento]
            );
            const venda_id = vendaResult.insertId;

            for (const item of itens) {
                await conn.query(
                    'INSERT INTO itens_venda (venda_id, produto_id, quantidade, preco_unitario, subtotal) VALUES (?, ?, ?, ?, ?)',
                    [venda_id, item.produto_id, item.quantidade, item.preco_unitario, item.subtotal]
                );
            }

            await conn.commit();
            return venda_id;
        } catch (error) {
            await conn.rollback();
            throw error;
        } finally {
            conn.release();
        }
    }

    async findAll() {
        const [rows] = await pool.query(`
            SELECT v.*, GROUP_CONCAT(CONCAT(pr.nome, ' (', iv.quantidade, ')') SEPARATOR ', ') as itens
            FROM vendas v 
            JOIN itens_venda iv ON v.id = iv.venda_id 
            JOIN produtos pr ON iv.produto_id = pr.id 
            GROUP BY v.id 
            ORDER BY v.data_venda DESC
        `);
        return rows;
    }

    async findById(id) {
        const [vendaRows] = await pool.query('SELECT * FROM vendas WHERE id = ?', [id]);
        if (vendaRows.length === 0) return null;
        
        const [itensRows] = await pool.query(
            'SELECT iv.*, pr.nome FROM itens_venda iv JOIN produtos pr ON iv.produto_id = pr.id WHERE venda_id = ?',
            [id]
        );
        
        return { ...vendaRows[0], itens: itensRows };
    }
}

module.exports = new VendaModel();

