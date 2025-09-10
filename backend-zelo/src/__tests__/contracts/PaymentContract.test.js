const PaymentContract = require('../../contracts/PaymentContract');

describe('PaymentContract', () => {
  let contract;
  const contractData = {
    contractId: 'contract123',
    totalAmount: 300,
    participants: [
      { userId: 'user1', amount: 100 },
      { userId: 'user2', amount: 100 },
      { userId: 'user3', amount: 100 }
    ],
    description: 'Jantar em grupo'
  };

  beforeEach(() => {
    contract = new PaymentContract(
      contractData.contractId,
      contractData.totalAmount,
      contractData.participants,
      contractData.description
    );
  });

  describe('Constructor', () => {
    it('deve criar contrato com dados corretos', () => {
      expect(contract.contractId).toBe('contract123');
      expect(contract.totalAmount).toBe(300);
      expect(contract.participants).toHaveLength(3);
      expect(contract.status).toBe('ACTIVE');
      expect(contract.description).toBe('Jantar em grupo');
    });
  });

  describe('addParticipant', () => {
    it('deve adicionar novo participante', () => {
      contract.addParticipant('user4', 75);
      
      expect(contract.participants).toHaveLength(4);
      expect(contract.participants[3]).toEqual({
        userId: 'user4',
        amount: 75,
        status: 'PENDING'
      });
    });

    it('deve falhar ao adicionar participante duplicado', () => {
      expect(() => {
        contract.addParticipant('user1', 50);
      }).toThrow('Usuário já é participante do contrato');
    });

    it('deve falhar ao adicionar participante em contrato inativo', () => {
      contract.status = 'COMPLETED';
      
      expect(() => {
        contract.addParticipant('user4', 50);
      }).toThrow('Contrato não está ativo');
    });
  });

  describe('confirmParticipation', () => {
    it('deve confirmar participação', () => {
      // Resetar status para PENDING antes do teste
      contract.participants[0].status = 'PENDING';
      
      const result = contract.confirmParticipation('user1');
      
      expect(result).toBe(true);
      expect(contract.participants[0].status).toBe('CONFIRMED');
    });

    it('deve falhar ao confirmar participação de usuário inexistente', () => {
      expect(() => {
        contract.confirmParticipation('user999');
      }).toThrow('Usuário não é participante do contrato');
    });

    it('deve falhar ao confirmar participação já confirmada', () => {
      // Primeiro confirmar a participação
      contract.participants[0].status = 'PENDING';
      contract.confirmParticipation('user1');
      
      // Tentar confirmar novamente
      expect(() => {
        contract.confirmParticipation('user1');
      }).toThrow('Participação já foi confirmada ou cancelada');
    });
  });

  describe('processPayment', () => {
    beforeEach(() => {
      // Resetar status para PENDING antes de confirmar
      contract.participants[0].status = 'PENDING';
      // Confirmar participação antes de processar pagamento
      contract.confirmParticipation('user1');
    });

    it('deve processar pagamento com sucesso', () => {
      const result = contract.processPayment('user1', 100);
      
      expect(result.transactionId).toMatch(/^tx_/);
      expect(result.userId).toBe('user1');
      expect(result.amount).toBe(100);
      expect(result.status).toBe('COMPLETED');
      expect(contract.participants[0].status).toBe('PAID');
    });

    it('deve finalizar contrato quando todos pagarem', () => {
      // Criar um novo contrato para este teste
      const testContract = new PaymentContract(
        'test-contract',
        300,
        [
          { userId: 'user1', amount: 100 },
          { userId: 'user2', amount: 100 },
          { userId: 'user3', amount: 100 }
        ]
      );
      
      // Confirmar todos os participantes (resetar status primeiro)
      testContract.participants[0].status = 'PENDING';
      testContract.participants[1].status = 'PENDING';
      testContract.participants[2].status = 'PENDING';
      testContract.confirmParticipation('user1');
      testContract.confirmParticipation('user2');
      testContract.confirmParticipation('user3');
      
      // Processar pagamentos
      testContract.processPayment('user1', 100);
      testContract.processPayment('user2', 100);
      testContract.processPayment('user3', 100);
      
      expect(testContract.status).toBe('COMPLETED');
    });

    it('deve falhar com valor incorreto', () => {
      expect(() => {
        contract.processPayment('user1', 50);
      }).toThrow('Valor do pagamento não confere com a participação');
    });

    it('deve falhar com participação não confirmada', () => {
      // Resetar para PENDING sem confirmar
      contract.participants[0].status = 'PENDING';
      
      expect(() => {
        contract.processPayment('user1', 100);
      }).toThrow('Participação deve estar confirmada para processar pagamento');
    });
  });

  describe('cancelParticipation', () => {
    it('deve cancelar participação', () => {
      const result = contract.cancelParticipation('user1');
      
      expect(result).toBe(true);
      expect(contract.participants[0].status).toBe('CANCELLED');
    });

    it('deve falhar ao cancelar participação já paga', () => {
      // Resetar e processar pagamento
      contract.participants[0].status = 'PENDING';
      contract.confirmParticipation('user1');
      contract.processPayment('user1', 100);
      
      expect(() => {
        contract.cancelParticipation('user1');
      }).toThrow('Não é possível cancelar participação já paga');
    });
  });

  describe('getContractStatus', () => {
    it('deve retornar status correto do contrato', () => {
      // Criar um novo contrato para este teste
      const testContract = new PaymentContract(
        'test-contract',
        300,
        [
          { userId: 'user1', amount: 100 },
          { userId: 'user2', amount: 100 },
          { userId: 'user3', amount: 100 }
        ]
      );
      
      const status = testContract.getContractStatus();
      
      expect(status.contractId).toBe('test-contract');
      expect(status.status).toBe('ACTIVE');
      expect(status.totalAmount).toBe(300);
      expect(status.participants.total).toBe(3);
      expect(status.participants.paid).toBe(0);
      expect(status.progress).toBe(0);
    });

    it('deve calcular progresso corretamente', () => {
      // Criar um novo contrato para este teste
      const testContract = new PaymentContract(
        'test-contract',
        300,
        [
          { userId: 'user1', amount: 100 },
          { userId: 'user2', amount: 100 },
          { userId: 'user3', amount: 100 }
        ]
      );
      
      // Confirmar e processar pagamento (resetar status primeiro)
      testContract.participants[0].status = 'PENDING';
      testContract.confirmParticipation('user1');
      testContract.processPayment('user1', 100);
      
      const status = testContract.getContractStatus();
      
      expect(status.participants.paid).toBe(1);
      expect(status.progress).toBeCloseTo(33.33, 1);
    });
  });

  describe('validateContract', () => {
    it('deve validar contrato com valores corretos', () => {
      // Criar um novo contrato para este teste
      const testContract = new PaymentContract(
        'test-contract',
        300,
        [
          { userId: 'user1', amount: 100 },
          { userId: 'user2', amount: 100 },
          { userId: 'user3', amount: 100 }
        ]
      );
      
      const validation = testContract.validateContract();
      
      expect(validation.isValid).toBe(true);
      expect(validation.totalAmount).toBe(300);
      expect(validation.totalParticipations).toBe(300);
      expect(validation.difference).toBe(0);
    });

    it('deve detectar valores incorretos', () => {
      // Criar um novo contrato para este teste
      const testContract = new PaymentContract(
        'test-contract',
        300,
        [
          { userId: 'user1', amount: 50 }, // Valor incorreto
          { userId: 'user2', amount: 100 },
          { userId: 'user3', amount: 100 }
        ]
      );
      
      const validation = testContract.validateContract();
      
      expect(validation.isValid).toBe(false);
      expect(validation.difference).toBe(50);
    });
  });

  describe('completeContract', () => {
    it('deve finalizar contrato ativo', () => {
      const result = contract.completeContract();
      
      expect(result).toBe(true);
      expect(contract.status).toBe('COMPLETED');
    });

    it('deve falhar ao finalizar contrato inativo', () => {
      contract.status = 'CANCELLED';
      
      expect(() => {
        contract.completeContract();
      }).toThrow('Contrato não está ativo');
    });
  });

  describe('cancelContract', () => {
    it('deve cancelar contrato ativo', () => {
      const result = contract.cancelContract();
      
      expect(result).toBe(true);
      expect(contract.status).toBe('CANCELLED');
    });

    it('deve falhar ao cancelar contrato inativo', () => {
      contract.status = 'COMPLETED';
      
      expect(() => {
        contract.cancelContract();
      }).toThrow('Contrato não está ativo');
    });
  });
});
