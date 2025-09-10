-- Script de inicialização do banco de dados
-- Este script é executado automaticamente quando o container PostgreSQL é criado

-- Criar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Criar schema se não existir
CREATE SCHEMA IF NOT EXISTS public;

-- Configurar timezone
SET timezone = 'America/Sao_Paulo';

-- Comentários para documentação
COMMENT ON DATABASE zelo_db IS 'Banco de dados do sistema Zelo - Carteira Digital com Contratos Compartilhados';
