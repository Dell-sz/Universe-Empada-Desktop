const validateId = (req, res, next) => {
  const id = req.params.id;
  if (!/^\d+$/.test(id)) {
    return res.status(400).json({ error: 'ID deve ser um número válido' });
  }
  next();
};

const validateProduto = (req, res, next) => {
  const { nome, categoria, preco_venda, estoque_minimo } = req.body;
  if (!nome || !categoria || typeof preco_venda !== 'number') {
    return res.status(400).json({
      error: 'Nome, categoria e preco_venda são obrigatórios'
    });
  }
  if (preco_venda <= 0) {
    return res.status(400).json({
      error: 'Preço de venda deve ser maior que zero'
    });
  }
  next();
};


module.exports = { validateId, validateProduto };
