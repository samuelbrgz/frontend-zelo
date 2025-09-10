const sharedContractService = require('../services/sharedContractService');

class SharedContractController {
  async createSharedContract(req, res) {
    try {
      const { valorTotal, descricao, metadata, participantes } = req.body;

      // Validações básicas
      if (!valorTotal || !participantes || participantes.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Valor total e participantes são obrigatórios'
        });
      }

      if (valorTotal <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Valor total deve ser maior que zero'
        });
      }

      const contract = await sharedContractService.createSharedContract({
        valorTotal: parseFloat(valorTotal),
        descricao,
        metadata,
        participantes
      });

      res.status(201).json({
        success: true,
        message: 'Contrato compartilhado criado com sucesso',
        data: contract
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async getSharedContractById(req, res) {
    try {
      const { contractId } = req.params;

      const contract = await sharedContractService.getSharedContractById(contractId);

      res.json({
        success: true,
        data: contract
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message
      });
    }
  }

  async getMySharedContracts(req, res) {
    try {
      const userId = req.user.id;
      const { page = 1, limit = 10 } = req.query;

      const result = await sharedContractService.getUserSharedContracts(
        userId,
        parseInt(page),
        parseInt(limit)
      );

      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }

  async getAllSharedContracts(req, res) {
    try {
      const { page = 1, limit = 10, status } = req.query;

      const filters = {};
      if (status) filters.status = status;

      const result = await sharedContractService.getAllSharedContracts(
        parseInt(page),
        parseInt(limit),
        filters
      );

      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }

  async confirmParticipation(req, res) {
    try {
      const { contractId } = req.params;
      const userId = req.user.id;

      const participant = await sharedContractService.confirmParticipation(contractId, userId);

      res.json({
        success: true,
        message: 'Participação confirmada com sucesso',
        data: participant
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async cancelParticipation(req, res) {
    try {
      const { contractId } = req.params;
      const userId = req.user.id;

      const participant = await sharedContractService.cancelParticipation(contractId, userId);

      res.json({
        success: true,
        message: 'Participação cancelada com sucesso',
        data: participant
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async processPayment(req, res) {
    try {
      const { contractId } = req.params;
      const userId = req.user.id;

      const participant = await sharedContractService.processPayment(contractId, userId);

      res.json({
        success: true,
        message: 'Pagamento processado com sucesso',
        data: participant
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async completeContract(req, res) {
    try {
      const { contractId } = req.params;

      const contract = await sharedContractService.completeContract(contractId);

      res.json({
        success: true,
        message: 'Contrato finalizado com sucesso',
        data: contract
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async cancelContract(req, res) {
    try {
      const { contractId } = req.params;

      const contract = await sharedContractService.cancelContract(contractId);

      res.json({
        success: true,
        message: 'Contrato cancelado com sucesso',
        data: contract
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = new SharedContractController();
