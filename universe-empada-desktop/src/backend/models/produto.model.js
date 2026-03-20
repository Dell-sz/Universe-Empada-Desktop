const db = require('./database');

class ProdutoModel {
  async findAll() {
    const [rows] = await db.execute(`
      SELECT p.*, 
             COALESCE(SUM(e.quantidade * CASE WHEN e.tipo_movimento = 'ENTRADA' THEN 1 ELSE -1 END), 0) as estoque_atual
      FROM produtos p
      LEFT JOIN estoque e ON p.id = e.produto_id
      WHERE p.ativo = TRUE
      GROUP BY p.id
      ORDER BY p.nome
    `);
    return rows;
  }

  async findById(id) {
    const [rows] = await db.execute(
      'SELECT * FROM produtos WHERE id = ? AND ativo = TRUE',
      [id]
    );
    return rows[0];
  }

  async create(produto) {
    const [result] = await db.execute(
      'INSERT INTO produtos (nome, descricao, custo, preco, categoria, peso_unidade) VALUES (?, ?, ?, ?, ?, ?)',
      [produto.nome, produto.descricao, produto.custo, produto.preco, produto.categoria, produto.peso_unidade]
    );
    return result.insertId;
  }

  async update(id, produto) {
    await db.execute(
      'UPDATE produtos SET nome=?, descricao=?, custo=?, preco=?, categoria=?, peso_unidade=?, atualizado_em=NOW() WHERE id=?',
      [produto.nome, produto.descricao, produto.custo, produto.preco, produto.categoria, produto.peso_unidade, id]
    );
  }

  async delete(id) {
    await db.execute('UPDATE produtos SET ativo = FALSE, atualizado_em=NOW() WHERE id = ?', [id]);
  }
}

module.exports = new ProdutoModel();
