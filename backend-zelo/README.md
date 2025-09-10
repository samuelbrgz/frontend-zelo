# 🚀 Backend Zelo

Backend para sistema de carteira digital com contratos de pagamento compartilhado, desenvolvido com Node.js, Express, PostgreSQL e Prisma.

## 📋 Índice

- [Características](#-características)
- [Tecnologias](#-tecnologias)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Instalação](#-instalação)
- [Configuração](#-configuração)
- [Uso](#-uso)
- [API Endpoints](#-api-endpoints)
- [Smart Contracts](#-smart-contracts)
- [Testes](#-testes)
- [Docker](#-docker)
- [Documentação da API](#-documentação-da-api)
- [Contribuição](#-contribuição)
- [Licença](#-licença)

## ✨ Características

- 🔐 **Autenticação JWT** com refresh tokens
- 💰 **Sistema de Carteiras** com controle de saldo
- 💳 **Transações** (depósito, saque, transferência, pagamento compartilhado)
- 🤝 **Contratos Compartilhados** para divisão de despesas
- 🔒 **Smart Contracts Simulados** para pagamentos compartilhados
- 📊 **API REST** completa com documentação Swagger
- 🐳 **Docker** e Docker Compose para desenvolvimento
- 🧪 **Testes Unitários** e de integração
- 🛡️ **Segurança** com rate limiting, CORS e validações
- 📈 **Monitoramento** com health checks

## 🛠️ Tecnologias

- **Node.js** 18+
- **Express.js** - Framework web
- **PostgreSQL** - Banco de dados
- **Prisma** - ORM
- **JWT** - Autenticação
- **Jest** - Testes
- **Docker** - Containerização
- **Swagger** - Documentação da API

## 📁 Estrutura do Projeto

```
backend-zelo/
├── src/
│   ├── controllers/          # Controladores da API
│   ├── services/            # Lógica de negócio
│   ├── models/              # Modelos de dados (Prisma)
│   ├── routes/              # Rotas da API
│   ├── middleware/          # Middlewares (auth, validation, error)
│   ├── config/              # Configurações (DB, Swagger)
│   ├── contracts/           # Smart contracts simulados
│   ├── mocks/               # Dados mock para testes
│   └── __tests__/           # Testes unitários e integração
├── prisma/
│   └── schema.prisma        # Schema do banco de dados
├── scripts/                 # Scripts de inicialização
├── init-scripts/            # Scripts de inicialização do PostgreSQL
├── docker-compose.yml       # Configuração Docker Compose
├── Dockerfile              # Configuração Docker
└── README.md               # Este arquivo
```

## 🚀 Instalação

### Pré-requisitos

- Node.js 18+
- PostgreSQL 15+
- Docker (opcional)

### Instalação Local

1. **Clone o repositório**
```bash
git clone <repository-url>
cd backend-zelo
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**
```bash
cp env.example .env
# Edite o arquivo .env com suas configurações
```

4. **Configure o banco de dados**
```bash
# Gere o cliente Prisma
npx prisma generate

# Execute as migrations
npx prisma migrate dev --name init

# Execute o seed (dados iniciais)
npm run db:seed
```

5. **Inicie o servidor**
```bash
npm run dev
```

### Instalação com Docker

1. **Clone e configure**
```bash
git clone <repository-url>
cd backend-zelo
cp env.example .env
```

2. **Inicie com Docker Compose**
```bash
# Usando o script automatizado
chmod +x scripts/docker-start.sh
./scripts/docker-start.sh

# Ou manualmente
docker-compose up --build -d
```

## ⚙️ Configuração

### Variáveis de Ambiente

Crie um arquivo `.env` baseado no `env.example`:

```env
# Database
DATABASE_URL="postgresql://zelo_user:zelo_password@localhost:5432/zelo_db?schema=public"

# JWT
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_EXPIRES_IN="24h"
JWT_REFRESH_EXPIRES_IN="7d"

# Server
PORT=4000
NODE_ENV="development"

# CORS
FRONTEND_URL="http://localhost:3000"

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Banco de Dados

O sistema usa PostgreSQL com Prisma ORM. As tabelas são criadas automaticamente através das migrations.

**Entidades principais:**
- `User` - Usuários do sistema
- `Wallet` - Carteiras digitais
- `Transaction` - Transações financeiras
- `SharedContract` - Contratos de pagamento compartilhado
- `SharedContractParticipant` - Participantes dos contratos

## 🎯 Uso

### Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev          # Inicia com nodemon

# Produção
npm start           # Inicia servidor

# Banco de dados
npm run db:migrate  # Executa migrations
npm run db:generate # Gera cliente Prisma
npm run db:seed     # Executa seed
npm run db:studio   # Abre Prisma Studio

# Testes
npm test            # Executa testes
npm run test:watch  # Executa testes em modo watch
```

### Endpoints Principais

- **Base URL:** `http://localhost:4000`
- **Documentação:** `http://localhost:4000/api-docs`
- **Health Check:** `http://localhost:4000/health`

## 📡 API Endpoints

### Autenticação (`/api/auth`)
- `POST /register` - Registrar usuário
- `POST /login` - Fazer login
- `POST /refresh` - Renovar token
- `POST /logout` - Fazer logout
- `GET /me` - Dados do usuário logado

### Carteiras (`/api/wallets`)
- `POST /` - Criar carteira
- `GET /my` - Minha carteira
- `GET /:id` - Carteira por ID
- `GET /` - Listar todas as carteiras
- `GET /:id/transactions` - Transações da carteira

### Transações (`/api/transactions`)
- `POST /` - Criar transação
- `GET /:id` - Transação por ID
- `GET /my` - Minhas transações
- `GET /` - Listar todas as transações
- `PUT /:id/status` - Atualizar status
- `POST /:id/cancel` - Cancelar transação

### Contratos Compartilhados (`/api/shared-contracts`)
- `POST /` - Criar contrato
- `GET /:id` - Contrato por ID
- `GET /my` - Meus contratos
- `GET /` - Listar todos os contratos
- `POST /:id/confirm` - Confirmar participação
- `POST /:id/cancel` - Cancelar participação
- `POST /:id/pay` - Processar pagamento
- `POST /:id/complete` - Finalizar contrato

## 🤖 Smart Contracts

O sistema inclui smart contracts simulados para pagamentos compartilhados:

### PaymentContract
- Criação de contratos de pagamento
- Gestão de participantes
- Processamento de pagamentos
- Validação de integridade

### ContractManager
- Gerenciamento do ciclo de vida dos contratos
- Estatísticas e relatórios
- Limpeza de contratos expirados

### Exemplos de Uso

```javascript
const { ContractManager, contractExamples } = require('./src/contracts');

// Criar contrato de jantar
const dinnerContract = contractExamples.createDinnerContract();

// Confirmar participação
ContractManager.confirmParticipation(contractId, userId);

// Processar pagamento
ContractManager.processPayment(contractId, userId, amount);
```

## 🧪 Testes

### Executar Testes

```bash
# Todos os testes
npm test

# Testes em modo watch
npm run test:watch

# Testes com coverage
npm test -- --coverage
```

### Estrutura de Testes

- **Unitários:** `src/__tests__/services/`
- **Integração:** `src/__tests__/integration/`
- **Contratos:** `src/__tests__/contracts/`

### Exemplo de Teste

```javascript
describe('AuthService', () => {
  it('deve registrar um novo usuário', async () => {
    const userData = {
      nome: 'João Silva',
      email: 'joao@zelo.com',
      senha: '123456'
    };

    const result = await authService.register(userData);
    
    expect(result.user.nome).toBe('João Silva');
    expect(result).toHaveProperty('accessToken');
  });
});
```

## 🐳 Docker

### Docker Compose

O projeto inclui configuração completa do Docker Compose:

```yaml
services:
  postgres:    # Banco PostgreSQL
  pgadmin:     # Interface web do banco
  backend:     # Aplicação Node.js
  redis:       # Cache (opcional)
```

### Comandos Docker

```bash
# Iniciar todos os serviços
docker-compose up -d

# Ver logs
docker-compose logs -f

# Parar serviços
docker-compose down

# Resetar banco (cuidado!)
docker-compose down -v
```

### URLs dos Serviços

- **Backend:** http://localhost:4000
- **PgAdmin:** http://localhost:5050
- **PostgreSQL:** localhost:5432
- **Redis:** localhost:6379

## 📚 Documentação da API

A documentação completa da API está disponível via Swagger:

- **URL:** http://localhost:4000/api-docs
- **Formato:** OpenAPI 3.0
- **Recursos:** Testes interativos, schemas, exemplos

### Exemplo de Requisição

```bash
# Registrar usuário
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "João Silva",
    "email": "joao@zelo.com",
    "senha": "123456"
  }'
```

## 🔧 Desenvolvimento

### Estrutura de Código

- **Controllers:** Lógica de apresentação
- **Services:** Lógica de negócio
- **Models:** Definições de dados (Prisma)
- **Routes:** Definição de rotas
- **Middleware:** Interceptadores de requisições

### Padrões Utilizados

- **MVC:** Separação de responsabilidades
- **Repository:** Acesso a dados via Prisma
- **Service Layer:** Lógica de negócio isolada
- **Middleware:** Interceptação de requisições

### Boas Práticas

- Validação de entrada em todas as rotas
- Tratamento de erros centralizado
- Logs estruturados
- Testes unitários e de integração
- Documentação da API
- Segurança com JWT e rate limiting

## 🚀 Deploy

### Produção

1. **Configure variáveis de ambiente**
2. **Execute migrations**
3. **Inicie o servidor**

```bash
# Build da aplicação
npm run build

# Iniciar em produção
npm start
```

### Docker Production

```bash
# Build da imagem
docker build -t zelo-backend .

# Executar container
docker run -p 4000:4000 --env-file .env zelo-backend
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

### Padrões de Commit

```
feat: adiciona nova funcionalidade
fix: corrige bug
docs: atualiza documentação
test: adiciona ou corrige testes
refactor: refatora código
```

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 📞 Suporte

- **Email:** contato@zelo.com
- **Documentação:** http://localhost:4000/api-docs
- **Issues:** [GitHub Issues](https://github.com/zelo/backend/issues)

---

**Desenvolvido com ❤️ pela equipe Zelo**
