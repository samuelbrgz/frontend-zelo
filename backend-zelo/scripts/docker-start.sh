#!/bin/bash

# Script para iniciar o backend Zelo com Docker
echo "🐳 Iniciando Backend Zelo com Docker..."

# Verificar se o arquivo .env existe
if [ ! -f .env ]; then
    echo "⚠️  Arquivo .env não encontrado. Copiando do exemplo..."
    cp env.example .env
    echo "✅ Arquivo .env criado. Configure as variáveis de ambiente conforme necessário."
fi

# Parar containers existentes
echo "🛑 Parando containers existentes..."
docker-compose down

# Remover volumes se necessário (descomente a linha abaixo para resetar o banco)
# docker-compose down -v

# Construir e iniciar containers
echo "🔨 Construindo e iniciando containers..."
docker-compose up --build -d

# Aguardar o banco estar pronto
echo "⏳ Aguardando banco de dados estar pronto..."
sleep 10

# Executar migrations
echo "🗄️  Executando migrations..."
docker-compose exec backend npx prisma migrate dev --name init

# Executar seed
echo "🌱 Executando seed do banco de dados..."
docker-compose exec backend npm run db:seed

echo "✅ Backend Zelo iniciado com sucesso!"
echo "📍 Servidor: http://localhost:4000"
echo "📚 Documentação: http://localhost:4000/api-docs"
echo "🏥 Health Check: http://localhost:4000/health"
echo "🗄️  PgAdmin: http://localhost:5050"
echo "📊 Redis: localhost:6379"

# Mostrar logs
echo "📋 Logs dos containers:"
docker-compose logs -f
