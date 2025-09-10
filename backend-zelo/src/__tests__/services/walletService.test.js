const walletService = require('../../services/walletService');
const { prisma } = require('../../config/database');

// Mock do Prisma
jest.mock('../../config/database', () => ({
  prisma: {
    wallet: {
      findFirst: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      findMany: jest.fn(),
    },
    transaction: {
      findMany: jest.fn(),
      count: jest.fn(),
    },
  },
}));

describe('WalletService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createWallet', () => {
    it('deve criar uma nova carteira com sucesso', async () => {
      const userId = 'user123';

      prisma.wallet.findFirst.mockResolvedValue(null);
      prisma.wallet.create.mockResolvedValue({
        id: 'wallet123',
        userId: 'user123',
        saldo: 0,
        user: {
          id: 'user123',
          nome: 'João Silva',
          email: 'joao@zelo.com'
        }
      });

      const result = await walletService.createWallet(userId);

      expect(result.id).toBe('wallet123');
      expect(result.userId).toBe('user123');
      expect(result.saldo).toBe(0);
      expect(prisma.wallet.create).toHaveBeenCalledWith({
        data: { userId, saldo: 0 },
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
    });

    it('deve falhar ao tentar criar carteira para usuário que já possui uma', async () => {
      const userId = 'user123';

      prisma.wallet.findFirst.mockResolvedValue({
        id: 'existing-wallet',
        userId: 'user123'
      });

      await expect(walletService.createWallet(userId)).rejects.toThrow('Usuário já possui uma carteira');
    });
  });

  describe('getWalletByUserId', () => {
    it('deve retornar carteira do usuário', async () => {
      const userId = 'user123';
      const mockWallet = {
        id: 'wallet123',
        userId: 'user123',
        saldo: 1000,
        user: {
          id: 'user123',
          nome: 'João Silva',
          email: 'joao@zelo.com'
        },
        transactions: []
      };

      prisma.wallet.findFirst.mockResolvedValue(mockWallet);

      const result = await walletService.getWalletByUserId(userId);

      expect(result).toEqual(mockWallet);
      expect(prisma.wallet.findFirst).toHaveBeenCalledWith({
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
    });

    it('deve falhar quando carteira não é encontrada', async () => {
      const userId = 'user123';

      prisma.wallet.findFirst.mockResolvedValue(null);

      await expect(walletService.getWalletByUserId(userId)).rejects.toThrow('Carteira não encontrada');
    });
  });

  describe('updateBalance', () => {
    it('deve atualizar saldo da carteira', async () => {
      const walletId = 'wallet123';
      const newBalance = 1500;

      prisma.wallet.update.mockResolvedValue({
        id: 'wallet123',
        saldo: newBalance
      });

      const result = await walletService.updateBalance(walletId, newBalance);

      expect(result.saldo).toBe(newBalance);
      expect(prisma.wallet.update).toHaveBeenCalledWith({
        where: { id: walletId },
        data: { saldo: newBalance }
      });
    });
  });

  describe('getWalletTransactions', () => {
    it('deve retornar transações da carteira com paginação', async () => {
      const walletId = 'wallet123';
      const page = 1;
      const limit = 10;
      const mockTransactions = [
        { id: 'tx1', valor: 100, tipo: 'DEPOSITO' },
        { id: 'tx2', valor: 50, tipo: 'SAQUE' }
      ];

      prisma.transaction.findMany.mockResolvedValue(mockTransactions);
      prisma.transaction.count.mockResolvedValue(2);

      const result = await walletService.getWalletTransactions(walletId, page, limit);

      expect(result.transactions).toEqual(mockTransactions);
      expect(result.pagination.page).toBe(1);
      expect(result.pagination.limit).toBe(10);
      expect(result.pagination.total).toBe(2);
      expect(result.pagination.pages).toBe(1);
    });
  });
});
