const errorHandler = (err, req, res, next) => {
  console.error('❌ ERRO:', err.stack);

  if (err.code === 'ECONNREFUSED') {
    return res.status(503).json({
      error: 'Banco de dados indisponível',
      message: 'Verifique se o MySQL está rodando'
    });
  }

  res.status(err.statusCode || 500).json({
    error: err.message || 'Erro interno do servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

const notFound = (req, res) => {
  res.status(404).json({
    error: 'Endpoint não encontrado',
    path: req.originalUrl
  });
};

module.exports = { errorHandler, notFound };
