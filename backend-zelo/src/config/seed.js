const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  // Limpar dados existentes
  await prisma.sharedContractParticipant.deleteMany();
  await prisma.sharedContract.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.wallet.deleteMany();
  await prisma.user.deleteMany();

  // Criar usuários de exemplo
  const hashedPassword = await bcrypt.hash('123456', 10);

  const user1 = await prisma.user.create({
    data: {
      nome: 'João Silva',
      email: 'joao@zelo.com',
      senha: hashedPassword,
    },
  });

  const user2 = await prisma.user.create({
    data: {
      nome: 'Maria Santos',
      email: 'maria@zelo.com',
      senha: hashedPassword,
    },
  });

  const user3 = await prisma.user.create({
    data: {
      nome: 'Pedro Costa',
      email: 'pedro@zelo.com',
      senha: hashedPassword,
    },
  });

  console.log('✅ Usuários criados:', { user1: user1.email, user2: user2.email, user3: user3.email });

  // Criar carteiras
  const wallet1 = await prisma.wallet.create({
    data: {
      userId: user1.id,
      saldo: 1000.00,
    },
  });

  const wallet2 = await prisma.wallet.create({
    data: {
      userId: user2.id,
      saldo: 500.00,
    },
  });

  const wallet3 = await prisma.wallet.create({
    data: {
      userId: user3.id,
      saldo: 750.00,
    },
  });

  console.log('✅ Carteiras criadas');

  // Criar transações de exemplo
  const transaction1 = await prisma.transaction.create({
    data: {
      walletId: wallet1.id,
      userId: user1.id,
      tipo: 'DEPOSITO',
      valor: 1000.00,
      status: 'COMPLETED',
      descricao: 'Depósito inicial',
    },
  });

  const transaction2 = await prisma.transaction.create({
    data: {
      walletId: wallet2.id,
      userId: user2.id,
      tipo: 'DEPOSITO',
      valor: 500.00,
      status: 'COMPLETED',
      descricao: 'Depósito inicial',
    },
  });

  const transaction3 = await prisma.transaction.create({
    data: {
      walletId: wallet3.id,
      userId: user3.id,
      tipo: 'DEPOSITO',
      valor: 750.00,
      status: 'COMPLETED',
      descricao: 'Depósito inicial',
    },
  });

  console.log('✅ Transações criadas');

  // Criar contrato compartilhado de exemplo
  const sharedContract = await prisma.sharedContract.create({
    data: {
      valorTotal: 300.00,
      status: 'ACTIVE',
      descricao: 'Jantar em grupo - Restaurante XYZ',
      metadata: JSON.stringify({
        local: 'Restaurante XYZ',
        data: '2024-01-15',
        observacoes: 'Divisão igual entre 3 pessoas'
      }),
    },
  });

  // Adicionar participantes ao contrato
  await prisma.sharedContractParticipant.createMany({
    data: [
      {
        sharedContractId: sharedContract.id,
        userId: user1.id,
        valorParticipacao: 100.00,
        status: 'CONFIRMED',
      },
      {
        sharedContractId: sharedContract.id,
        userId: user2.id,
        valorParticipacao: 100.00,
        status: 'PENDING',
      },
      {
        sharedContractId: sharedContract.id,
        userId: user3.id,
        valorParticipacao: 100.00,
        status: 'PENDING',
      },
    ],
  });

  console.log('✅ Contrato compartilhado criado');

  console.log('🎉 Seed concluído com sucesso!');
  console.log('\n📋 Dados criados:');
  console.log('- 3 usuários (joao@zelo.com, maria@zelo.com, pedro@zelo.com)');
  console.log('- Senha padrão: 123456');
  console.log('- 3 carteiras com saldos iniciais');
  console.log('- 3 transações de depósito');
  console.log('- 1 contrato compartilhado ativo');
}

main()
  .catch((e) => {
    console.error('❌ Erro durante o seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
