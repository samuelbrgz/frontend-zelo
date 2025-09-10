const { prisma } = require('../config/database');

class WalletService {
  async createWallet(userId) {
    // Verificar se o usuário já tem uma carteira
    const existingWallet = await prisma.wallet.findFirst({
      where: { userId }
    });

    if (existingWallet) {
      throw new Error('Usuário já possui uma carteira');
    }

    const wallet = await prisma.wallet.create({
      data: {
        userId,
        saldo: 0
      },
      include: {
        user: {
          select: {
            id: true,
            nome: true,
            email: true
          }
        }
      }
    });

    return wallet;
  }

  async getWalletByUserId(userId) {
    const wallet = await prisma.wallet.findFirst({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            nome: true,
            email: true
          }
        },
        transactions: {
          orderBy: { createdAt: 'desc' },
          take: 10
        }
      }
    });

    if (!wallet) {
      throw new Error('Carteira não encontrada');
    }

    return wallet;
  }

  async getWalletById(walletId) {
    const wallet = await prisma.wallet.findUnique({
      where: { id: walletId },
      include: {
        user: {
          select: {
            id: true,
            nome: true,
            email: true
          }
        }
      }
    });

    if (!wallet) {
      throw new Error('Carteira não encontrada');
    }

    return wallet;
  }

  async updateBalance(walletId, newBalance) {
    const wallet = await prisma.wallet.update({
      where: { id: walletId },
      data: { saldo: newBalance }
    });

    return wallet;
  }

  async getAllWallets() {
    const wallets = await prisma.wallet.findMany({
      include: {
        user: {
          select: {
            id: true,
            nome: true,
            email: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return wallets;
  }

  async getWalletTransactions(walletId, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where: { walletId },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.transaction.count({
        where: { walletId }
      })
    ]);

    return {
      transactions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }
}

module.exports = new WalletService();
