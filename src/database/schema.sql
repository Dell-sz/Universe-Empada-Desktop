-- Criar banco de dados
CREATE DATABASE IF NOT EXISTS universe_empada;
USE universe_empada;

-- Tabela de produtos
CREATE TABLE IF NOT EXISTS produtos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    categoria ENUM('frito', 'assado', 'empada') NOT NULL,
    preco_venda DECIMAL(10,2) NOT NULL,
    estoque_minimo INT NOT NULL DEFAULT 5,
    ativo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabela de produção
CREATE TABLE IF NOT EXISTS producao (
    id INT PRIMARY KEY AUTO_INCREMENT,
    produto_id INT NOT NULL,
    quantidade INT NOT NULL,
    funcionario VARCHAR(100) NOT NULL,
    observacoes TEXT,
    data_producao DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (produto_id) REFERENCES produtos(id)
);

-- Tabela de vendas
CREATE TABLE IF NOT EXISTS vendas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    data_venda DATETIME NOT NULL,
    valor_total DECIMAL(10,2) NOT NULL,
    forma_pagamento ENUM('dinheiro', 'cartao_credito', 'cartao_debito', 'pix') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de itens de venda
CREATE TABLE IF NOT EXISTS itens_venda (
    id INT PRIMARY KEY AUTO_INCREMENT,
    venda_id INT NOT NULL,
    produto_id INT NOT NULL,
    quantidade INT NOT NULL,
    preco_unitario DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (venda_id) REFERENCES vendas(id),
    FOREIGN KEY (produto_id) REFERENCES produtos(id)
);

-- Tabela de perdas
CREATE TABLE IF NOT EXISTS perdas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    produto_id INT NOT NULL,
    quantidade INT NOT NULL,
    motivo ENUM('validade', 'avaria', 'outros') NOT NULL,
    observacao TEXT,
    data_perda DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (produto_id) REFERENCES produtos(id)
);

-- Índices para melhor performance
CREATE INDEX idx_produto_categoria ON produtos(categoria);
CREATE INDEX idx_producao_data ON producao(data_producao);
CREATE INDEX idx_vendas_data ON vendas(data_venda);
CREATE INDEX idx_perdas_data ON perdas(data_perda);

