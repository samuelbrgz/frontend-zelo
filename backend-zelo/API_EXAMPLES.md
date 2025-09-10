# 📡 Exemplos de Uso da API Zelo

Este documento contém exemplos práticos de como usar a API do Zelo Backend.

## 🔐 Autenticação

### Registrar Usuário

```bash
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "João Silva",
    "email": "joao@zelo.com",
    "senha": "123456"
  }'
```

**Resposta:**
```json
{
  "success": true,
  "message": "Usuário criado com sucesso",
  "data": {
    "user": {
      "id": "clx1234567890",
      "nome": "João Silva",
      "email": "joao@zelo.com",
      "createdAt": "2024-01-01T00:00:00.000Z"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Fazer Login

```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@zelo.com",
    "senha": "123456"
  }'
```

### Renovar Token

```bash
curl -X POST http://localhost:4000/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }'
```

## 💰 Carteiras

### Obter Minha Carteira

```bash
curl -X GET http://localhost:4000/api/wallets/my \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Resposta:**
```json
{
  "success": true,
  "data": {
    "id": "wallet123",
    "userId": "user123",
    "saldo": 1000.50,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "user": {
      "id": "user123",
      "nome": "João Silva",
      "email": "joao@zelo.com"
    },
    "transactions": [
      {
        "id": "tx123",
        "valor": 100.00,
        "tipo": "DEPOSITO",
        "status": "COMPLETED",
        "createdAt": "2024-01-01T00:00:00.000Z"
      }
    ]
  }
}
```

### Obter Transações da Carteira

```bash
curl -X GET "http://localhost:4000/api/wallets/my/transactions?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## 💳 Transações

### Criar Depósito

```bash
curl -X POST http://localhost:4000/api/transactions \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "walletId": "wallet123",
    "tipo": "DEPOSITO",
    "valor": 100.00,
    "descricao": "Depósito via PIX",
    "metadata": {
      "pixKey": "12345678901"
    }
  }'
```

### Criar Saque

```bash
curl -X POST http://localhost:4000/api/transactions \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "walletId": "wallet123",
    "tipo": "SAQUE",
    "valor": 50.00,
    "descricao": "Saque para dinheiro"
  }'
```

### Listar Minhas Transações

```bash
curl -X GET "http://localhost:4000/api/transactions/my?page=1&limit=10&tipo=DEPOSITO" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Resposta:**
```json
{
  "success": true,
  "data": {
    "transactions": [
      {
        "id": "tx123",
        "walletId": "wallet123",
        "userId": "user123",
        "tipo": "DEPOSITO",
        "valor": 100.00,
        "status": "COMPLETED",
        "descricao": "Depósito via PIX",
        "createdAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 1,
      "pages": 1
    }
  }
}
```

## 🤝 Contratos Compartilhados

### Criar Contrato Compartilhado

```bash
curl -X POST http://localhost:4000/api/shared-contracts \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "valorTotal": 300.00,
    "descricao": "Jantar em grupo - Restaurante XYZ",
    "metadata": {
      "local": "Restaurante XYZ",
      "data": "2024-01-15",
      "observacoes": "Divisão igual entre 3 pessoas"
    },
    "participantes": [
      {
        "userId": "user1",
        "valorParticipacao": 100.00
      },
      {
        "userId": "user2",
        "valorParticipacao": 100.00
      },
      {
        "userId": "user3",
        "valorParticipacao": 100.00
      }
    ]
  }'
```

**Resposta:**
```json
{
  "success": true,
  "message": "Contrato compartilhado criado com sucesso",
  "data": {
    "id": "contract123",
    "valorTotal": 300.00,
    "status": "ACTIVE",
    "descricao": "Jantar em grupo - Restaurante XYZ",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "participants": [
      {
        "id": "participant123",
        "sharedContractId": "contract123",
        "userId": "user1",
        "valorParticipacao": 100.00,
        "status": "PENDING"
      }
    ]
  }
}
```

### Confirmar Participação

```bash
curl -X POST http://localhost:4000/api/shared-contracts/contract123/confirm \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Processar Pagamento

```bash
curl -X POST http://localhost:4000/api/shared-contracts/contract123/pay \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Listar Meus Contratos

```bash
curl -X GET "http://localhost:4000/api/shared-contracts/my?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## 🔍 Filtros e Paginação

### Filtros de Transações

```bash
# Por tipo
curl -X GET "http://localhost:4000/api/transactions/my?tipo=DEPOSITO" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# Por status
curl -X GET "http://localhost:4000/api/transactions/my?status=COMPLETED" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# Por período
curl -X GET "http://localhost:4000/api/transactions/my?dataInicio=2024-01-01&dataFim=2024-01-31" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# Combinando filtros
curl -X GET "http://localhost:4000/api/transactions/my?tipo=DEPOSITO&status=COMPLETED&page=1&limit=5" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Filtros de Contratos

