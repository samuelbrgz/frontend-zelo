#!/bin/bash

# Script para iniciar o backend Zelo
echo "🚀 Iniciando Backend Zelo..."

# Verificar se o arquivo .env existe
if [ ! -f .env ]; then
    echo "⚠️  Arquivo .env não encontrado. Copiando do exemplo..."
    cp env.example .env
    echo "✅ Arquivo .env criado. Configure as variáveis de ambiente conforme necessário."
fi

# Instalar dependências se node_modules não existir
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependências..."
    npm install
fi

# Gerar cliente Prisma
echo "🔧 Gerando cliente Prisma..."
npx prisma generate

# Executar migrations
echo "🗄️  Executando migrations do banco de dados..."
npx prisma migrate dev --name init

# Executar seed se necessário
echo "🌱 Executando seed do banco de dados..."
npm run db:seed

echo "✅ Backend Zelo iniciado com sucesso!"
echo "📍 Servidor rodando em: http://localhost:4000"
echo "📚 Documentação: http://localhost:4000/api-docs"
echo "🏥 Health Check: http://localhost:4000/health"

# Iniciar o servidor
npm run dev
