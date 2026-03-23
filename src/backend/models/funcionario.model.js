const { pool } = require('./database');

class FuncionarioModel {
    async create(funcionario) {
        const { nome, telefone, email, cargo, salario } = funcionario;
        const [result] = await pool.query(
            'INSERT INTO funcionarios (nome, telefone, email, cargo, salario) VALUES (?, ?, ?, ?, ?)',
            [nome, telefone, email, cargo, salario]
        );
        return result.insertId;
    }

    async findAll() {
        const [rows] = await pool.query('SELECT * FROM funcionarios WHERE ativo = true ORDER BY nome');
        return rows;
    }

    async findById(id) {
        const [rows] = await pool.query('SELECT * FROM funcionarios WHERE id = ? AND ativo = true', [id]);
        return rows[0];
    }

    async update(id, funcionario) {
        const fields = Object.keys(funcionario).map(key => `${key} = ?`).join(', ');
        const values = Object.values(funcionario).concat(id);
        const [result] = await pool.query(`UPDATE funcionarios SET ${fields} WHERE id = ?`, values);
        return result.affectedRows > 0;
    }

    async delete(id) {
        const [result] = await pool.query('UPDATE funcionarios SET ativo = false WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }
}

module.exports = new FuncionarioModel();
