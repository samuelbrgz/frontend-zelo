/**
 * Módulo de Smart Contracts Simulados
 * Exporta todas as funcionalidades relacionadas a contratos
 */

const PaymentContract = require('./PaymentContract');
const ContractManager = require('./ContractManager');

// Exemplos de uso dos contratos
const contractExamples = {
  /**
   * Exemplo de criação de contrato de jantar
   */
  createDinnerContract: () => {
    const contractData = {
      totalAmount: 300.00,
      description: 'Jantar em grupo - Restaurante XYZ',
      participants: [
        { userId: 'user1', amount: 100.00 },
        { userId: 'user2', amount: 100.00 },
        { userId: 'user3', amount: 100.00 }
      ],
      metadata: {
        local: 'Restaurante XYZ',
        data: '2024-01-15',
        observacoes: 'Divisão igual entre 3 pessoas'
      }
    };

    return ContractManager.createContract(contractData);
  },

  /**
   * Exemplo de criação de contrato de viagem
   */
  createTravelContract: () => {
    const contractData = {
      totalAmount: 1500.00,
      description: 'Viagem para praia - Final de semana',
      participants: [
        { userId: 'user1', amount: 500.00 },
        { userId: 'user2', amount: 500.00 },
        { userId: 'user3', amount: 500.00 }
      ],
      metadata: {
        destino: 'Praia do Forte',
        dataInicio: '2024-02-10',
        dataFim: '2024-02-12',
        hospedagem: 'Pousada do Mar',
        observacoes: 'Inclui hospedagem e alimentação'
      }
    };

    return ContractManager.createContract(contractData);
  },

  /**
   * Exemplo de criação de contrato de presente
   */
  createGiftContract: () => {
    const contractData = {
      totalAmount: 200.00,
      description: 'Presente de aniversário - Maria',
      participants: [
        { userId: 'user1', amount: 50.00 },
        { userId: 'user2', amount: 50.00 },
        { userId: 'user3', amount: 50.00 },
        { userId: 'user4', amount: 50.00 }
      ],
      metadata: {
        aniversariante: 'Maria Silva',
        dataAniversario: '2024-01-20',
        presente: 'Vale-presente da loja X',
        observacoes: 'Presente surpresa'
      }
    };

    return ContractManager.createContract(contractData);
  }
};

// Funções utilitárias
const contractUtils = {
  /**
   * Calcula divisão igual entre participantes
   * @param {number} totalAmount - Valor total
   * @param {number} participantCount - Número de participantes
   * @returns {number} - Valor por participante
   */
  calculateEqualSplit: (totalAmount, participantCount) => {
    return Math.round((totalAmount / participantCount) * 100) / 100;
  },

  /**
   * Valida se um valor é válido para contrato
   * @param {number} value - Valor a ser validado
   * @returns {boolean} - Se o valor é válido
   */
  isValidAmount: (value) => {
    return typeof value === 'number' && value > 0 && !isNaN(value);
  },

  /**
   * Formata valor para exibição
   * @param {number} value - Valor a ser formatado
   * @returns {string} - Valor formatado
   */
  formatCurrency: (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  },

  /**
   * Gera resumo do contrato
   * @param {PaymentContract} contract - Contrato
   * @returns {object} - Resumo do contrato
   */
  generateContractSummary: (contract) => {
    const status = contract.getContractStatus();
    return {
      id: contract.contractId,
      description: contract.description,
      totalAmount: contractUtils.formatCurrency(contract.totalAmount),
      status: status.status,
      progress: `${status.progress.toFixed(1)}%`,
      participants: `${status.participants.paid}/${status.participants.total}`,
      createdAt: contract.createdAt.toLocaleDateString('pt-BR')
    };
  }
};

module.exports = {
  PaymentContract,
  ContractManager,
  contractExamples,
  contractUtils
};
