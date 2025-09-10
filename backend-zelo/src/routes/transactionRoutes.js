const express = require('express');
const transactionController = require('../controllers/transactionController');
const { authenticateToken } = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * @swagger
 * /api/transactions:
 *   post:
 *     summary: Criar nova transação
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - walletId
 *               - tipo
 *               - valor
 *             properties:
 *               walletId:
 *                 type: string
 *                 example: "clx1234567890"
 *               tipo:
 *                 type: string
 *                 enum: [DEPOSITO, SAQUE, TRANSFERENCIA, PAGAMENTO_COMPARTILHADO]
 *                 example: "DEPOSITO"
 *               valor:
 *                 type: number
 *                 example: 100.50
 *               descricao:
 *                 type: string
 *                 example: "Depósito via PIX"
 *               metadata:
 *                 type: object
 *                 example: {"pixKey": "12345678901"}
 *     responses:
 *       201:
 *         description: Transação criada com sucesso
 *       400:
 *         description: Dados inválidos
 */
router.post('/', authenticateToken, transactionController.createTransaction);

/**
 * @swagger
 * /api/transactions/{transactionId}:
 *   get:
 *     summary: Obter transação por ID
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: transactionId
 *         required: true
 *         schema:
 *           type: string
 *         example: "clx1234567890"
 *     responses:
 *       200:
 *         description: Dados da transação
 *       404:
 *         description: Transação não encontrada
 */
router.get('/:transactionId', authenticateToken, transactionController.getTransactionById);

/**
 * @swagger
 * /api/transactions/my:
 *   get:
 *     summary: Obter minhas transações
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: tipo
 *         schema:
 *           type: string
 *           enum: [DEPOSITO, SAQUE, TRANSFERENCIA, PAGAMENTO_COMPARTILHADO]
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PENDING, COMPLETED, FAILED, CANCELLED]
 *       - in: query
 *         name: dataInicio
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: dataFim
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Lista de transações
 */
router.get('/my', authenticateToken, transactionController.getMyTransactions);

/**
 * @swagger
 * /api/transactions:
 *   get:
 *     summary: Listar todas as transações
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *       - in: query
 *         name: walletId
 *         schema:
 *           type: string
 *       - in: query
 *         name: tipo
 *         schema:
 *           type: string
 *           enum: [DEPOSITO, SAQUE, TRANSFERENCIA, PAGAMENTO_COMPARTILHADO]
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PENDING, COMPLETED, FAILED, CANCELLED]
 *       - in: query
 *         name: dataInicio
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: dataFim
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Lista de transações
 */
router.get('/', authenticateToken, transactionController.getAllTransactions);

/**
 * @swagger
 * /api/transactions/{transactionId}/status:
 *   put:
 *     summary: Atualizar status da transação
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: transactionId
 *         required: true
 *         schema:
 *           type: string
 *         example: "clx1234567890"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [PENDING, COMPLETED, FAILED, CANCELLED]
 *                 example: "COMPLETED"
 *     responses:
 *       200:
 *         description: Status atualizado com sucesso
 *       400:
 *         description: Status inválido
 */
router.put('/:transactionId/status', authenticateToken, transactionController.updateTransactionStatus);

/**
 * @swagger
 * /api/transactions/{transactionId}/cancel:
 *   post:
 *     summary: Cancelar transação
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: transactionId
 *         required: true
 *         schema:
 *           type: string
 *         example: "clx1234567890"
 *     responses:
 *       200:
 *         description: Transação cancelada com sucesso
 *       400:
 *         description: Transação não pode ser cancelada
 */
router.post('/:transactionId/cancel', authenticateToken, transactionController.cancelTransaction);

module.exports = router;
