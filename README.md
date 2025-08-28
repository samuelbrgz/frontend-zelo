# Zelo - Carteira Compartilhada Multi-assinatura

Uma aplicação frontend moderna e elegante para carteiras Web3 compartilhadas no ecossistema Stellar, construída com Next.js 14, TypeScript e Tailwind CSS.

## 🎯 Sobre o Projeto

O **Zelo** é uma plataforma frontend que permite aos usuários gerenciar carteiras de criptomoedas de forma colaborativa e segura. A aplicação oferece uma interface intuitiva para carteiras multi-assinatura, permitindo que equipes, famílias e comunidades gerenciem fundos digitais com transparência total.

### 🌟 Características Principais

- **Multi-assinatura Avançada**: Sistema de aprovação com múltiplas chaves de segurança
- **Gestão Colaborativa**: Interface para gerenciar membros e permissões
- **Ecosistema Stellar**: Integração nativa com Stellar blockchain e Soroban smart contracts
- **Design Moderno**: Interface glassmorphism com paleta violeta personalizada
- **Totalmente Responsivo**: Funciona perfeitamente em desktop, tablet e mobile

## 🛠️ Stack Tecnológica

### Frontend
- **Next.js 14** - Framework React com App Router e SSR
- **TypeScript** - Tipagem estática para código mais seguro
- **Tailwind CSS** - Framework CSS utilitário com configuração personalizada
- **Zustand** - Gerenciamento de estado simples e eficiente
- **Lucide React** - Biblioteca de ícones modernos e consistentes

### Arquitetura
- **App Router** - Nova arquitetura de roteamento do Next.js 14
- **Componentes Modulares** - Estrutura reutilizável e manutenível
- **Estado Centralizado** - Gerenciamento de dados com Zustand
- **TypeScript Strict** - Configuração rigorosa para qualidade de código

## 🎨 Design System

### Paleta de Cores
- **Violeta Principal**: #8b5cf6
- **Violeta Escuro**: #7c3aed  
- **Violeta Claro**: #a78bfa
- **Glassmorphism**: Efeitos de transparência e blur
- **Gradientes**: Transições suaves entre cores

### Componentes
- **Cards Glass**: Efeito de vidro com backdrop-blur
- **Botões**: Estilos primário e secundário com hover effects
- **Inputs**: Campos de formulário com foco e validação
- **Modais**: Overlays elegantes para ações importantes

## 📱 Funcionalidades Implementadas

### Landing Page
- ✅ **Header Responsivo** com navegação e botão de login
- ✅ **Hero Section** com título principal e call-to-action
- ✅ **Seção de Features** detalhando recursos da plataforma
- ✅ **Footer** com links e informações da empresa
- ✅ **Design Responsivo** para todos os dispositivos

### Dashboard (Autenticado)
- ✅ **Header do Dashboard** com menu de usuário e notificações
- ✅ **Cards de Saldo** para diferentes ativos (XLM, USDC, BTC)
- ✅ **Lista de Transações** com histórico detalhado
- ✅ **Quick Actions** para operações rápidas
- ✅ **Modal de Transação** para enviar/solicitar fundos
- ✅ **Modal de Membro** para adicionar novos usuários
- ✅ **Lista de Membros** da carteira compartilhada

### Sistema de Autenticação
- ✅ **Login Modal** com validação de formulário
- ✅ **Conta Demo** para testes (demo@zelo.com / demo123)
- ✅ **Proteção de Rotas** para páginas autenticadas
- ✅ **Logout** com redirecionamento automático

## 🏗️ Estrutura do Projeto

```
zelo-frontend/
├── app/                          # App Router do Next.js 14
│   ├── dashboard/               # Página do dashboard autenticado
│   │   └── page.tsx            # Componente principal do dashboard
│   ├── globals.css              # Estilos globais e Tailwind
│   ├── layout.tsx               # Layout principal da aplicação
│   └── page.tsx                 # Página inicial (landing page)
├── components/                   # Componentes React reutilizáveis
│   ├── dashboard/               # Componentes específicos do dashboard
│   │   ├── DashboardHeader.tsx  # Header com menu de usuário
│   │   ├── BalanceCards.tsx     # Cards de saldo dos ativos
│   │   ├── TransactionList.tsx  # Lista de transações
│   │   ├── QuickActions.tsx     # Ações rápidas
│   │   ├── TransactionModal.tsx # Modal para criar transações
│   │   └── AddMemberModal.tsx   # Modal para adicionar membros
│   ├── Header.tsx               # Header da landing page
│   ├── HeroSection.tsx          # Seção hero principal
│   ├── FeaturesSection.tsx      # Seção de recursos
│   ├── Footer.tsx               # Footer da aplicação
│   └── LoginModal.tsx           # Modal de autenticação
├── store/                        # Gerenciamento de estado
│   └── useStore.ts              # Store Zustand com dados mockados
├── tailwind.config.js            # Configuração do Tailwind CSS
├── next.config.js                # Configuração do Next.js
├── tsconfig.json                 # Configuração do TypeScript
└── package.json                  # Dependências do projeto
```

## 🚀 Como Executar

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn

### Instalação
```bash
# Clone o repositório
git clone <repository-url>
cd zelo-frontend

# Instale as dependências
npm install

# Execute em modo de desenvolvimento
npm run dev

# Abra no navegador
# http://localhost:3000
```

### Credenciais de Demo
- **Email**: demo@zelo.com
- **Senha**: demo123

## 🔮 Próximos Passos

### Integração Backend
- [ ] **Stellar SDK** para operações blockchain reais
- [ ] **Soroban Smart Contracts** para funcionalidades avançadas
- [ ] **API REST** para persistência de dados
- [ ] **WebSocket** para atualizações em tempo real

### Funcionalidades Avançadas
- [ ] **Passkeys** para autenticação biométrica
- [ ] **Hardware Wallets** (Ledger, Trezor)
- [ ] **Sistema de Permissões** granular
- [ ] **Notificações Push** para transações
- [ ] **Analytics** e relatórios detalhados

### Melhorias de UX
- [ ] **Tema Escuro/Claro** alternável
- [ ] **Internacionalização** (i18n) para múltiplos idiomas
- [ ] **PWA** para instalação como app
- [ ] **Offline Support** com service workers

## 🎯 Casos de Uso

### Equipes de Desenvolvimento
- Gerenciar fundos de projetos com aprovação coletiva
- Controle de gastos com transparência total
- Integração com ferramentas de desenvolvimento

### Famílias
- Planejamento financeiro colaborativo
- Educação financeira para crianças
- Controle de gastos domésticos

### Organizações
- Gestão de tesouraria descentralizada
- Controle de orçamentos departamentais
- Auditoria transparente de movimentações

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 🙏 Agradecimentos

- **Stellar Development Foundation** pelo ecossistema blockchain
- **Next.js Team** pelo framework React incrível
- **Tailwind CSS** pelos estilos utilitários
- **Comunidade Open Source** por todas as contribuições

---

**Zelo** - Revolucionando as carteiras compartilhadas no ecossistema Stellar 🚀
