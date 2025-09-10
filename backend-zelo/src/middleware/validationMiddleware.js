const { body, param, query, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Dados de entrada inválidos',
      errors: errors.array()
    });
  }
  next();
};

// Validações para autenticação
const validateRegister = [
  body('nome')
    .notEmpty()
    .withMessage('Nome é obrigatório')
    .isLength({ min: 2, max: 100 })
    .withMessage('Nome deve ter entre 2 e 100 caracteres'),
  body('email')
    .isEmail()
    .withMessage('Email deve ser válido')
    .normalizeEmail(),
  body('senha')
    .isLength({ min: 6 })
    .withMessage('Senha deve ter pelo menos 6 caracteres'),
  handleValidationErrors
];

const validateLogin = [
  body('email')
    .isEmail()
    .withMessage('Email deve ser válido')
    .normalizeEmail(),
  body('senha')
    .notEmpty()
    .withMessage('Senha é obrigatória'),
  handleValidationErrors
];

// Validações para transações
const validateTransaction = [
  body('walletId')
    .notEmpty()
    .withMessage('WalletId é obrigatório'),
  body('tipo')
    .isIn(['DEPOSITO', 'SAQUE', 'TRANSFERENCIA', 'PAGAMENTO_COMPARTILHADO'])
    .withMessage('Tipo de transação inválido'),
  body('valor')
    .isFloat({ min: 0.01 })
    .withMessage('Valor deve ser maior que zero'),
  body('descricao')
    .optional()
    .isLength({ max: 255 })
    .withMessage('Descrição deve ter no máximo 255 caracteres'),
  handleValidationErrors
];

// Validações para contratos compartilhados
const validateSharedContract = [
  body('valorTotal')
    .isFloat({ min: 0.01 })
    .withMessage('Valor total deve ser maior que zero'),
  body('participantes')
    .isArray({ min: 1 })
    .withMessage('Deve ter pelo menos um participante'),
  body('participantes.*.userId')
    .notEmpty()
    .withMessage('UserId do participante é obrigatório'),
  body('participantes.*.valorParticipacao')
    .isFloat({ min: 0.01 })
    .withMessage('Valor da participação deve ser maior que zero'),
  body('descricao')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Descrição deve ter no máximo 500 caracteres'),
  handleValidationErrors
];

// Validações para parâmetros
const validateObjectId = [
  param('id')
    .notEmpty()
    .withMessage('ID é obrigatório'),
  handleValidationErrors
];

const validateWalletId = [
  param('walletId')
    .notEmpty()
    .withMessage('WalletId é obrigatório'),
  handleValidationErrors
];

const validateTransactionId = [
  param('transactionId')
    .notEmpty()
    .withMessage('TransactionId é obrigatório'),
  handleValidationErrors
];

const validateContractId = [
  param('contractId')
    .notEmpty()
    .withMessage('ContractId é obrigatório'),
  handleValidationErrors
];

// Validações para query parameters
const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Página deve ser um número inteiro maior que zero'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit deve ser um número inteiro entre 1 e 100'),
  handleValidationErrors
];

module.exports = {
  validateRegister,
  validateLogin,
  validateTransaction,
  validateSharedContract,
  validateObjectId,
  validateWalletId,
  validateTransactionId,
  validateContractId,
  validatePagination,
  handleValidationErrors
};
