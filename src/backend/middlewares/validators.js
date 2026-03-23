const validateId = (req, res, next) => {
  const id = req.params.id;
  if (!/^\d+$/.test(id)) {
    return res.status(400).json({ error: 'ID deve ser um número válido' });
  }
  next();
};

const validateProduto = (req, res, next) => {
  const { nome, preco, custo } = req.body;
  if (!nome || typeof preco !== 'number' || typeof custo !== 'number') {
    return res.status(400).json({
      error: 'Nome, preço e custo são obrigatórios'
    });
  }
  if (preco <= 0 || custo <= 0) {
    return res.status(400).json({
      error: 'Preço e custo devem ser maiores que zero'
    });
  }
  next();
};

module.exports = { validateId, validateProduto };
