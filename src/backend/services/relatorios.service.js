// Service para relatórios
const { pool } = require('../models/database');

class RelatoriosService {
    async relatorioVendasPeriodo(inicio, fim) {
        const [rows] = await pool.query(`
            SELECT DATE(v.data_venda) as dia, SUM(v.valor_total) as total_vendas, COUNT(*) as qtd_vendas
            FROM vendas v 
            WHERE v.data_venda BETWEEN ? AND ?
            GROUP BY DATE(v.data_venda)
            ORDER BY dia
        `, [inicio, fim]);
        return rows;
    }

    async relatorioProducaoPeriodo(inicio, fim) {
        const [rows] = await pool.query(`
            SELECT DATE(p.data_producao) as dia, SUM(p.quantidade) as total_produzido
            FROM producao p
            WHERE p.data_producao BETWEEN ? AND ?
            GROUP BY DATE(p.data_producao)
            ORDER BY dia
        `, [inicio, fim]);
        return rows;
    }
}

module.exports = new RelatoriosService();

