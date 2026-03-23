const { pool } = require('./database');

class ProdutoModel {
    // Criar produto
    async create(produto) {
        const { nome, categoria, preco_venda, estoque_minimo } = produto;
        const [result] = await pool.query(
            'INSERT INTO produtos (nome, categoria, preco_venda, estoque_minimo) VALUES (?, ?, ?, ?)',
            [nome, categoria, preco_venda, estoque_minimo]
        );
        return result.insertId;
    }

    // Listar todos os produtos ativos
    async findAll() {
        const [rows] = await pool.query(
            'SELECT * FROM produtos WHERE ativo = true ORDER BY nome'
        );
        return rows;
    }

    // Buscar produto por ID
    async findById(id) {
        const [rows] = await pool.query(
            'SELECT * FROM produtos WHERE id = ? AND ativo = true',
            [id]
        );
        return rows[0];
    }

    // Atualizar produto
    async update(id, produto) {
        const { nome, categoria, preco_venda, estoque_minimo } = produto;
        const [result] = await pool.query(
            'UPDATE produtos SET nome = ?, categoria = ?, preco_venda = ?, estoque_minimo = ? WHERE id = ?',
            [nome, categoria, preco_venda, estoque_minimo, id]
        );
        return result.affectedRows > 0;
    }

    // Excluir produto (desativação lógica)
    async delete(id) {
        const [result] = await pool.query(
            'UPDATE produtos SET ativo = false WHERE id = ?',
            [id]
        );
        return result.affectedRows > 0;
    }

    // Buscar produtos com estoque baixo
    async findLowStock() {
        const [rows] = await pool.query(`
            SELECT p.*, 
                   COALESCE(prod.quantidade_produzida, 0) - COALESCE(vend.quantidade_vendida, 0) - COALESCE(perd.quantidade_perdida, 0) as estoque_atual
            FROM produtos p
            LEFT JOIN (
                SELECT produto_id, SUM(quantidade) as quantidade_produzida
                FROM producao
                GROUP BY produto_id
            ) prod ON p.id = prod.produto_id
            LEFT JOIN (
                SELECT iv.produto_id, SUM(iv.quantidade) as quantidade_vendida
                FROM itens_venda iv
                GROUP BY iv.produto_id
            ) vend ON p.id = vend.produto_id
            LEFT JOIN (
                SELECT produto_id, SUM(quantidade) as quantidade_perdida
                FROM perdas
                GROUP BY produto_id
            ) perd ON p.id = perd.produto_id
            WHERE p.ativo = true
            HAVING estoque_atual < p.estoque_minimo
        `);
        return rows;
    }
}

module.exports = new ProdutoModel();

