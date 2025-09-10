const walletService = require('../services/walletService');

class WalletController {
  async createWallet(req, res) {
    try {
      const userId = req.user.id;

      const wallet = await walletService.createWallet(userId);

      res.status(201).json({
        success: true,
        message: 'Carteira criada com sucesso',
        data: wallet
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async getMyWallet(req, res) {
    try {
      const userId = req.user.id;

      const wallet = await walletService.getWalletByUserId(userId);

      res.json({
        success: true,
        data: wallet
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message
      });
    }
  }

  async getWalletById(req, res) {
    try {
      const { walletId } = req.params;

      const wallet = await walletService.getWalletById(walletId);

      res.json({
        success: true,
        data: wallet
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message
      });
    }
  }

  async getAllWallets(req, res) {
    try {
      const wallets = await walletService.getAllWallets();

      res.json({
        success: true,
        data: wallets
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }

  async getWalletTransactions(req, res) {
    try {
      const { walletId } = req.params;
      const { page = 1, limit = 10 } = req.query;

      const result = await walletService.getWalletTransactions(
        walletId,
        parseInt(page),
        parseInt(limit)
      );

      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message
      });
    }
  }

  async getMyWalletTransactions(req, res) {
    try {
      const userId = req.user.id;
      const { page = 1, limit = 10 } = req.query;

      // Buscar carteira do usuário
      const wallet = await walletService.getWalletByUserId(userId);

      const result = await walletService.getWalletTransactions(
        wallet.id,
        parseInt(page),
        parseInt(limit)
      );

      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = new WalletController();
