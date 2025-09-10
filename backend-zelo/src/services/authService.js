const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { prisma } = require('../config/database');

class AuthService {
  async register(userData) {
    const { nome, email, senha } = userData;

    // Verificar se o usuário já existe
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      throw new Error('Usuário já existe com este email');
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(senha, 10);

    // Criar usuário
    const user = await prisma.user.create({
      data: {
        nome,
        email,
        senha: hashedPassword
      },
      select: {
        id: true,
        nome: true,
        email: true,
        createdAt: true
      }
    });

    // Criar carteira inicial
    await prisma.wallet.create({
      data: {
        userId: user.id,
        saldo: 0
      }
    });

    // Gerar tokens
    const tokens = this.generateTokens(user.id);

    return {
      user,
      ...tokens
    };
  }

  async login(email, senha) {
    // Buscar usuário
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      throw new Error('Credenciais inválidas');
    }

    // Verificar senha
    const isValidPassword = await bcrypt.compare(senha, user.senha);

    if (!isValidPassword) {
      throw new Error('Credenciais inválidas');
    }

    // Gerar tokens
    const tokens = this.generateTokens(user.id);

    return {
      user: {
        id: user.id,
        nome: user.nome,
        email: user.email,
        createdAt: user.createdAt
      },
      ...tokens
    };
  }

  async refreshToken(refreshToken) {
    try {
      const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
      
      // Verificar se o usuário ainda existe
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: {
          id: true,
          nome: true,
          email: true,
          createdAt: true
        }
      });

      if (!user) {
        throw new Error('Usuário não encontrado');
      }

      // Gerar novos tokens
      const tokens = this.generateTokens(user.id);

      return {
        user,
        ...tokens
      };
    } catch (error) {
      throw new Error('Token de refresh inválido');
    }
  }

  generateTokens(userId) {
    const accessToken = jwt.sign(
      { userId },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    const refreshToken = jwt.sign(
      { userId },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN }
    );

    return {
      accessToken,
      refreshToken
    };
  }

  async verifyToken(token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: {
          id: true,
          nome: true,
          email: true,
          createdAt: true
        }
      });

      if (!user) {
        throw new Error('Usuário não encontrado');
      }

      return user;
    } catch (error) {
      throw new Error('Token inválido');
    }
  }
}

module.exports = new AuthService();
