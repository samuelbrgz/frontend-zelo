# 🚀 Zelo Backend

Backend em Rust para a aplicação Zelo, uma plataforma de carteira digital compartilhada.

## 🛠️ Tecnologias

- **Rust** - Linguagem de programação
- **Axum** - Framework web moderno e performático
- **Tokio** - Runtime assíncrono
- **Serde** - Serialização/deserialização JSON
- **Tower** - Middleware HTTP
- **CORS** - Suporte completo para frontend

## 📁 Estrutura do Projeto

```
src/
├── models/          # Modelos de dados e estruturas
│   ├── user.rs      # Usuário e autenticação
│   ├── wallet.rs    # Carteira compartilhada
│   ├── balance.rs   # Saldos de ativos
│   ├── transaction.rs # Transações
│   └── api.rs       # Respostas e erros da API
├── services/        # Lógica de negócio
│   ├── auth.rs      # Autenticação
│   ├── wallet.rs    # Gerenciamento de carteiras
│   ├── transaction.rs # Gerenciamento de transações
│   └── mock_data.rs # Dados simulados para teste
├── routes/          # Endpoints da API
│   ├── auth.rs      # Rotas de autenticação
│   ├── wallet.rs    # Rotas de carteira
│   ├── transaction.rs # Rotas de transações
│   └── health.rs    # Health check
├── config/          # Configuração da aplicação
│   └── app.rs       # Configuração principal e CORS
└── main.rs          # Ponto de entrada
```

## 🚀 Como Executar

### Pré-requisitos

- Rust 1.70+ instalado
- Cargo (gerenciador de pacotes do Rust)

### Instalação

1. Clone o repositório:
```bash
git clone <url-do-repositorio>
cd zelo-backend
```

2. Instale as dependências:
```bash
cargo build
```

3. Execute o servidor:
```bash
cargo run
```

O servidor estará rodando em `http://localhost:3001`

## 🔗 Endpoints da API

### Autenticação
- `POST /api/auth/login` - Login de usuário

### Carteira
- `GET /api/wallet` - Obter carteira do usuário
- `POST /api/wallet/create` - Criar nova carteira
- `GET /api/wallet/balances` - Obter saldos
- `GET /api/wallet/members` - Obter membros
- `POST /api/wallet/members` - Adicionar membro

### Transações
- `GET /api/transactions` - Listar transações
- `GET /api/transactions/:id` - Obter transação específica
- `POST /api/transactions` - Criar nova transação
- `PUT /api/transactions/:id/status` - Atualizar status

### Sistema
- `GET /api/health` - Health check

## 🔐 Autenticação

A API usa autenticação baseada em token JWT (simulado). Inclua o header:

```
Authorization: Bearer <seu_token>
```

### Credenciais de Teste

- **Email:** `demo@zelo.com` | **Senha:** `demo123`
- **Email:** `joao@zelo.com` | **Senha:** `demo123`

## 📊 Dados Mock

O backend inclui dados simulados para teste imediato:

- Usuários pré-cadastrados
- Carteira com saldos em XLM, USDC e BTC
- Transações de exemplo (envio, recebimento, swap)
- Membros da carteira

## 🌐 CORS

CORS está configurado para permitir:
- **Origem:** Qualquer (`*`)
- **Métodos:** GET, POST, PUT, DELETE
- **Headers:** Todos os headers

## 🔧 Desenvolvimento

### Adicionar Nova Rota

1. Crie o handler em `src/routes/`
2. Adicione a rota no módulo correspondente
3. Registre no router principal em `src/config/app.rs`

### Adicionar Novo Serviço

1. Crie o serviço em `src/services/`
2. Implemente a lógica de negócio
3. Use dados mock para teste

### Adicionar Novo Modelo

1. Crie o modelo em `src/models/`
2. Implemente Serialize/Deserialize
3. Adicione ao módulo principal

## 🚀 Deploy

### Produção

1. Compile para release:
```bash
cargo build --release
```

2. Execute o binário:
```bash
./target/release/zelo-backend
```

### Docker (Futuro)

```dockerfile
FROM rust:1.70 as builder
WORKDIR /usr/src/app
COPY . .
RUN cargo build --release

FROM debian:bullseye-slim
COPY --from=builder /usr/src/app/target/release/zelo-backend /usr/local/bin/
EXPOSE 3001
CMD ["zelo-backend"]
```

## 📝 Logs

Logs são exibidos no console com diferentes níveis:
- `info` - Informações gerais
- `debug` - Detalhes de debug
- `warn` - Avisos
- `error` - Erros

Configure com variável de ambiente:
```bash
export RUST_LOG=debug
```

## 🔮 Próximos Passos

- [ ] Integração com banco de dados (PostgreSQL)
- [ ] Autenticação JWT real
- [ ] Cache Redis
- [ ] Documentação OpenAPI/Swagger
- [ ] Testes automatizados
- [ ] CI/CD pipeline
- [ ] Monitoramento e métricas
- [ ] Rate limiting
- [ ] Validação de entrada
- [ ] Logs estruturados

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT.

## 📞 Suporte

<<<<<<< HEAD
Para dúvidas ou problemas, abra uma issue no repositório.
=======
- **Stellar Development Foundation** pelo ecossistema blockchain
- **Next.js Team** pelo framework React incrível
- **Tailwind CSS** pelos estilos utilitários
- **Comunidade Open Source** por todas as contribuições

---

**Zelo** - Revolucionando as carteiras compartilhadas no ecossistema Stellar 🚀
>>>>>>> 137eec1b63bc943fac5cce797d0d933be895d505