```bash
# Por status
curl -X GET "http://localhost:4000/api/shared-contracts/my?status=ACTIVE" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## 📊 Exemplos com JavaScript/Fetch

### Função para Fazer Login

```javascript
async function login(email, senha) {
  try {
    const response = await fetch('http://localhost:4000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, senha })
    });

    const data = await response.json();
    
    if (data.success) {
      // Salvar token no localStorage
      localStorage.setItem('accessToken', data.data.accessToken);
      localStorage.setItem('refreshToken', data.data.refreshToken);
      return data.data.user;
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    console.error('Erro no login:', error);
    throw error;
  }
}
```

### Função para Obter Carteira

```javascript
async function getMyWallet() {
  try {
    const token = localStorage.getItem('accessToken');
    
    const response = await fetch('http://localhost:4000/api/wallets/my', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();
    
    if (data.success) {
      return data.data;
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    console.error('Erro ao obter carteira:', error);
    throw error;
  }
}
```

### Função para Criar Transação

```javascript
async function createTransaction(transactionData) {
  try {
    const token = localStorage.getItem('accessToken');
    
    const response = await fetch('http://localhost:4000/api/transactions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(transactionData)
    });

    const data = await response.json();
    
    if (data.success) {
      return data.data;
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    console.error('Erro ao criar transação:', error);
    throw error;
  }
}

// Exemplo de uso
const transaction = await createTransaction({
  walletId: 'wallet123',
  tipo: 'DEPOSITO',
  valor: 100.00,
  descricao: 'Depósito via PIX'
});
```

### Função para Criar Contrato Compartilhado

```javascript
async function createSharedContract(contractData) {
  try {
    const token = localStorage.getItem('accessToken');
    
    const response = await fetch('http://localhost:4000/api/shared-contracts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(contractData)
    });

    const data = await response.json();
    
    if (data.success) {
      return data.data;
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    console.error('Erro ao criar contrato:', error);
    throw error;
  }
}

// Exemplo de uso
const contract = await createSharedContract({
  valorTotal: 300.00,
  descricao: 'Jantar em grupo',
  participantes: [
    { userId: 'user1', valorParticipacao: 100.00 },
    { userId: 'user2', valorParticipacao: 100.00 },
    { userId: 'user3', valorParticipacao: 100.00 }
  ]
});
```

## 🚨 Tratamento de Erros

### Exemplo de Tratamento de Erros

```javascript
async function apiCall(url, options = {}) {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        ...options.headers
      }
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Erro na requisição');
    }

    return data;
  } catch (error) {
    if (error.message.includes('Token inválido')) {
      // Tentar renovar token
      await refreshToken();
      // Tentar novamente
      return apiCall(url, options);
    }
    throw error;
  }
}

async function refreshToken() {
  const refreshToken = localStorage.getItem('refreshToken');
  
  const response = await fetch('http://localhost:4000/api/auth/refresh', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ refreshToken })
  });

  const data = await response.json();
  
  if (data.success) {
    localStorage.setItem('accessToken', data.data.accessToken);
    localStorage.setItem('refreshToken', data.data.refreshToken);
  } else {
    // Redirecionar para login
    window.location.href = '/login';
  }
}
```

## 📱 Exemplos para React

### Hook para Autenticação

```javascript
import { useState, useEffect } from 'react';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      // Verificar se o token é válido
      fetch('http://localhost:4000/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          setUser(data.data);
        }
      })
      .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, senha) => {
    const response = await fetch('http://localhost:4000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, senha })
    });

    const data = await response.json();
    
    if (data.success) {
      localStorage.setItem('accessToken', data.data.accessToken);
      localStorage.setItem('refreshToken', data.data.refreshToken);
      setUser(data.data.user);
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
  };

  return { user, login, logout, loading };
}
```

### Hook para Carteira

```javascript
import { useState, useEffect } from 'react';

export function useWallet() {
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchWallet = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch('http://localhost:4000/api/wallets/my', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      
      if (data.success) {
        setWallet(data.data);
      }
    } catch (error) {
      console.error('Erro ao carregar carteira:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWallet();
  }, []);

  const createTransaction = async (transactionData) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch('http://localhost:4000/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(transactionData)
      });

      const data = await response.json();
      
      if (data.success) {
        // Recarregar carteira
        await fetchWallet();
        return data.data;
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('Erro ao criar transação:', error);
      throw error;
    }
  };

  return { wallet, loading, createTransaction, refreshWallet: fetchWallet };
}
```

## 🔗 URLs Importantes

- **API Base:** http://localhost:4000/api
- **Documentação:** http://localhost:4000/api-docs
- **Health Check:** http://localhost:4000/health
- **PgAdmin:** http://localhost:5050 (se usando Docker)

## 📝 Notas Importantes

1. **Autenticação:** Todas as rotas protegidas requerem o header `Authorization: Bearer <token>`
2. **Rate Limiting:** 100 requests por 15 minutos por IP
3. **Validação:** Todos os dados de entrada são validados
4. **Paginação:** Use `page` e `limit` para paginar resultados
5. **Filtros:** Muitos endpoints suportam filtros opcionais
6. **Tratamento de Erros:** Sempre verifique o campo `success` na resposta

---

Para mais informações, consulte a documentação completa em: http://localhost:4000/api-docs
