const mysql = require('mysql2');
require('dotenv').config();

// Criando pool de conexões
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Promisify para usar async/await
const promisePool = pool.promise();

// Testar conexão
const testConnection = async () => {

    try {
        const [rows] = await promisePool.query('SELECT 1 + 1 AS solution');
        console.log('✅ Banco de dados conectado com sucesso!');
        return true;
    } catch (error) {
        console.error('❌ Erro ao conectar ao banco de dados:', error);
        throw error;
    }

};

module.exports = {
    pool: promisePool,
    testConnection
};

