const { pool } = require('./database');

class ClienteModel {
    async create(cliente) {
        const { nome, telefone, email, cpf, endereco } = cliente;
        const [result] = await pool.query(
            'INSERT INTO clientes (nome, telefone, email, cpf, endereco) VALUES (?, ?, ?, ?, ?)',
            [nome, telefone, email, cpf, endereco]
        );
        return result.insertId;
    }

    async findAll() {
        const [rows] = await pool.query('SELECT * FROM clientes WHERE ativo = true ORDER BY nome');
        return rows;
    }

    async findById(id) {
        const [rows] = await pool.query('SELECT * FROM clientes WHERE id = ? AND ativo = true', [id]);
        return rows[0];
    }

    async update(id, cliente) {
        const fields = Object.keys(cliente).map(key => `${key} = ?`).join(', ');
        const values = Object.values(cliente).concat(id);
        const [result] = await pool.query(`UPDATE clientes SET ${fields} WHERE id = ?`, values);
        return result.affectedRows > 0;
    }

    async delete(id) {
        const [result] = await pool.query('UPDATE clientes SET ativo = false WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }

    async findByCpf(cpf) {
        const [rows] = await pool.query('SELECT * FROM clientes WHERE cpf = ? AND ativo = true', [cpf]);
        return rows[0];
    }
}

module.exports = new ClienteModel();
