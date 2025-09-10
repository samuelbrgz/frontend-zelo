const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Zelo Backend API',
      version: '1.0.0',
      description: 'API para sistema de carteira digital com contratos de pagamento compartilhado',
      contact: {
        name: 'Zelo Team',
        email: 'contato@zelo.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: process.env.NODE_ENV === 'production' 
          ? 'https://api.zelo.com' 
          : `http://localhost:${process.env.PORT || 4000}`,
        description: process.env.NODE_ENV === 'production' ? 'Servidor de Produção' : 'Servidor de Desenvolvimento'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Token JWT para autenticação'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: 'clx1234567890'
            },
            nome: {
              type: 'string',
              example: 'João Silva'
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'joao@zelo.com'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              example: '2024-01-01T00:00:00.000Z'
            }
          }
        },
        Wallet: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: 'clx1234567890'
            },
            userId: {
              type: 'string',
              example: 'clx1234567890'
            },
            saldo: {
              type: 'number',
              format: 'decimal',
              example: 1000.50
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              example: '2024-01-01T00:00:00.000Z'
            },
            user: {
              $ref: '#/components/schemas/User'
            }
          }
        },
        Transaction: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: 'clx1234567890'
            },
            walletId: {
              type: 'string',
              example: 'clx1234567890'
            },
            userId: {
              type: 'string',
              example: 'clx1234567890'
            },
            tipo: {
              type: 'string',
              enum: ['DEPOSITO', 'SAQUE', 'TRANSFERENCIA', 'PAGAMENTO_COMPARTILHADO'],
              example: 'DEPOSITO'
            },
            valor: {
              type: 'number',
              format: 'decimal',
              example: 100.50
            },
            status: {
              type: 'string',
              enum: ['PENDING', 'COMPLETED', 'FAILED', 'CANCELLED'],
              example: 'COMPLETED'
            },
            descricao: {
              type: 'string',
              example: 'Depósito via PIX'
            },
            metadata: {
              type: 'object',
              example: { "pixKey": "12345678901" }
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              example: '2024-01-01T00:00:00.000Z'
            }
          }
        },
        SharedContract: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: 'clx1234567890'
            },
            valorTotal: {
              type: 'number',
              format: 'decimal',
              example: 300.00
            },
            status: {
              type: 'string',
              enum: ['ACTIVE', 'COMPLETED', 'CANCELLED', 'EXPIRED'],
              example: 'ACTIVE'
            },
            descricao: {
              type: 'string',
              example: 'Jantar em grupo - Restaurante XYZ'
            },
            metadata: {
              type: 'object',
              example: { "local": "Restaurante XYZ", "data": "2024-01-15" }
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              example: '2024-01-01T00:00:00.000Z'
            },
            participants: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/SharedContractParticipant'
              }
            }
          }
        },
        SharedContractParticipant: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: 'clx1234567890'
            },
            sharedContractId: {
              type: 'string',
              example: 'clx1234567890'
            },
            userId: {
              type: 'string',
              example: 'clx1234567890'
            },
            valorParticipacao: {
              type: 'number',
              format: 'decimal',
              example: 100.00
            },
            status: {
              type: 'string',
              enum: ['PENDING', 'CONFIRMED', 'PAID', 'CANCELLED'],
              example: 'PENDING'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              example: '2024-01-01T00:00:00.000Z'
            },
            user: {
              $ref: '#/components/schemas/User'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            message: {
              type: 'string',
              example: 'Erro na operação'
            },
            errors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  field: {
                    type: 'string',
                    example: 'email'
                  },
                  message: {
                    type: 'string',
                    example: 'Email é obrigatório'
                  }
                }
              }
            }
          }
        },
        Success: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            message: {
              type: 'string',
              example: 'Operação realizada com sucesso'
            },
            data: {
              type: 'object',
              description: 'Dados retornados pela operação'
            }
          }
        },
        Pagination: {
          type: 'object',
          properties: {
            page: {
              type: 'integer',
              example: 1
            },
            limit: {
              type: 'integer',
              example: 10
            },
            total: {
              type: 'integer',
              example: 100
            },
            pages: {
              type: 'integer',
              example: 10
            }
          }
        }
      }
    },
    tags: [
      {
        name: 'Auth',
        description: 'Endpoints de autenticação e autorização'
      },
      {
        name: 'Wallets',
        description: 'Endpoints para gerenciamento de carteiras'
      },
      {
        name: 'Transactions',
        description: 'Endpoints para gerenciamento de transações'
      },
      {
        name: 'Shared Contracts',
        description: 'Endpoints para contratos de pagamento compartilhado'
      }
    ]
  },
  apis: [
    './src/routes/*.js',
    './src/controllers/*.js'
  ]
};

const specs = swaggerJsdoc(options);

const swaggerOptions = {
  customCss: `
    .swagger-ui .topbar { display: none }
    .swagger-ui .info .title { color: #2563eb; }
    .swagger-ui .scheme-container { background: #f8fafc; padding: 20px; border-radius: 8px; }
  `,
  customSiteTitle: 'Zelo API Documentation',
  customfavIcon: '/favicon.ico'
};

module.exports = {
  specs,
  swaggerUi,
  swaggerOptions
};
