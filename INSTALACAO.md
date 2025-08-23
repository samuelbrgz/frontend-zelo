# 🚀 Guia de Instalação - Zelo Frontend

## 📋 Pré-requisitos

Antes de executar a aplicação Zelo, você precisa ter instalado:

### 1. Node.js (versão 18 ou superior)
- **Windows**: Baixe e instale do [site oficial](https://nodejs.org/)
- **macOS**: Use o Homebrew: `brew install node`
- **Linux**: Use o gerenciador de pacotes da sua distribuição

### 2. Verificar a instalação
```bash
node --version
npm --version
```

## 🛠️ Instalação e Execução

### 1. Instalar dependências
```bash
npm install
```

### 2. Executar em modo de desenvolvimento
```bash
npm run dev
```

### 3. Abrir no navegador
```
http://localhost:3000
```

## 🔐 Credenciais de Demo

Para testar a aplicação:
- **Email**: demo@zelo.com
- **Senha**: demo123

## 📱 Funcionalidades Disponíveis

### Landing Page
- ✅ Header responsivo com navegação
- ✅ Hero section com call-to-action
- ✅ Seção de features detalhadas
- ✅ Footer com informações da empresa

### Dashboard (após login)
- ✅ Cards de saldo (XLM, USDC, BTC)
- ✅ Lista de transações recentes
- ✅ Quick actions (enviar, solicitar, adicionar membro)
- ✅ Modal de nova transação
- ✅ Modal para adicionar membros
- ✅ Lista de membros da carteira

## 🎨 Design Implementado

- ✅ Paleta violeta (#8b5cf6, #7c3aed, #a78bfa)
- ✅ Glassmorphism com efeitos de transparência
- ✅ Design responsivo para mobile, tablet e desktop
- ✅ Animações e transições suaves
- ✅ Ícones do Lucide React

## 🏗️ Estrutura Técnica

- ✅ Next.js 14 com App Router
- ✅ TypeScript para tipagem estática
- ✅ Tailwind CSS para estilos
- ✅ Zustand para gerenciamento de estado
- ✅ Componentes modulares e reutilizáveis

## 🚀 Próximos Passos

Após a instalação, você pode:

1. **Personalizar cores** no `tailwind.config.js`
2. **Modificar componentes** na pasta `components/`
3. **Adicionar novas funcionalidades** no dashboard
4. **Integrar com Stellar SDK** para funcionalidades reais
5. **Implementar Soroban smart contracts**

## 🐛 Solução de Problemas

### Erro: "npm não é reconhecido"
- Instale o Node.js do site oficial
- Reinicie o terminal após a instalação

### Erro: "Porta 3000 em uso"
- Use `npm run dev -- -p 3001` para usar outra porta
- Ou feche outros processos usando a porta 3000

### Erro de dependências
- Delete a pasta `node_modules` e `package-lock.json`
- Execute `npm install` novamente

## 📞 Suporte

Se encontrar problemas:
1. Verifique se o Node.js está instalado corretamente
2. Confirme se todas as dependências foram instaladas
3. Verifique se não há erros no console do terminal
4. Abra uma issue no repositório do projeto

---

**Zelo** - Carteira Compartilhada Multi-assinatura 🚀
