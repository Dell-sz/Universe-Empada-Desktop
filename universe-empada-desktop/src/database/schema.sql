-- Universe Empadas - Schema do Banco de Dados
-- MySQL 8.0

CREATE DATABASE IF NOT EXISTS empadas_db;
USE empadas_db;

-- Tabela de Produtos
CREATE TABLE produtos (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nome VARCHAR(100) NOT NULL,
  descricao TEXT,
  custo DECIMAL(10,2) NOT NULL,
  preco DECIMAL(10,2) NOT NULL,
  categoria ENUM('carne', 'frango', 'queijo', 'palmito', 'outros') DEFAULT 'outros',
  peso_unidade DECIMAL(6,2) DEFAULT 50.00,
  ativo BOOLEAN DEFAULT TRUE,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabela de Produção
CREATE TABLE producao (
  id INT PRIMARY KEY AUTO_INCREMENT,
  produto_id INT NOT NULL,
  quantidade INT NOT NULL,
  data_producao DATE NOT NULL,
  turno ENUM('manhã', 'tarde', 'noite') DEFAULT 'manhã',
  observacoes TEXT,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (produto_id) REFERENCES produtos(id) ON DELETE CASCADE
);

-- Tabela de Vendas
CREATE TABLE vendas (
  id INT PRIMARY KEY AUTO_INCREMENT,
  produto_id INT NOT NULL,
  quantidade INT NOT NULL,
  valor_total DECIMAL(10,2) NOT NULL,
  data_venda DATETIME DEFAULT CURRENT_TIMESTAMP,
  cliente_nome VARCHAR(100),
  forma_pagamento ENUM('dinheiro', 'pix', 'cartao', 'credito') DEFAULT 'dinheiro',
  observacoes TEXT,
  FOREIGN KEY (produto_id) REFERENCES produtos(id) ON DELETE RESTRICT
);

-- Tabela de Estoque (movimentações)
CREATE TABLE estoque (
  id INT PRIMARY KEY AUTO_INCREMENT,
  produto_id INT NOT NULL,
  tipo_movimento ENUM('ENTRADA', 'SAIDA') NOT NULL,
  quantidade INT NOT NULL,
  motivo VARCHAR(100),
  data_movimento DATETIME DEFAULT CURRENT_TIMESTAMP,
  responsavel VARCHAR(50),
  FOREIGN KEY (produto_id) REFERENCES produtos(id) ON DELETE CASCADE
);

-- Tabela de Perdas
CREATE TABLE perdas (
  id INT PRIMARY KEY AUTO_INCREMENT,
  produto_id INT NOT NULL,
  quantidade INT NOT NULL,
  motivo TEXT,
  data_perda DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (produto_id) REFERENCES produtos(id) ON DELETE CASCADE
);

-- Índices para performance
CREATE INDEX idx_producao_data ON producao(data_producao);
CREATE INDEX idx_vendas_data ON vendas(data_venda);
CREATE INDEX idx_estoque_data ON estoque(data_movimento);
CREATE INDEX idx_produto_estoque ON estoque(produto_id, data_movimento);
