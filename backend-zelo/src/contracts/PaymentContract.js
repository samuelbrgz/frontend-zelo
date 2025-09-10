/**
 * Smart Contract Simulado para Pagamentos Compartilhados
 * Este é um simulador de smart contract que implementa a lógica de pagamentos compartilhados
 */

class PaymentContract {
  constructor(contractId, totalAmount, participants, description = '') {
    this.contractId = contractId;
    this.totalAmount = totalAmount;
    this.participants = participants;
    this.description = description;
    this.status = 'ACTIVE'; // ACTIVE, COMPLETED, CANCELLED, EXPIRED
    this.createdAt = new Date();
    this.payments = new Map(); // userId -> { amount, status, timestamp }
    this.metadata = {};
  }

  /**
   * Adiciona um participante ao contrato
   * @param {string} userId - ID do usuário
   * @param {number} amount - Valor da participação
   * @returns {boolean} - Sucesso da operação
   */
  addParticipant(userId, amount) {
    if (this.status !== 'ACTIVE') {
      throw new Error('Contrato não está ativo');
    }

    if (this.participants.find(p => p.userId === userId)) {
      throw new Error('Usuário já é participante do contrato');
    }

    this.participants.push({ userId, amount, status: 'PENDING' });
    return true;
  }

  /**
   * Confirma participação de um usuário
   * @param {string} userId - ID do usuário
   * @returns {boolean} - Sucesso da operação
   */
  confirmParticipation(userId) {
    const participant = this.participants.find(p => p.userId === userId);
    if (!participant) {
      throw new Error('Usuário não é participante do contrato');
    }

    if (participant.status !== 'PENDING') {
      throw new Error('Participação já foi confirmada ou cancelada');
    }

    participant.status = 'CONFIRMED';
    return true;
  }

  /**
   * Processa pagamento de um participante
   * @param {string} userId - ID do usuário
   * @param {number} amount - Valor do pagamento
   * @returns {object} - Resultado do pagamento
   */
  processPayment(userId, amount) {
    const participant = this.participants.find(p => p.userId === userId);
    if (!participant) {
      throw new Error('Usuário não é participante do contrato');
    }

    if (participant.status !== 'CONFIRMED') {
      throw new Error('Participação deve estar confirmada para processar pagamento');
    }

    if (Math.abs(amount - participant.amount) > 0.01) {
      throw new Error('Valor do pagamento não confere com a participação');
    }

    // Simular processamento do pagamento
    const paymentResult = {
      transactionId: this.generateTransactionId(),
      userId,
      amount,
      status: 'COMPLETED',
      timestamp: new Date(),
      gasUsed: this.calculateGasFee(amount),
      blockNumber: this.simulateBlockNumber()
    };

    this.payments.set(userId, paymentResult);
    participant.status = 'PAID';

    // Verificar se todos pagaram
    if (this.allParticipantsPaid()) {
      this.status = 'COMPLETED';
    }

    return paymentResult;
  }

  /**
   * Cancela participação de um usuário
   * @param {string} userId - ID do usuário
   * @returns {boolean} - Sucesso da operação
   */
  cancelParticipation(userId) {
    const participant = this.participants.find(p => p.userId === userId);
    if (!participant) {
      throw new Error('Usuário não é participante do contrato');
    }

    if (participant.status === 'PAID') {
      throw new Error('Não é possível cancelar participação já paga');
    }

    participant.status = 'CANCELLED';
    return true;
  }

  /**
   * Finaliza o contrato manualmente
   * @returns {boolean} - Sucesso da operação
   */
  completeContract() {
    if (this.status !== 'ACTIVE') {
      throw new Error('Contrato não está ativo');
    }

    this.status = 'COMPLETED';
    return true;
  }

  /**
   * Cancela o contrato
   * @returns {boolean} - Sucesso da operação
   */
  cancelContract() {
    if (this.status !== 'ACTIVE') {
      throw new Error('Contrato não está ativo');
    }

    this.status = 'CANCELLED';
    return true;
  }

  /**
   * Verifica se todos os participantes pagaram
   * @returns {boolean} - Todos pagaram
   */
  allParticipantsPaid() {
    return this.participants.every(p => p.status === 'PAID');
  }

  /**
   * Obtém status do contrato
   * @returns {object} - Status detalhado
   */
  getContractStatus() {
    const paidParticipants = this.participants.filter(p => p.status === 'PAID').length;
    const totalParticipants = this.participants.length;
    const totalPaid = this.participants
      .filter(p => p.status === 'PAID')
      .reduce((sum, p) => sum + p.amount, 0);

    return {
      contractId: this.contractId,
      status: this.status,
      totalAmount: this.totalAmount,
      totalPaid,
      participants: {
        total: totalParticipants,
        paid: paidParticipants,
        pending: totalParticipants - paidParticipants
      },
      progress: totalParticipants > 0 ? (paidParticipants / totalParticipants) * 100 : 0,
      createdAt: this.createdAt,
      description: this.description
    };
  }

  /**
   * Obtém histórico de pagamentos
   * @returns {array} - Lista de pagamentos
   */
  getPaymentHistory() {
    return Array.from(this.payments.values());
  }

  /**
   * Valida integridade do contrato
   * @returns {object} - Resultado da validação
   */
  validateContract() {
    const totalParticipations = this.participants.reduce((sum, p) => sum + p.amount, 0);
    const isValid = Math.abs(totalParticipations - this.totalAmount) < 0.01;

    return {
      isValid,
      totalAmount: this.totalAmount,
      totalParticipations,
      difference: Math.abs(totalParticipations - this.totalAmount),
      participants: this.participants.length
    };
  }

  /**
   * Gera ID de transação simulado
   * @returns {string} - ID da transação
   */
  generateTransactionId() {
    return `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Calcula taxa de gas simulada
   * @param {number} amount - Valor da transação
   * @returns {number} - Taxa de gas
   */
  calculateGasFee(amount) {
    // Simulação de taxa de gas baseada no valor
    return Math.max(0.001, amount * 0.001);
  }

  /**
   * Simula número do bloco
   * @returns {number} - Número do bloco
   */
  simulateBlockNumber() {
    return Math.floor(Math.random() * 1000000) + 18000000;
  }

  /**
   * Adiciona metadados ao contrato
   * @param {object} metadata - Metadados
   */
  setMetadata(metadata) {
    this.metadata = { ...this.metadata, ...metadata };
  }

  /**
   * Obtém metadados do contrato
   * @returns {object} - Metadados
   */
  getMetadata() {
    return this.metadata;
  }
}

module.exports = PaymentContract;
