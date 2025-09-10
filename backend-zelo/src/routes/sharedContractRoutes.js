const express = require('express');
const sharedContractController = require('../controllers/sharedContractController');
const { authenticateToken } = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * @swagger
 * /api/shared-contracts:
 *   post:
 *     summary: Criar novo contrato compartilhado
 *     tags: [Shared Contracts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - valorTotal
 *               - participantes
 *             properties:
 *               valorTotal:
 *                 type: number
 *                 example: 300.00
 *               descricao:
 *                 type: string
 *                 example: "Jantar em grupo - Restaurante XYZ"
 *               metadata:
 *                 type: object
 *                 example: {"local": "Restaurante XYZ", "data": "2024-01-15"}
 *               participantes:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - userId
 *                     - valorParticipacao
 *                   properties:
 *                     userId:
 *                       type: string
 *                       example: "clx1234567890"
 *                     valorParticipacao:
 *                       type: number
 *                       example: 100.00
 *     responses:
 *       201:
 *         description: Contrato criado com sucesso
 *       400:
 *         description: Dados inválidos
 */
router.post('/', authenticateToken, sharedContractController.createSharedContract);

/**
 * @swagger
 * /api/shared-contracts/{contractId}:
 *   get:
 *     summary: Obter contrato compartilhado por ID
 *     tags: [Shared Contracts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: contractId
 *         required: true
 *         schema:
 *           type: string
 *         example: "clx1234567890"
 *     responses:
 *       200:
 *         description: Dados do contrato
 *       404:
 *         description: Contrato não encontrado
 */
router.get('/:contractId', authenticateToken, sharedContractController.getSharedContractById);

/**
 * @swagger
 * /api/shared-contracts/my:
 *   get:
 *     summary: Obter meus contratos compartilhados
 *     tags: [Shared Contracts]
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
 *         description: Lista de contratos
 */
router.get('/my', authenticateToken, sharedContractController.getMySharedContracts);

/**
 * @swagger
 * /api/shared-contracts:
 *   get:
 *     summary: Listar todos os contratos compartilhados
 *     tags: [Shared Contracts]
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
 *         name: status
 *         schema:
 *           type: string
 *           enum: [ACTIVE, COMPLETED, CANCELLED, EXPIRED]
 *     responses:
 *       200:
 *         description: Lista de contratos
 */
router.get('/', authenticateToken, sharedContractController.getAllSharedContracts);

/**
 * @swagger
 * /api/shared-contracts/{contractId}/confirm:
 *   post:
 *     summary: Confirmar participação no contrato
 *     tags: [Shared Contracts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: contractId
 *         required: true
 *         schema:
 *           type: string
 *         example: "clx1234567890"
 *     responses:
 *       200:
 *         description: Participação confirmada com sucesso
 *       400:
 *         description: Participação não pode ser confirmada
 */
router.post('/:contractId/confirm', authenticateToken, sharedContractController.confirmParticipation);

/**
 * @swagger
 * /api/shared-contracts/{contractId}/cancel:
 *   post:
 *     summary: Cancelar participação no contrato
 *     tags: [Shared Contracts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: contractId
 *         required: true
 *         schema:
 *           type: string
 *         example: "clx1234567890"
 *     responses:
 *       200:
 *         description: Participação cancelada com sucesso
 *       400:
 *         description: Participação não pode ser cancelada
 */
router.post('/:contractId/cancel', authenticateToken, sharedContractController.cancelParticipation);

/**
 * @swagger
 * /api/shared-contracts/{contractId}/pay:
 *   post:
 *     summary: Processar pagamento do contrato
 *     tags: [Shared Contracts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: contractId
 *         required: true
 *         schema:
 *           type: string
 *         example: "clx1234567890"
 *     responses:
 *       200:
 *         description: Pagamento processado com sucesso
 *       400:
 *         description: Pagamento não pode ser processado
 */
router.post('/:contractId/pay', authenticateToken, sharedContractController.processPayment);

/**
 * @swagger
 * /api/shared-contracts/{contractId}/complete:
 *   post:
 *     summary: Finalizar contrato
 *     tags: [Shared Contracts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: contractId
 *         required: true
 *         schema:
 *           type: string
 *         example: "clx1234567890"
 *     responses:
 *       200:
 *         description: Contrato finalizado com sucesso
 *       400:
 *         description: Contrato não pode ser finalizado
 */
router.post('/:contractId/complete', authenticateToken, sharedContractController.completeContract);

/**
 * @swagger
 * /api/shared-contracts/{contractId}/cancel-contract:
 *   post:
 *     summary: Cancelar contrato
 *     tags: [Shared Contracts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: contractId
 *         required: true
 *         schema:
 *           type: string
 *         example: "clx1234567890"
 *     responses:
 *       200:
 *         description: Contrato cancelado com sucesso
 *       400:
 *         description: Contrato não pode ser cancelado
 */
router.post('/:contractId/cancel-contract', authenticateToken, sharedContractController.cancelContract);

module.exports = router;
