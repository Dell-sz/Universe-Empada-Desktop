-- src/database/migrate_complete.sql
-- ============================================
-- MIGRAÇÃO COMPLETA - UNIVERSE DA EMPADA
-- Com RBAC, White/Black List, e todas tabelas
-- ============================================

USE universe_empada;

-- ============================================
-- 1. TABELAS PRINCIPAIS
-- ============================================

-- Produtos
CREATE TABLE IF NOT EXISTS produtos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    categoria ENUM('frito', 'assado', 'empada') NOT NULL,
    preco_venda DECIMAL(10,2) NOT NULL,
    estoque_minimo INT NOT NULL DEFAULT 5,
    ativo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_categoria (categoria),
    INDEX idx_ativo (ativo)
);

-- Produção
CREATE TABLE IF NOT EXISTS producao (
    id INT PRIMARY KEY AUTO_INCREMENT,
    produto_id INT NOT NULL,
    quantidade INT NOT NULL,
    funcionario VARCHAR(100) NOT NULL,
    turno ENUM('manha', 'tarde', 'noite') DEFAULT 'manha',
    observacoes TEXT,
    data_producao DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (produto_id) REFERENCES produtos(id),
    INDEX idx_data (data_producao),
    INDEX idx_produto (produto_id)
);

-- Vendas
CREATE TABLE IF NOT EXISTS vendas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    cliente_id INT NULL,
    data_venda DATETIME NOT NULL,
    valor_total DECIMAL(10,2) NOT NULL,
    forma_pagamento ENUM('dinheiro', 'cartao_credito', 'cartao_debito', 'pix') NOT NULL,
    status ENUM('pendente', 'confirmada', 'cancelada') DEFAULT 'confirmada',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_data (data_venda),
    INDEX idx_cliente (cliente_id)
);

-- Itens Venda
CREATE TABLE IF NOT EXISTS itens_venda (
    id INT PRIMARY KEY AUTO_INCREMENT,
    venda_id INT NOT NULL,
    produto_id INT NOT NULL,
    quantidade INT NOT NULL,
    preco_unitario DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (venda_id) REFERENCES vendas(id) ON DELETE CASCADE,
    FOREIGN KEY (produto_id) REFERENCES produtos(id)
);

-- Perdas
CREATE TABLE IF NOT EXISTS perdas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    produto_id INT NOT NULL,
    quantidade INT NOT NULL,
    motivo ENUM('validade', 'avaria', 'outros') NOT NULL,
    observacao TEXT,
    data_perda DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (produto_id) REFERENCES produtos(id),
    INDEX idx_data (data_perda)
);

-- ============================================
-- 2. TABELAS DE USUÁRIOS E AUTENTICAÇÃO
-- ============================================

-- Usuários
CREATE TABLE IF NOT EXISTS usuarios (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    ativo BOOLEAN DEFAULT TRUE,
    ultimo_acesso DATETIME,
    foto_perfil VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_ativo (ativo)
);

-- Roles
CREATE TABLE IF NOT EXISTS roles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(50) NOT NULL UNIQUE,
    descricao TEXT,
    nivel INT DEFAULT 0,
    ativo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_nome (nome)
);

-- Permissões
CREATE TABLE IF NOT EXISTS permissoes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL UNIQUE,
    recurso VARCHAR(50) NOT NULL,
    acao VARCHAR(50) NOT NULL,
    descricao TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_recurso_acao (recurso, acao)
);

-- Roles x Permissões
CREATE TABLE IF NOT EXISTS roles_permissoes (
    role_id INT NOT NULL,
    permissao_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (role_id, permissao_id),
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
    FOREIGN KEY (permissao_id) REFERENCES permissoes(id) ON DELETE CASCADE
);

-- Usuários x Roles
CREATE TABLE IF NOT EXISTS usuarios_roles (
    usuario_id INT NOT NULL,
    role_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (usuario_id, role_id),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
);

-- Sessões Ativas (White List)
CREATE TABLE IF NOT EXISTS sessoes_ativas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    token VARCHAR(500) NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    data_login DATETIME NOT NULL,
    data_expiracao DATETIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    INDEX idx_token (token(255)),
    INDEX idx_usuario (usuario_id)
);

-- Tokens Revogados (Black List)
CREATE TABLE IF NOT EXISTS tokens_revogados (
    id INT PRIMARY KEY AUTO_INCREMENT,
    token VARCHAR(500) NOT NULL,
    usuario_id INT NOT NULL,
    motivo VARCHAR(100),
    data_revogacao DATETIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_token (token(255))
);

-- Logs de Acesso
CREATE TABLE IF NOT EXISTS logs_acesso (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NULL,
    email VARCHAR(100),
    ip_address VARCHAR(45),
    user_agent TEXT,
    status ENUM('sucesso', 'falha', 'bloqueado') NOT NULL,
    motivo VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_usuario (usuario_id),
    INDEX idx_data (created_at)
);

