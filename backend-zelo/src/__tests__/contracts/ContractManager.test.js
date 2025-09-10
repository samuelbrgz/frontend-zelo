const ContractManager = require('../../contracts/ContractManager');

describe('ContractManager', () => {
  beforeEach(() => {
    // Limpar contratos antes de cada teste
    ContractManager.contracts.clear();
    ContractManager.contractCounter = 0;
  });

  describe('createContract', () => {
    it('deve criar contrato com dados válidos', () => {
      const contractData = {
        totalAmount: 300,
        participants: [
          { userId: 'user1', amount: 100 },
          { userId: 'user2', amount: 100 },
          { userId: 'user3', amount: 100 }
        ],
        description: 'Jantar em grupo'
      };

      const contract = ContractManager.createContract(contractData);

      expect(contract.contractId).toMatch(/^contract_/);
      expect(contract.totalAmount).toBe(300);
      expect(contract.participants).toHaveLength(3);
      expect(contract.status).toBe('ACTIVE');
      expect(ContractManager.contracts.size).toBe(1);
    });

    it('deve falhar com valor total inválido', () => {
      const contractData = {
        totalAmount: 0,
        participants: [{ userId: 'user1', amount: 100 }]
      };

      expect(() => {
        ContractManager.createContract(contractData);
      }).toThrow('Valor total deve ser maior que zero');
    });

    it('deve falhar sem participantes', () => {
      const contractData = {
        totalAmount: 100,
        participants: []
      };

      expect(() => {
        ContractManager.createContract(contractData);
      }).toThrow('Contrato deve ter pelo menos um participante');
    });

    it('deve falhar com soma de participações incorreta', () => {
      const contractData = {
        totalAmount: 300,
        participants: [
          { userId: 'user1', amount: 100 },
          { userId: 'user2', amount: 100 }
        ]
      };

      expect(() => {
        ContractManager.createContract(contractData);
      }).toThrow('Soma das participações deve ser igual ao valor total');
    });
  });

  describe('getContract', () => {
    it('deve retornar contrato existente', () => {
      const contractData = {
        totalAmount: 200,
        participants: [
          { userId: 'user1', amount: 100 },
          { userId: 'user2', amount: 100 }
        ]
      };

      const createdContract = ContractManager.createContract(contractData);
      const retrievedContract = ContractManager.getContract(createdContract.contractId);

      expect(retrievedContract).toBe(createdContract);
    });

    it('deve falhar com contrato inexistente', () => {
      expect(() => {
        ContractManager.getContract('inexistent-contract');
      }).toThrow('Contrato não encontrado');
    });
  });

  describe('listContracts', () => {
    beforeEach(() => {
      // Criar alguns contratos para teste
      ContractManager.createContract({
        totalAmount: 200,
        participants: [{ userId: 'user1', amount: 200 }],
        description: 'Contrato 1'
      });

      ContractManager.createContract({
        totalAmount: 300,
        participants: [{ userId: 'user2', amount: 300 }],
        description: 'Contrato 2'
      });

      // Finalizar um contrato
      const contracts = Array.from(ContractManager.contracts.values());
      contracts[0].status = 'COMPLETED';
    });

    it('deve listar todos os contratos', () => {
      const contracts = ContractManager.listContracts();

      expect(contracts).toHaveLength(2);
    });

    it('deve filtrar por status', () => {
      const activeContracts = ContractManager.listContracts({ status: 'ACTIVE' });
      const completedContracts = ContractManager.listContracts({ status: 'COMPLETED' });

      expect(activeContracts).toHaveLength(1);
      expect(completedContracts).toHaveLength(1);
    });

    it('deve filtrar por usuário', () => {
      const userContracts = ContractManager.listContracts({ userId: 'user1' });

      expect(userContracts).toHaveLength(1);
      expect(userContracts[0].participants[0].userId).toBe('user1');
    });
  });

  describe('updateContractStatus', () => {
    it('deve atualizar status do contrato', () => {
      const contractData = {
        totalAmount: 100,
        participants: [{ userId: 'user1', amount: 100 }]
      };

      const contract = ContractManager.createContract(contractData);
      const updatedContract = ContractManager.updateContractStatus(contract.contractId, 'COMPLETED');

      expect(updatedContract.status).toBe('COMPLETED');
    });

    it('deve falhar com status inválido', () => {
      const contractData = {
        totalAmount: 100,
        participants: [{ userId: 'user1', amount: 100 }]
      };

      const contract = ContractManager.createContract(contractData);

      expect(() => {
        ContractManager.updateContractStatus(contract.contractId, 'INVALID_STATUS');
      }).toThrow('Status inválido');
    });
  });

  describe('deleteContract', () => {
    it('deve deletar contrato não ativo', () => {
      const contractData = {
        totalAmount: 100,
        participants: [{ userId: 'user1', amount: 100 }]
      };

      const contract = ContractManager.createContract(contractData);
      contract.status = 'COMPLETED';

      const result = ContractManager.deleteContract(contract.contractId);

      expect(result).toBe(true);
      expect(ContractManager.contracts.size).toBe(0);
    });

    it('deve falhar ao deletar contrato ativo', () => {
      const contractData = {
        totalAmount: 100,
        participants: [{ userId: 'user1', amount: 100 }]
      };

      const contract = ContractManager.createContract(contractData);

      expect(() => {
        ContractManager.deleteContract(contract.contractId);
      }).toThrow('Não é possível remover contrato ativo');
    });
  });

  describe('getStatistics', () => {
    beforeEach(() => {
      // Criar contratos para estatísticas
      ContractManager.createContract({
        totalAmount: 200,
        participants: [{ userId: 'user1', amount: 200 }]
      });

      ContractManager.createContract({
        totalAmount: 300,
        participants: [{ userId: 'user2', amount: 300 }]
      });

      // Finalizar um contrato
      const contracts = Array.from(ContractManager.contracts.values());
      contracts[0].status = 'COMPLETED';
    });

    it('deve retornar estatísticas corretas', () => {
      const stats = ContractManager.getStatistics();

      expect(stats.total).toBe(2);
      expect(stats.active).toBe(1);
      expect(stats.completed).toBe(1);
      expect(stats.totalVolume).toBe(500);
      expect(stats.averageContractValue).toBe(250);
      expect(stats.totalParticipants).toBe(2);
    });
  });

  describe('processPayment', () => {
    it('deve processar pagamento', () => {
      const contractData = {
        totalAmount: 100,
        participants: [{ userId: 'user1', amount: 100 }]
      };

      const contract = ContractManager.createContract(contractData);
      // Resetar status e confirmar participação
      contract.participants[0].status = 'PENDING';
      contract.confirmParticipation('user1');

      const result = ContractManager.processPayment(contract.contractId, 'user1', 100);

      expect(result.status).toBe('COMPLETED');
      expect(result.userId).toBe('user1');
      expect(result.amount).toBe(100);
    });
  });

  describe('validateAllContracts', () => {
    it('deve validar todos os contratos', () => {
      // Limpar contratos existentes
      ContractManager.contracts.clear();
      
      ContractManager.createContract({
        totalAmount: 100,
        participants: [{ userId: 'user1', amount: 100 }]
      });

      // Criar contrato com valor incorreto manualmente para não falhar na criação
      const invalidContract = new (require('../../contracts/PaymentContract'))(
        'invalid-contract',
        200,
        [{ userId: 'user2', amount: 150 }] // Valor incorreto
      );
      ContractManager.contracts.set('invalid-contract', invalidContract);

      const issues = ContractManager.validateAllContracts();

      expect(issues).toHaveLength(1);
      expect(issues[0].issue).toBe('Valor total não confere com participações');
    });
  });

  describe('cleanupExpiredContracts', () => {
    it('deve limpar contratos expirados', () => {
      const contractData = {
        totalAmount: 100,
        participants: [{ userId: 'user1', amount: 100 }]
      };

      const contract = ContractManager.createContract(contractData);
      
      // Simular contrato antigo
      contract.createdAt = new Date(Date.now() - 31 * 24 * 60 * 60 * 1000); // 31 dias atrás

      const removed = ContractManager.cleanupExpiredContracts();

      expect(removed).toBe(1);
      expect(contract.status).toBe('EXPIRED');
    });
  });
});
