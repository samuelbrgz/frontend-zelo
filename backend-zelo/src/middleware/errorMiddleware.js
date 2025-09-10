const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Erro de validação do Prisma
  if (err.code === 'P2002') {
    return res.status(400).json({
      success: false,
      message: 'Dados duplicados. Este registro já existe.'
    });
  }

  // Erro de registro não encontrado do Prisma
  if (err.code === 'P2025') {
    return res.status(404).json({
      success: false,
      message: 'Registro não encontrado.'
    });
  }

  // Erro de validação do express-validator
  if (err.type === 'validation') {
    return res.status(400).json({
      success: false,
      message: 'Dados de entrada inválidos',
      errors: err.errors
    });
  }

  // Erro de sintaxe JSON
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      success: false,
      message: 'JSON inválido'
    });
  }

  // Erro padrão
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Erro interno do servidor';

  res.status(statusCode).json({
    success: false,
    message: process.env.NODE_ENV === 'production' ? 'Erro interno do servidor' : message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

const notFound = (req, res) => {
  res.status(404).json({
    success: false,
    message: `Rota não encontrada: ${req.method} ${req.path}`
  });
};

module.exports = {
  errorHandler,
  notFound
};
