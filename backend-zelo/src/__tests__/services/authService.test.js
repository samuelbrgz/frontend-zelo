const authService = require('../../services/authService');
const { prisma } = require('../../config/database');

// Mock do Prisma
jest.mock('../../config/database', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
    wallet: {
      create: jest.fn(),
    },
  },
}));

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('deve registrar um novo usuário com sucesso', async () => {
      const userData = {
        nome: 'João Silva',
        email: 'joao@zelo.com',
        senha: '123456'
      };

      prisma.user.findUnique.mockResolvedValue(null);
      prisma.user.create.mockResolvedValue({
        id: 'user123',
        nome: 'João Silva',
        email: 'joao@zelo.com',
        createdAt: new Date()
      });
      prisma.wallet.create.mockResolvedValue({
        id: 'wallet123',
        userId: 'user123',
        saldo: 0
      });

      const result = await authService.register(userData);

      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
      expect(result.user.nome).toBe('João Silva');
      expect(result.user.email).toBe('joao@zelo.com');
    });

    it('deve falhar ao tentar registrar usuário com email existente', async () => {
      const userData = {
        nome: 'João Silva',
        email: 'joao@zelo.com',
        senha: '123456'
      };

      prisma.user.findUnique.mockResolvedValue({
        id: 'existing-user',
        email: 'joao@zelo.com'
      });

      await expect(authService.register(userData)).rejects.toThrow('Usuário já existe com este email');
    });
  });

  describe('login', () => {
    it('deve fazer login com credenciais válidas', async () => {
      const email = 'joao@zelo.com';
      const senha = '123456';
      const hashedPassword = '$2a$10$hashedpassword';

      prisma.user.findUnique.mockResolvedValue({
        id: 'user123',
        nome: 'João Silva',
        email: 'joao@zelo.com',
        senha: hashedPassword,
        createdAt: new Date()
      });

      // Mock bcrypt.compare
      const bcrypt = require('bcryptjs');
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

      const result = await authService.login(email, senha);

      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
      expect(result.user.email).toBe('joao@zelo.com');
    });

    it('deve falhar com credenciais inválidas', async () => {
      const email = 'joao@zelo.com';
      const senha = 'wrongpassword';

      prisma.user.findUnique.mockResolvedValue(null);

      await expect(authService.login(email, senha)).rejects.toThrow('Credenciais inválidas');
    });
  });

  describe('verifyToken', () => {
    it('deve verificar token válido', async () => {
      const userId = 'user123';
      const token = 'valid-token';

      prisma.user.findUnique.mockResolvedValue({
        id: 'user123',
        nome: 'João Silva',
        email: 'joao@zelo.com',
        createdAt: new Date()
      });

      // Mock jwt.verify
      const jwt = require('jsonwebtoken');
      jest.spyOn(jwt, 'verify').mockReturnValue({ userId });

      const result = await authService.verifyToken(token);

      expect(result.id).toBe('user123');
      expect(result.nome).toBe('João Silva');
    });

    it('deve falhar com token inválido', async () => {
      const token = 'invalid-token';

      // Mock jwt.verify para lançar erro
      const jwt = require('jsonwebtoken');
      jest.spyOn(jwt, 'verify').mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await expect(authService.verifyToken(token)).rejects.toThrow('Token inválido');
    });
  });
});
