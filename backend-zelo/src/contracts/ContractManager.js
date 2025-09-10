/**
 * Gerenciador de Smart Contracts Simulados
 * Gerencia o ciclo de vida dos contratos de pagamento compartilhado
 */

const PaymentContract = require('./PaymentContract');

class ContractManager {
  constructor() {
    this.contracts = new Map();
    this.contractCounter = 0;
  }

  /**
   * Cria um novo contrato de pagamento
   * @param {object} contractData - Dados do contrato
   * @returns {PaymentContract} - Contrato criado
   */
  createContract(contractData) {
    const { totalAmount, participants, description, metadata } = contractData;

    // Validar dados
    if (!totalAmount || totalAmount <= 0) {
      throw new Error('Valor total deve ser maior que zero');
    }

    if (!participants || participants.length === 0) {
      throw new Error('Contrato deve ter pelo menos um participante');
    }

    // Validar participantes
    const totalParticipations = participants.reduce((sum, p) => sum + p.amount, 0);
    if (Math.abs(totalParticipations - totalAmount) > 0.01) {
      throw new Error('Soma das participações deve ser igual ao valor total');
    }

    // Gerar ID único
    const contractId = this.generateContractId();
    
    // Criar contrato
    const contract = new PaymentContract(
      contractId,
      totalAmount,
      participants,
      description
    );

    // Adicionar metadados se fornecidos
    if (metadata) {
      contract.setMetadata(metadata);
    }

    // Armazenar contrato
    this.contracts.set(contractId, contract);
    this.contractCounter++;

    return contract;
  }

  /**
   * Obtém um contrato por ID
   * @param {string} contractId - ID do contrato
   * @returns {PaymentContract} - Contrato encontrado
   */
  getContract(contractId) {
    const contract = this.contracts.get(contractId);
    if (!contract) {
      throw new Error('Contrato não encontrado');
    }
    return contract;
  }

  /**
   * Lista todos os contratos
   * @param {object} filters - Filtros opcionais
   * @returns {array} - Lista de contratos
   */
  listContracts(filters = {}) {
    let contracts = Array.from(this.contracts.values());

    // Aplicar filtros
    if (filters.status) {
      contracts = contracts.filter(c => c.status === filters.status);
    }

    if (filters.userId) {
      contracts = contracts.filter(c => 
        c.participants.some(p => p.userId === filters.userId)
      );
    }

    if (filters.dateFrom) {
      const dateFrom = new Date(filters.dateFrom);
      contracts = contracts.filter(c => c.createdAt >= dateFrom);
    }

    if (filters.dateTo) {
      const dateTo = new Date(filters.dateTo);
      contracts = contracts.filter(c => c.createdAt <= dateTo);
    }

    // Ordenar por data de criação (mais recentes primeiro)
    contracts.sort((a, b) => b.createdAt - a.createdAt);

    return contracts;
  }

  /**
   * Atualiza status de um contrato
   * @param {string} contractId - ID do contrato
   * @param {string} status - Novo status
   * @returns {PaymentContract} - Contrato atualizado
   */
  updateContractStatus(contractId, status) {
    const contract = this.getContract(contractId);
    
    const validStatuses = ['ACTIVE', 'COMPLETED', 'CANCELLED', 'EXPIRED'];
    if (!validStatuses.includes(status)) {
      throw new Error('Status inválido');
    }

    contract.status = status;
    return contract;
  }

  /**
   * Remove um contrato
   * @param {string} contractId - ID do contrato
   * @returns {boolean} - Sucesso da operação
   */
  deleteContract(contractId) {
    const contract = this.getContract(contractId);
    
    if (contract.status === 'ACTIVE') {
      throw new Error('Não é possível remover contrato ativo');
    }

    return this.contracts.delete(contractId);
  }

  /**
   * Obtém estatísticas dos contratos
   * @returns {object} - Estatísticas
   */
  getStatistics() {
    const contracts = Array.from(this.contracts.values());
    
    const stats = {
      total: contracts.length,
      active: contracts.filter(c => c.status === 'ACTIVE').length,
      completed: contracts.filter(c => c.status === 'COMPLETED').length,
      cancelled: contracts.filter(c => c.status === 'CANCELLED').length,
      expired: contracts.filter(c => c.status === 'EXPIRED').length,
      totalVolume: contracts.reduce((sum, c) => sum + c.totalAmount, 0),
      averageContractValue: 0,
      totalParticipants: 0
    };

    if (stats.total > 0) {
      stats.averageContractValue = stats.totalVolume / stats.total;
      stats.totalParticipants = contracts.reduce((sum, c) => sum + c.participants.length, 0);
    }

    return stats;
  }

  /**
   * Processa pagamento em um contrato
   * @param {string} contractId - ID do contrato
   * @param {string} userId - ID do usuário
   * @param {number} amount - Valor do pagamento
   * @returns {object} - Resultado do pagamento
   */
  processPayment(contractId, userId, amount) {
    const contract = this.getContract(contractId);
    return contract.processPayment(userId, amount);
  }

  /**
   * Confirma participação em um contrato
   * @param {string} contractId - ID do contrato
   * @param {string} userId - ID do usuário
   * @returns {boolean} - Sucesso da operação
   */
  confirmParticipation(contractId, userId) {
    const contract = this.getContract(contractId);
    return contract.confirmParticipation(userId);
  }

  /**
   * Cancela participação em um contrato
   * @param {string} contractId - ID do contrato
   * @param {string} userId - ID do usuário
   * @returns {boolean} - Sucesso da operação
   */
  cancelParticipation(contractId, userId) {
    const contract = this.getContract(contractId);
    return contract.cancelParticipation(userId);
  }

  /**
   * Finaliza um contrato
   * @param {string} contractId - ID do contrato
   * @returns {boolean} - Sucesso da operação
   */
  completeContract(contractId) {
    const contract = this.getContract(contractId);
    return contract.completeContract();
  }

  /**
   * Cancela um contrato
   * @param {string} contractId - ID do contrato
   * @returns {boolean} - Sucesso da operação
   */
  cancelContract(contractId) {
    const contract = this.getContract(contractId);
    return contract.cancelContract();
  }

  /**
   * Gera ID único para contrato
   * @returns {string} - ID do contrato
   */
  generateContractId() {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 9);
    return `contract_${timestamp}_${random}`;
  }

  /**
   * Valida integridade de todos os contratos
   * @returns {array} - Lista de contratos com problemas
   */
  validateAllContracts() {
    const issues = [];
    
    for (const [contractId, contract] of this.contracts) {
      const validation = contract.validateContract();
      if (!validation.isValid) {
        issues.push({
          contractId,
          issue: 'Valor total não confere com participações',
          details: validation
        });
      }
    }

    return issues;
  }

  /**
   * Limpa contratos expirados
   * @param {number} maxAge - Idade máxima em milissegundos
   * @returns {number} - Número de contratos removidos
   */
  cleanupExpiredContracts(maxAge = 30 * 24 * 60 * 60 * 1000) { // 30 dias
    const now = new Date();
    let removed = 0;

    for (const [contractId, contract] of this.contracts) {
      const age = now - contract.createdAt;
      if (age > maxAge && contract.status === 'ACTIVE') {
        contract.status = 'EXPIRED';
        removed++;
      }
    }

    return removed;
  }
}

// Instância singleton do gerenciador
const contractManager = new ContractManager();

module.exports = contractManager;