-- ============================================
-- 3. TABELAS DE CLIENTES E FIDELIDADE
-- ============================================

-- Clientes
CREATE TABLE IF NOT EXISTS clientes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    telefone VARCHAR(20),
    celular VARCHAR(20),
    cpf_cnpj VARCHAR(20) UNIQUE,
    data_nascimento DATE,
    endereco_cep VARCHAR(10),
    endereco_logradouro VARCHAR(150),
    endereco_numero VARCHAR(10),
    endereco_complemento VARCHAR(50),
    endereco_bairro VARCHAR(50),
    endereco_cidade VARCHAR(50),
    endereco_estado CHAR(2),
    observacoes TEXT,
    pontos_fidelidade INT DEFAULT 0,
    nivel ENUM('bronze', 'prata', 'ouro', 'diamante') DEFAULT 'bronze',
    ativo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_nome (nome),
    INDEX idx_cpf (cpf_cnpj),
    INDEX idx_nivel (nivel)
);

-- Pontos Fidelidade
CREATE TABLE IF NOT EXISTS pontos_fidelidade (
    id INT PRIMARY KEY AUTO_INCREMENT,
    cliente_id INT NOT NULL,
    venda_id INT NULL,
    pontos INT NOT NULL,
    tipo ENUM('ganho', 'resgate', 'bonus', 'expiracao') NOT NULL,
    descricao VARCHAR(255),
    data_movimentacao DATETIME NOT NULL,
    data_expiracao DATE,
    FOREIGN KEY (cliente_id) REFERENCES clientes(id),
    FOREIGN KEY (venda_id) REFERENCES vendas(id),
    INDEX idx_cliente (cliente_id)
);

-- ============================================
-- 4. ADICIONAR FK NA VENDAS
-- ============================================

ALTER TABLE vendas ADD FOREIGN KEY (cliente_id) REFERENCES clientes(id);

-- ============================================
-- 5. INSERIR DADOS INICIAIS
-- ============================================

-- Roles
INSERT INTO roles (nome, descricao, nivel) VALUES
('admin', 'Administrador do sistema - acesso total', 100),
('gestor', 'Gestor - acesso a relatórios e gestão', 80),
('producao', 'Produção - registrar produção e ver estoque', 50),
('vendas', 'Vendas - registrar vendas e ver produtos', 40),
('visualizador', 'Apenas visualização - não pode alterar dados', 10);

-- Permissões
INSERT INTO permissoes (nome, recurso, acao, descricao) VALUES
-- Dashboard
('dashboard_ver', 'dashboard', 'read', 'Visualizar dashboard'),

-- Produtos
('produtos_ver', 'produtos', 'read', 'Visualizar produtos'),
('produtos_criar', 'produtos', 'create', 'Criar novos produtos'),
('produtos_editar', 'produtos', 'update', 'Editar produtos'),
('produtos_excluir', 'produtos', 'delete', 'Excluir produtos'),

-- Produção
('producao_ver', 'producao', 'read', 'Visualizar produção'),
('producao_registrar', 'producao', 'create', 'Registrar produção'),
('producao_editar', 'producao', 'update', 'Editar produção'),
('producao_excluir', 'producao', 'delete', 'Excluir produção'),

-- Vendas
('vendas_ver', 'vendas', 'read', 'Visualizar vendas'),
('vendas_registrar', 'vendas', 'create', 'Registrar vendas'),
('vendas_cancelar', 'vendas', 'delete', 'Cancelar vendas'),

-- Estoque
('estoque_ver', 'estoque', 'read', 'Visualizar estoque'),
('estoque_ajustar', 'estoque', 'update', 'Ajustar estoque'),
('estoque_perdas', 'estoque', 'create', 'Registrar perdas'),

-- Relatórios
('relatorios_ver', 'relatorios', 'read', 'Visualizar relatórios'),
('relatorios_exportar', 'relatorios', 'export', 'Exportar relatórios'),

-- Usuários
('usuarios_ver', 'usuarios', 'read', 'Visualizar usuários'),
('usuarios_criar', 'usuarios', 'create', 'Criar usuários'),
('usuarios_editar', 'usuarios', 'update', 'Editar usuários'),
('usuarios_excluir', 'usuarios', 'delete', 'Excluir usuários'),

-- Clientes
('clientes_ver', 'clientes', 'read', 'Visualizar clientes'),
('clientes_criar', 'clientes', 'create', 'Criar clientes'),
('clientes_editar', 'clientes', 'update', 'Editar clientes'),
('clientes_excluir', 'clientes', 'delete', 'Excluir clientes'),

