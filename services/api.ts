// Configuração da API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

// Tipos para a API
export interface LoginRequest {
  email: string;
  senha: string;
}

export interface RegisterRequest {
  nome: string;
  email: string;
  senha: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    user: {
      id: string;
      nome: string;
      email: string;
    };
    token: string;
    refreshToken: string;
  };
}

export interface TransactionRequest {
  walletId: string;
  tipo: 'DEPOSITO' | 'SAQUE' | 'TRANSFERENCIA' | 'PAGAMENTO_COMPARTILHADO';
  valor: number;
  descricao?: string;
  metadata?: Record<string, any>;
}

export interface TransactionResponse {
  success: boolean;
  message: string;
  data?: {
    id: string;
    tipo: string;
    valor: number;
    status: string;
    createdAt: string;
  };
}

export interface WalletResponse {
  success: boolean;
  message: string;
  data?: {
    id: string;
    saldo: number;
    usuarioId: string;
    createdAt: string;
  };
}

// Classe para gerenciar requisições HTTP
class ApiService {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    // Recuperar token do localStorage se existir
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('auth_token');
    }
  }

  // Método para definir o token de autenticação
  setToken(token: string | null) {
    this.token = token;
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('auth_token', token);
      } else {
        localStorage.removeItem('auth_token');
      }
    }
  }

  // Método para fazer requisições HTTP
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Adicionar token de autenticação se existir
    if (this.token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${this.token}`,
      };
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }

  // Métodos de autenticação
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    // Salvar token se login for bem-sucedido
    if (response.success && response.data?.token) {
      this.setToken(response.data.token);
    }

    return response;
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });

    // Salvar token se registro for bem-sucedido
    if (response.success && response.data?.token) {
      this.setToken(response.data.token);
    }

    return response;
  }

  async logout(): Promise<{ success: boolean; message: string }> {
    try {
      const response = await this.request<{ success: boolean; message: string }>('/auth/logout', {
        method: 'POST',
      });
      return response;
    } finally {
      // Sempre limpar o token local, mesmo se a requisição falhar
      this.setToken(null);
    }
  }

  async getMe(): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/me');
  }

  // Métodos de carteira
  async getMyWallet(): Promise<WalletResponse> {
    return this.request<WalletResponse>('/wallets/my');
  }

  async createWallet(): Promise<WalletResponse> {
    return this.request<WalletResponse>('/wallets', {
      method: 'POST',
    });
  }

  // Métodos de transação
  async createTransaction(transaction: TransactionRequest): Promise<TransactionResponse> {
    return this.request<TransactionResponse>('/transactions', {
      method: 'POST',
      body: JSON.stringify(transaction),
    });
  }

  async getMyTransactions(page = 1, limit = 10): Promise<{
    success: boolean;
    message: string;
    data?: {
      transactions: any[];
      pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
      };
    };
  }> {
    return this.request(`/transactions/my?page=${page}&limit=${limit}`);
  }

  // Método para testar conectividade
  async healthCheck(): Promise<{
    success: boolean;
    message: string;
    timestamp: string;
    environment: string;
    version: string;
  }> {
    const baseUrl = this.baseURL.replace('/api', '');
    return this.request('/health', {
      method: 'GET',
    });
  }
}

// Instância singleton do serviço de API
export const apiService = new ApiService(API_BASE_URL);

// Função utilitária para testar a comunicação
export async function testApiConnection(): Promise<{
  success: boolean;
  message: string;
  details?: any;
}> {
  try {
    console.log('🔍 Testando conexão com a API...');
    
    // Teste 1: Health Check
    console.log('1. Testando health check...');
    const healthResponse = await apiService.healthCheck();
    console.log('✅ Health check:', healthResponse);

    // Teste 2: Tentativa de login com credenciais de teste
    console.log('2. Testando autenticação...');
    try {
      const loginResponse = await apiService.login({
        email: 'demo@zelo.com',
        senha: 'demo123'
      });
      console.log('✅ Login teste:', loginResponse);
    } catch (error) {
      console.log('⚠️ Login teste falhou (esperado se não houver usuário):', error);
    }

    // Teste 3: Verificar se o token foi salvo
    console.log('3. Verificando token...');
    const token = localStorage.getItem('auth_token');
    console.log('Token salvo:', token ? 'Sim' : 'Não');

    return {
      success: true,
      message: 'Teste de comunicação concluído com sucesso!',
      details: {
        healthCheck: healthResponse,
        tokenSaved: !!token
      }
    };

  } catch (error) {
    console.error('❌ Erro no teste de comunicação:', error);
    return {
      success: false,
      message: `Erro na comunicação: ${error}`,
      details: error
    };
  }
}
