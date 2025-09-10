const { prisma } = require('../config/database');
const walletService = require('./walletService');

class TransactionService {
  async createTransaction(transactionData) {
    const { walletId, userId, tipo, valor, descricao, metadata } = transactionData;

    // Verificar se a carteira existe
    const wallet = await walletService.getWalletById(walletId);

    // Verificar se o usuário é o dono da carteira
    if (wallet.userId !== userId) {
      throw new Error('Usuário não tem permissão para esta carteira');
    }

    // Verificar saldo para saques e transferências
    if ((tipo === 'SAQUE' || tipo === 'TRANSFERENCIA') && wallet.saldo < valor) {
      throw new Error('Saldo insuficiente');
    }

    // Criar transação
    const transaction = await prisma.transaction.create({
      data: {
        walletId,
        userId,
        tipo,
        valor,
        descricao,
        metadata,
        status: 'PENDING'
      }
    });

    // Atualizar saldo da carteira
    let newBalance = wallet.saldo;
    if (tipo === 'DEPOSITO') {
      newBalance += valor;
    } else if (tipo === 'SAQUE' || tipo === 'TRANSFERENCIA') {
      newBalance -= valor;
    }

    await walletService.updateBalance(walletId, newBalance);

    // Atualizar status da transação
    const updatedTransaction = await prisma.transaction.update({
      where: { id: transaction.id },
      data: { status: 'COMPLETED' },
      include: {
        wallet: {
          include: {
            user: {
              select: {
                id: true,
                nome: true,
                email: true
              }
            }
          }
        }
      }
    });

    return updatedTransaction;
  }

  async getTransactionById(transactionId) {
    const transaction = await prisma.transaction.findUnique({
      where: { id: transactionId },
      include: {
        wallet: {
          include: {
            user: {
              select: {
                id: true,
                nome: true,
                email: true
              }
            }
          }
        }
      }
    });

    if (!transaction) {
      throw new Error('Transação não encontrada');
    }

    return transaction;
  }

  async getUserTransactions(userId, page = 1, limit = 10, filters = {}) {
    const skip = (page - 1) * limit;
    const where = { userId };

    // Aplicar filtros
    if (filters.tipo) {
      where.tipo = filters.tipo;
    }
    if (filters.status) {
      where.status = filters.status;
    }
    if (filters.dataInicio && filters.dataFim) {
      where.createdAt = {
        gte: new Date(filters.dataInicio),
        lte: new Date(filters.dataFim)
      };
    }

    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          wallet: {
            include: {
              user: {
                select: {
                  id: true,
                  nome: true,
                  email: true
                }
              }
            }
          }
        }
      }),
      prisma.transaction.count({ where })
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

  async getAllTransactions(page = 1, limit = 10, filters = {}) {
    const skip = (page - 1) * limit;
    const where = {};

    // Aplicar filtros
    if (filters.userId) {
      where.userId = filters.userId;
    }
    if (filters.walletId) {
      where.walletId = filters.walletId;
    }
    if (filters.tipo) {
      where.tipo = filters.tipo;
    }
    if (filters.status) {
      where.status = filters.status;
    }
    if (filters.dataInicio && filters.dataFim) {
      where.createdAt = {
        gte: new Date(filters.dataInicio),
        lte: new Date(filters.dataFim)
      };
    }

    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          wallet: {
            include: {
              user: {
                select: {
                  id: true,
                  nome: true,
                  email: true
                }
              }
            }
          }
        }
      }),
      prisma.transaction.count({ where })
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

  async updateTransactionStatus(transactionId, status) {
    const transaction = await prisma.transaction.update({
      where: { id: transactionId },
      data: { status },
      include: {
        wallet: {
          include: {
            user: {
              select: {
                id: true,
                nome: true,
                email: true
              }
            }
          }
        }
      }
    });

    return transaction;
  }

  async cancelTransaction(transactionId, userId) {
    const transaction = await this.getTransactionById(transactionId);

    // Verificar se o usuário é o dono da transação
    if (transaction.userId !== userId) {
      throw new Error('Usuário não tem permissão para cancelar esta transação');
    }

    // Verificar se a transação pode ser cancelada
    if (transaction.status !== 'PENDING') {
      throw new Error('Transação não pode ser cancelada');
    }

    // Atualizar status
    const updatedTransaction = await this.updateTransactionStatus(transactionId, 'CANCELLED');

    return updatedTransaction;
  }
}

module.exports = new TransactionService();