-- Configurações
('config_ver', 'config', 'read', 'Visualizar configurações'),
('config_editar', 'config', 'update', 'Editar configurações');

-- Admin - todas as permissões
INSERT INTO roles_permissoes (role_id, permissao_id)
SELECT r.id, p.id FROM roles r, permissoes p WHERE r.nome = 'admin';

-- Gestor - exceto usuários e config
INSERT INTO roles_permissoes (role_id, permissao_id)
SELECT r.id, p.id FROM roles r, permissoes p 
WHERE r.nome = 'gestor' AND p.recurso NOT IN ('usuarios', 'config');

-- Produção
INSERT INTO roles_permissoes (role_id, permissao_id)
SELECT r.id, p.id FROM roles r, permissoes p 
WHERE r.nome = 'producao' AND p.recurso IN ('produtos', 'producao', 'estoque') 
  AND p.acao IN ('read', 'create');

-- Vendas
INSERT INTO roles_permissoes (role_id, permissao_id)
SELECT r.id, p.id FROM roles r, permissoes p 
WHERE r.nome = 'vendas' AND p.recurso IN ('produtos', 'vendas', 'clientes') 
  AND p.acao IN ('read', 'create');

-- Visualizador
INSERT INTO roles_permissoes (role_id, permissao_id)
SELECT r.id, p.id FROM roles r, permissoes p 
WHERE r.nome = 'visualizador' AND p.acao = 'read';

-- Usuário Admin
INSERT INTO usuarios (nome, email, senha) VALUES 
('Administrador', 'admin@universeempada.com.br', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi') 
ON DUPLICATE KEY UPDATE nome = VALUES(nome);

-- Atribuir role admin ao usuário admin
INSERT INTO usuarios_roles (usuario_id, role_id)
SELECT u.id, r.id FROM usuarios u, roles r 
WHERE u.email = 'admin@universeempada.com.br' AND r.nome = 'admin';

-- ============================================
-- 6. INSERIR DADOS DE EXEMPLO
-- ============================================

-- Produtos
INSERT INTO produtos (nome, categoria, preco_venda, estoque_minimo) VALUES
('Coxinha de Frango', 'frito', 5.00, 10),
('Empada de Frango', 'empada', 6.00, 8),
('Rissole de Carne', 'frito', 5.50, 10),
('Esfiha de Carne', 'assado', 4.50, 12),
('Kibe', 'frito', 5.00, 8),
('Pastel de Queijo', 'frito', 4.00, 15),
('Pão de Queijo', 'assado', 2.50, 20),
('Empada de Palmito', 'empada', 6.50, 8),
('Croquete', 'frito', 4.50, 10),
('Enroladinho de Salsicha', 'frito', 4.00, 12);

-- Clientes
INSERT INTO clientes (nome, email, telefone, celular, cpf_cnpj, nivel) VALUES
('Ana Paula Souza', 'ana@email.com', '3133333333', '31988888888', '12345678901', 'ouro'),
('Roberto Almeida', 'roberto@email.com', '3134444444', '31977777777', '98765432100', 'prata'),
('Fernanda Lima', 'fernanda@email.com', '3135555555', '31966666666', '11122233344', 'bronze');

-- Produção exemplo
INSERT INTO producao (produto_id, quantidade, funcionario, data_producao) VALUES
(1, 50, 'Maria Silva', CURDATE()),
(2, 40, 'João Santos', CURDATE()),
(3, 45, 'Maria Silva', CURDATE()),
(1, 45, 'João Santos', DATE_SUB(CURDATE(), INTERVAL 1 DAY)),
(2, 38, 'Maria Silva', DATE_SUB(CURDATE(), INTERVAL 1 DAY));

-- Vendas exemplo
INSERT INTO vendas (cliente_id, data_venda, valor_total, forma_pagamento) VALUES
(1, NOW(), 250.00, 'pix'),
(2, NOW(), 180.50, 'dinheiro'),
(1, DATE_SUB(NOW(), INTERVAL 1 DAY), 320.00, 'cartao_credito');

-- Itens venda
INSERT INTO itens_venda (venda_id, produto_id, quantidade, preco_unitario, subtotal) VALUES
(1, 1, 20, 5.00, 100.00),
(1, 2, 25, 6.00, 150.00),
(2, 3, 15, 5.50, 82.50),
(2, 4, 10, 4.50, 45.00),
(3, 1, 30, 5.00, 150.00),
(3, 2, 28, 6.00, 168.00);

-- Perdas exemplo
INSERT INTO perdas (produto_id, quantidade, motivo, data_perda) VALUES
(1, 5, 'validade', CURDATE()),
(2, 3, 'avaria', CURDATE()),
(3, 2, 'validade', DATE_SUB(CURDATE(), INTERVAL 2 DAY));

SELECT '✅ Migração completa finalizada!' as Status;

