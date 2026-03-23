-- Migração: Adicionar tabelas clientes e funcionarios
USE universe_empada;

-- Tabela clientes
CREATE TABLE IF NOT EXISTS clientes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(150) NOT NULL,
    telefone VARCHAR(
