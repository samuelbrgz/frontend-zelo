const request = require('supertest');
const app = require('../../app');

// Mock do banco de dados para testes de integração
jest.mock('../../config/database', () => ({
  connectDB: jest.fn().mockResolvedValue(),
  prisma: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
    wallet: {
      findFirst: jest.fn(),
      create: jest.fn(),
    },
    transaction: {
      create: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
    },
    sharedContract: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
    },
    sharedContractParticipant: {
      createMany: jest.fn(),
    },
  },
}));

describe('API Integration Tests', () => {
  describe('GET /health', () => {
    it('deve retornar status de saúde', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('Zelo Backend está funcionando');
    });
  });

  describe('GET /', () => {
    it('deve retornar informações da API', async () => {
      const response = await request(app)
        .get('/')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('Bem-vindo à API do Zelo');
      expect(response.body.endpoints).toHaveProperty('auth');
      expect(response.body.endpoints).toHaveProperty('wallets');
      expect(response.body.endpoints).toHaveProperty('transactions');
      expect(response.body.endpoints).toHaveProperty('sharedContracts');
    });
  });

  describe('POST /api/auth/register', () => {
    it('deve registrar novo usuário', async () => {
      const { prisma } = require('../../config/database');
      
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

      const userData = {
        nome: 'João Silva',
        email: 'joao@zelo.com',
        senha: '123456'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('Usuário criado com sucesso');
      expect(response.body.data).toHaveProperty('user');
      expect(response.body.data).toHaveProperty('accessToken');
    });

    it('deve falhar com dados inválidos', async () => {
      const userData = {
        nome: '',
        email: 'email-invalido',
        senha: '123'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/auth/login', () => {
    it('deve fazer login com credenciais válidas', async () => {
      const { prisma } = require('../../config/database');
      
      prisma.user.findUnique.mockResolvedValue({
        id: 'user123',
        nome: 'João Silva',
        email: 'joao@zelo.com',
        senha: '$2a$10$hashedpassword',
        createdAt: new Date()
      });

      // Mock bcrypt.compare
      const bcrypt = require('bcryptjs');
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

      const loginData = {
        email: 'joao@zelo.com',
        senha: '123456'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('Login realizado com sucesso');
      expect(response.body.data).toHaveProperty('user');
      expect(response.body.data).toHaveProperty('accessToken');
    });

    it('deve falhar com credenciais inválidas', async () => {
      const { prisma } = require('../../config/database');
      
      prisma.user.findUnique.mockResolvedValue(null);

      const loginData = {
        email: 'joao@zelo.com',
        senha: 'senha-errada'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Credenciais inválidas');
    });
  });

  describe('GET /api/wallets/my', () => {
    it('deve retornar carteira do usuário autenticado', async () => {
      const { prisma } = require('../../config/database');
      
      prisma.wallet.findFirst.mockResolvedValue({
        id: 'wallet123',
        userId: 'user123',
        saldo: 1000,
        user: {
          id: 'user123',
          nome: 'João Silva',
          email: 'joao@zelo.com'
        },
        transactions: []
      });

      // Mock JWT token
      const jwt = require('jsonwebtoken');
      const token = jwt.sign({ userId: 'user123' }, 'test-secret');

      const response = await request(app)
        .get('/api/wallets/my')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.saldo).toBe(1000);
    });

    it('deve falhar sem token de autenticação', async () => {
      const response = await request(app)
        .get('/api/wallets/my')
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Token de acesso requerido');
    });
  });

  describe('404 - Rota não encontrada', () => {
    it('deve retornar 404 para rota inexistente', async () => {
      const response = await request(app)
        .get('/api/rota-inexistente')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Rota não encontrada');
    });
  });
});
