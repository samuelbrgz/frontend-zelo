require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// Configurações
const { connectDB } = require('./config/database');
const { specs, swaggerUi, swaggerOptions } = require('./config/swagger');
const { errorHandler, notFound } = require('./middleware/errorMiddleware');

// Rotas
const authRoutes = require('./routes/authRoutes');
const walletRoutes = require('./routes/walletRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const sharedContractRoutes = require('./routes/sharedContractRoutes');

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware de segurança
app.use(helmet());

// CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutos
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // 100 requests por IP
  message: {
    success: false,
    message: 'Muitas tentativas. Tente novamente em alguns minutos.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

app.use(limiter);

// Middleware para parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging de requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path} - IP: ${req.ip}`);
  next();
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Zelo Backend está funcionando!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0'
  });
});

// Documentação da API
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, swaggerOptions));

// Rotas da API
app.use('/api/auth', authRoutes);
app.use('/api/wallets', walletRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/shared-contracts', sharedContractRoutes);

// Rota raiz
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Bem-vindo à API do Zelo!',
    documentation: '/api-docs',
    health: '/health',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      wallets: '/api/wallets',
      transactions: '/api/transactions',
      sharedContracts: '/api/shared-contracts'
    }
  });
});

// Middleware de tratamento de erros
app.use(notFound);
app.use(errorHandler);

// Inicialização do servidor
const startServer = async () => {
  try {
    // Conectar ao banco de dados
    await connectDB();
    
    // Iniciar servidor
    app.listen(PORT, () => {
      console.log(`
🚀 Servidor Zelo Backend iniciado!
📍 Porta: ${PORT}
🌍 Ambiente: ${process.env.NODE_ENV || 'development'}
📚 Documentação: http://localhost:${PORT}/api-docs
🏥 Health Check: http://localhost:${PORT}/health
🔗 API Base: http://localhost:${PORT}/api
      `);
    });
  } catch (error) {
    console.error('❌ Erro ao iniciar servidor:', error);
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM recebido. Encerrando servidor...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT recebido. Encerrando servidor...');
  process.exit(0);
});

// Iniciar servidor
startServer();

module.exports = app;
