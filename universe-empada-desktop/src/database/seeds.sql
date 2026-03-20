-- Dados iniciais para teste

USE empadas_db;

-- Produtos de exemplo
INSERT INTO produtos (nome, descricao, custo, preco, categoria, peso_unidade) VALUES
('Empada de Carne', 'Empada crocante recheada com carne cozida e temperos especiais', 2.50, 5.00, 'carne', 50.00),
('Empada de Frango', 'Frango desfiado com catupiry e milho verde', 2.30, 4.80, 'frango', 50.00),
('Empada de Queijo', 'Queijo minas e catupiry cremoso', 2.80, 5.50, 'queijo', 50.00),
('Empada de Palmito', 'Palmito do amazônia com creme de leite', 3.20, 6.00, 'palmito', 50.00),
('Empada de Presunto e Queijo', 'Clássica combinação brasileira', 2.40, 4.90, 'outros', 50.00);

-- Produção de exemplo
INSERT INTO producao (produto_id, quantidade, data_producao, turno) VALUES
(1, 200, CURDATE(), 'manhã'),
(2, 150, CURDATE(), 'tarde'),
(3, 100, CURDATE(), 'noite');

-- Vendas de exemplo
INSERT INTO vendas (produto_id, quantidade, valor_total, cliente_nome, forma_pagamento) VALUES
(1, 10, 50.00, 'Maria Silva', 'pix'),
(2, 8, 38.40, 'João Santos', 'dinheiro'),
(1, 15, 75.00, 'Padaria Central', 'cartao');
