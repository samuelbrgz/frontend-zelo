const express = require('express');
const walletController = require('../controllers/walletController');
const { authenticateToken } = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * @swagger
 * /api/wallets:
 *   post:
 *     summary: Criar nova carteira
 *     tags: [Wallets]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Carteira criada com sucesso
 *       400:
 *         description: Usuário já possui carteira
 */
router.post('/', authenticateToken, walletController.createWallet);

/**
 * @swagger
 * /api/wallets/my:
 *   get:
 *     summary: Obter minha carteira
 *     tags: [Wallets]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dados da carteira
 *       404:
 *         description: Carteira não encontrada
 */
router.get('/my', authenticateToken, walletController.getMyWallet);

/**
 * @swagger
 * /api/wallets/{walletId}:
 *   get:
 *     summary: Obter carteira por ID
 *     tags: [Wallets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: walletId
 *         required: true
 *         schema:
 *           type: string
 *         example: "clx1234567890"
 *     responses:
 *       200:
 *         description: Dados da carteira
 *       404:
 *         description: Carteira não encontrada
 */
router.get('/:walletId', authenticateToken, walletController.getWalletById);

/**
 * @swagger
 * /api/wallets:
 *   get:
 *     summary: Listar todas as carteiras
 *     tags: [Wallets]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de carteiras
 */
router.get('/', authenticateToken, walletController.getAllWallets);

/**
 * @swagger
 * /api/wallets/{walletId}/transactions:
 *   get:
 *     summary: Obter transações de uma carteira
 *     tags: [Wallets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: walletId
 *         required: true
 *         schema:
 *           type: string
 *         example: "clx1234567890"
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
 *     responses:
 *       200:
 *         description: Lista de transações
 *       404:
 *         description: Carteira não encontrada
 */
router.get('/:walletId/transactions', authenticateToken, walletController.getWalletTransactions);

/**
 * @swagger
 * /api/wallets/my/transactions:
 *   get:
 *     summary: Obter minhas transações
 *     tags: [Wallets]
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
 *     responses:
 *       200:
 *         description: Lista de transações
 *       404:
 *         description: Carteira não encontrada
 */
router.get('/my/transactions', authenticateToken, walletController.getMyWalletTransactions);

module.exports = router;
