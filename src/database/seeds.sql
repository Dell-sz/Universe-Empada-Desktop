USE universe_empada;

-- Sample produtos
INSERT INTO produtos (nome, categoria, preco_venda, estoque_minimo) VALUES
('Empada de Carne Frita', 'frito', 5.00, 10),
('Empada de Frango Assada', 'assado', 6.00, 15),
('Empada de Queijo', 'empada', 4.50, 5),
('Empada de Palmito Frita', 'frito', 7.00, 8),
('Empada de Presunto', 'assado', 5.50, 12);

-- Sample producao
INSERT INTO producao (produto_id, quantidade, funcionario, data_producao) VALUES
(1, 200, 'João Silva', CURDATE()),
(2, 150, 'Maria Santos', CURDATE()),
(3, 100, 'Pedro Oliveira', CURDATE());

-- Sample vendas
INSERT INTO vendas (data_venda, valor_total, forma_pagamento) VALUES
(NOW(), 50.00, 'pix'),
(NOW(), 75.00, 'dinheiro');

-- Sample itens_venda
INSERT INTO itens_venda (venda_id, produto_id, quantidade, preco_unitario, subtotal) VALUES
(1, 1, 10, 5.00, 50.00),
(2, 2, 12, 6.00, 72.00),
(2, 3, 1, 4.50, 4.50);

-- Sample perdas
INSERT INTO perdas (produto_id, quantidade, motivo, data_perda) VALUES
(1, 5, 'validade', CURDATE()),
(3, 2, 'avaria', CURDATE());

-- Sample clientes
INSERT INTO clientes (nome, telefone, email, cpf) VALUES
('Ana Paula', '11999999999', 'ana@email.com', '123.456.789-00'),
('Roberto Lima', '21988888888', 'roberto@email.com', '987.654.321-00');

-- Sample funcionarios
INSERT INTO funcionarios (nome, telefone, cargo, salario) VALUES
('João Silva', '31977777777', 'Produção', 2500.00),
('Maria Santos',

