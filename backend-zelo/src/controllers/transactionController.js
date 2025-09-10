const transactionService = require('../services/transactionService');

class TransactionController {
  async createTransaction(req, res) {
    try {
      const userId = req.user.id;
      const { walletId, tipo, valor, descricao, metadata } = req.body;

      // Validações básicas
      if (!walletId || !tipo || !valor) {
        return res.status(400).json({
          success: false,
          message: 'WalletId, tipo e valor são obrigatórios'
        });
      }

      if (valor <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Valor deve ser maior que zero'
        });
      }

      const validTypes = ['DEPOSITO', 'SAQUE', 'TRANSFERENCIA', 'PAGAMENTO_COMPARTILHADO'];
      if (!validTypes.includes(tipo)) {
        return res.status(400).json({
          success: false,
          message: 'Tipo de transação inválido'
        });
      }

      const transaction = await transactionService.createTransaction({
        walletId,
        userId,
        tipo,
        valor: parseFloat(valor),
        descricao,
        metadata
      });

      res.status(201).json({
        success: true,
        message: 'Transação criada com sucesso',
        data: transaction
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async getTransactionById(req, res) {
    try {
      const { transactionId } = req.params;

      const transaction = await transactionService.getTransactionById(transactionId);

      res.json({
        success: true,
        data: transaction
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message
      });
    }
  }

  async getMyTransactions(req, res) {
    try {
      const userId = req.user.id;
      const { page = 1, limit = 10, tipo, status, dataInicio, dataFim } = req.query;

      const filters = {};
      if (tipo) filters.tipo = tipo;
      if (status) filters.status = status;
      if (dataInicio) filters.dataInicio = dataInicio;
      if (dataFim) filters.dataFim = dataFim;

      const result = await transactionService.getUserTransactions(
        userId,
        parseInt(page),
        parseInt(limit),
        filters
      );

      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }

  async getAllTransactions(req, res) {
    try {
      const { page = 1, limit = 10, userId, walletId, tipo, status, dataInicio, dataFim } = req.query;

      const filters = {};
      if (userId) filters.userId = userId;
      if (walletId) filters.walletId = walletId;
      if (tipo) filters.tipo = tipo;
      if (status) filters.status = status;
      if (dataInicio) filters.dataInicio = dataInicio;
      if (dataFim) filters.dataFim = dataFim;

      const result = await transactionService.getAllTransactions(
        parseInt(page),
        parseInt(limit),
        filters
      );

      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }

  async updateTransactionStatus(req, res) {
    try {
      const { transactionId } = req.params;
      const { status } = req.body;

      if (!status) {
        return res.status(400).json({
          success: false,
          message: 'Status é obrigatório'
        });
      }

      const validStatuses = ['PENDING', 'COMPLETED', 'FAILED', 'CANCELLED'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Status inválido'
        });
      }

      const transaction = await transactionService.updateTransactionStatus(transactionId, status);

      res.json({
        success: true,
        message: 'Status da transação atualizado com sucesso',
        data: transaction
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async cancelTransaction(req, res) {
    try {
      const { transactionId } = req.params;
      const userId = req.user.id;

      const transaction = await transactionService.cancelTransaction(transactionId, userId);

      res.json({
        success: true,
        message: 'Transação cancelada com sucesso',
        data: transaction
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = new TransactionController();
