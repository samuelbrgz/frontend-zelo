/**
 * Dados mock para desenvolvimento e testes
 */

const mockUsers = [
  {
    id: 'user1',
    nome: 'João Silva',
    email: 'joao@zelo.com',
    senha: '$2a$10$hashedpassword1',
    createdAt: new Date('2024-01-01')
  },
  {
    id: 'user2',
    nome: 'Maria Santos',
    email: 'maria@zelo.com',
    senha: '$2a$10$hashedpassword2',
    createdAt: new Date('2024-01-02')
  },
  {
    id: 'user3',
    nome: 'Pedro Costa',
    email: 'pedro@zelo.com',
    senha: '$2a$10$hashedpassword3',
    createdAt: new Date('2024-01-03')
  }
];

const mockWallets = [
  {
    id: 'wallet1',
    userId: 'user1',
    saldo: 1000.00,
    createdAt: new Date('2024-01-01')
  },
  {
    id: 'wallet2',
    userId: 'user2',
    saldo: 500.00,
    createdAt: new Date('2024-01-02')
  },
  {
    id: 'wallet3',
    userId: 'user3',
    saldo: 750.00,
    createdAt: new Date('2024-01-03')
  }
];

const mockTransactions = [
  {
    id: 'tx1',
    walletId: 'wallet1',
    userId: 'user1',
    tipo: 'DEPOSITO',
    valor: 1000.00,
    status: 'COMPLETED',
    descricao: 'Depósito inicial',
    createdAt: new Date('2024-01-01')
  },
  {
    id: 'tx2',
    walletId: 'wallet2',
    userId: 'user2',
    tipo: 'DEPOSITO',
    valor: 500.00,
    status: 'COMPLETED',
    descricao: 'Depósito inicial',
    createdAt: new Date('2024-01-02')
  },
  {
    id: 'tx3',
    walletId: 'wallet3',
    userId: 'user3',
    tipo: 'DEPOSITO',
    valor: 750.00,
    status: 'COMPLETED',
    descricao: 'Depósito inicial',
    createdAt: new Date('2024-01-03')
  }
];

const mockSharedContracts = [
  {
    id: 'contract1',
    valorTotal: 300.00,
    status: 'ACTIVE',
    descricao: 'Jantar em grupo - Restaurante XYZ',
    metadata: {
      local: 'Restaurante XYZ',
      data: '2024-01-15',
      observacoes: 'Divisão igual entre 3 pessoas'
    },
    createdAt: new Date('2024-01-10')
  },
  {
    id: 'contract2',
    valorTotal: 1500.00,
    status: 'COMPLETED',
    descricao: 'Viagem para praia - Final de semana',
    metadata: {
      destino: 'Praia do Forte',
      dataInicio: '2024-02-10',
      dataFim: '2024-02-12',
      hospedagem: 'Pousada do Mar'
    },
    createdAt: new Date('2024-01-20')
  }
];

const mockSharedContractParticipants = [
  {
    id: 'participant1',
    sharedContractId: 'contract1',
    userId: 'user1',
    valorParticipacao: 100.00,
    status: 'CONFIRMED',
    createdAt: new Date('2024-01-10')
  },
  {
    id: 'participant2',
    sharedContractId: 'contract1',
    userId: 'user2',
    valorParticipacao: 100.00,
    status: 'PENDING',
    createdAt: new Date('2024-01-10')
  },
  {
    id: 'participant3',
    sharedContractId: 'contract1',
    userId: 'user3',
    valorParticipacao: 100.00,
    status: 'PENDING',
    createdAt: new Date('2024-01-10')
  }
];

// Dados para exemplos de API
const apiExamples = {
  register: {
    nome: 'João Silva',
    email: 'joao@zelo.com',
    senha: '123456'
  },
  login: {
    email: 'joao@zelo.com',
    senha: '123456'
  },
  createTransaction: {
    walletId: 'wallet1',
    tipo: 'DEPOSITO',
    valor: 100.00,
    descricao: 'Depósito via PIX',
    metadata: {
      pixKey: '12345678901'
    }
  },
  createSharedContract: {
    valorTotal: 300.00,
    descricao: 'Jantar em grupo - Restaurante XYZ',
    metadata: {
      local: 'Restaurante XYZ',
      data: '2024-01-15'
    },
    participantes: [
      { userId: 'user1', valorParticipacao: 100.00 },
      { userId: 'user2', valorParticipacao: 100.00 },
      { userId: 'user3', valorParticipacao: 100.00 }
    ]
  }
};

// Respostas de exemplo da API
const apiResponses = {
  success: {
    success: true,
    message: 'Operação realizada com sucesso',
    data: {}
  },
  error: {
    success: false,
    message: 'Erro na operação',
    errors: []
  },
  user: {
    id: 'user123',
    nome: 'João Silva',
    email: 'joao@zelo.com',
    createdAt: '2024-01-01T00:00:00.000Z'
  },
  wallet: {
    id: 'wallet123',
    userId: 'user123',
    saldo: 1000.50,
    createdAt: '2024-01-01T00:00:00.000Z',
    user: {
      id: 'user123',
      nome: 'João Silva',
      email: 'joao@zelo.com'
    }
  },
  transaction: {
    id: 'tx123',
    walletId: 'wallet123',
    userId: 'user123',
    tipo: 'DEPOSITO',
    valor: 100.00,
    status: 'COMPLETED',
    descricao: 'Depósito via PIX',
    createdAt: '2024-01-01T00:00:00.000Z'
  },
  sharedContract: {
    id: 'contract123',
    valorTotal: 300.00,
    status: 'ACTIVE',
    descricao: 'Jantar em grupo',
    createdAt: '2024-01-01T00:00:00.000Z',
    participants: [
      {
        id: 'participant123',
        userId: 'user123',
        valorParticipacao: 100.00,
        status: 'PENDING',
        user: {
          id: 'user123',
          nome: 'João Silva',
          email: 'joao@zelo.com'
        }
      }
    ]
  }
};

module.exports = {
  mockUsers,
  mockWallets,
  mockTransactions,
  mockSharedContracts,
  mockSharedContractParticipants,
  apiExamples,
  apiResponses
};
