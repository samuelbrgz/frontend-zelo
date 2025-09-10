const { prisma } = require('../config/database');
const transactionService = require('./transactionService');

class SharedContractService {
  async createSharedContract(contractData) {
    const { valorTotal, descricao, metadata, participantes } = contractData;

    // Validar participantes
    if (!participantes || participantes.length === 0) {
      throw new Error('Contrato deve ter pelo menos um participante');
    }

    // Verificar se todos os usuários existem
    const userIds = participantes.map(p => p.userId);
    const users = await prisma.user.findMany({
      where: { id: { in: userIds } }
    });

    if (users.length !== userIds.length) {
      throw new Error('Um ou mais usuários não foram encontrados');
    }

    // Calcular valor total dos participantes
    const totalParticipacao = participantes.reduce((sum, p) => sum + parseFloat(p.valorParticipacao), 0);

    if (Math.abs(totalParticipacao - parseFloat(valorTotal)) > 0.01) {
      throw new Error('Soma das participações deve ser igual ao valor total');
    }

    // Criar contrato compartilhado
    const sharedContract = await prisma.sharedContract.create({
      data: {
        valorTotal: parseFloat(valorTotal),
        descricao,
        metadata,
        status: 'ACTIVE'
      }
    });

    // Criar participantes
    const contractParticipants = await Promise.all(
      participantes.map(participante =>
        prisma.sharedContractParticipant.create({
          data: {
            sharedContractId: sharedContract.id,
            userId: participante.userId,
            valorParticipacao: parseFloat(participante.valorParticipacao),
            status: 'PENDING'
          }
        })
      )
    );

    return {
      ...sharedContract,
      participants: contractParticipants
    };
  }

  async getSharedContractById(contractId) {
    const contract = await prisma.sharedContract.findUnique({
      where: { id: contractId },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                nome: true,
                email: true
              }
            }
          }
        }
      }
    });

    if (!contract) {
      throw new Error('Contrato compartilhado não encontrado');
    }

    return contract;
  }

  async getUserSharedContracts(userId, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [contracts, total] = await Promise.all([
      prisma.sharedContract.findMany({
        where: {
          participants: {
            some: { userId }
          }
        },
        include: {
          participants: {
            include: {
              user: {
                select: {
                  id: true,
                  nome: true,
                  email: true
                }
              }
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.sharedContract.count({
        where: {
          participants: {
            some: { userId }
          }
        }
      })
    ]);

    return {
      contracts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  async getAllSharedContracts(page = 1, limit = 10, filters = {}) {
    const skip = (page - 1) * limit;
    const where = {};

    if (filters.status) {
      where.status = filters.status;
    }

    const [contracts, total] = await Promise.all([
      prisma.sharedContract.findMany({
        where,
        include: {
          participants: {
            include: {
              user: {
                select: {
                  id: true,
                  nome: true,
                  email: true
                }
              }
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.sharedContract.count({ where })
    ]);

    return {
      contracts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  async confirmParticipation(contractId, userId) {
    const participant = await prisma.sharedContractParticipant.findFirst({
      where: {
        sharedContractId: contractId,
        userId
      }
    });

    if (!participant) {
      throw new Error('Participante não encontrado neste contrato');
    }

    if (participant.status !== 'PENDING') {
      throw new Error('Participação já foi confirmada ou cancelada');
    }

    const updatedParticipant = await prisma.sharedContractParticipant.update({
      where: { id: participant.id },
      data: { status: 'CONFIRMED' },
      include: {
        user: {
          select: {
            id: true,
            nome: true,
            email: true
          }
        }
      }
    });

    return updatedParticipant;
  }

  async cancelParticipation(contractId, userId) {
    const participant = await prisma.sharedContractParticipant.findFirst({
      where: {
        sharedContractId: contractId,
        userId
      }
    });

    if (!participant) {
      throw new Error('Participante não encontrado neste contrato');
    }

    if (participant.status === 'PAID') {
      throw new Error('Não é possível cancelar participação já paga');
    }

    const updatedParticipant = await prisma.sharedContractParticipant.update({
      where: { id: participant.id },
      data: { status: 'CANCELLED' },
      include: {
        user: {
          select: {
            id: true,
            nome: true,
            email: true
          }
        }
      }
    });

    return updatedParticipant;
  }

  async processPayment(contractId, userId) {
    const participant = await prisma.sharedContractParticipant.findFirst({
      where: {
        sharedContractId: contractId,
        userId
      }
    });

    if (!participant) {
      throw new Error('Participante não encontrado neste contrato');
    }

    if (participant.status !== 'CONFIRMED') {
      throw new Error('Participação deve estar confirmada para processar pagamento');
    }

    // Buscar carteira do usuário
    const wallet = await prisma.wallet.findFirst({
      where: { userId }
    });

    if (!wallet) {
      throw new Error('Carteira não encontrada');
    }

    // Verificar saldo
    if (wallet.saldo < participant.valorParticipacao) {
      throw new Error('Saldo insuficiente para pagamento');
    }

    // Processar pagamento
    await transactionService.createTransaction({
      walletId: wallet.id,
      userId,
      tipo: 'PAGAMENTO_COMPARTILHADO',
      valor: participant.valorParticipacao,
      descricao: `Pagamento contrato compartilhado - ${contractId}`,
      metadata: {
        contractId,
        contractParticipantId: participant.id
      }
    });

    // Atualizar status da participação
    const updatedParticipant = await prisma.sharedContractParticipant.update({
      where: { id: participant.id },
      data: { status: 'PAID' },
      include: {
        user: {
          select: {
            id: true,
            nome: true,
            email: true
          }
        }
      }
    });

    // Verificar se todos os participantes pagaram
    const allParticipants = await prisma.sharedContractParticipant.findMany({
      where: { sharedContractId: contractId }
    });

    const allPaid = allParticipants.every(p => p.status === 'PAID');

    if (allPaid) {
      await prisma.sharedContract.update({
        where: { id: contractId },
        data: { status: 'COMPLETED' }
      });
    }

    return updatedParticipant;
  }

  async completeContract(contractId) {
    const contract = await this.getSharedContractById(contractId);

    if (contract.status !== 'ACTIVE') {
      throw new Error('Contrato não está ativo');
    }

    const updatedContract = await prisma.sharedContract.update({
      where: { id: contractId },
      data: { status: 'COMPLETED' },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                nome: true,
                email: true
              }
            }
          }
        }
      }
    });

    return updatedContract;
  }

  async cancelContract(contractId) {
    const contract = await this.getSharedContractById(contractId);

    if (contract.status !== 'ACTIVE') {
      throw new Error('Contrato não está ativo');
    }

    const updatedContract = await prisma.sharedContract.update({
      where: { id: contractId },
      data: { status: 'CANCELLED' },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                nome: true,
                email: true
              }
            }
          }
        }
      }
    });

    return updatedContract;
  }
}

module.exports = new SharedContractService();
