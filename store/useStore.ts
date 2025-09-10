import { create } from 'zustand'
import { apiService, LoginRequest, RegisterRequest } from '../services/api'

export interface Transaction {
  id: string
  type: 'send' | 'receive' | 'swap'
  amount: string
  asset: string
  from: string
  to: string
  timestamp: Date
  status: 'pending' | 'completed' | 'failed'
}

export interface Balance {
  asset: string
  amount: string
  usdValue: string
}

export interface User {
  id: string
  name: string
  email: string
  avatar: string
}

export interface Wallet {
  id: string
  name: string
  members: User[]
  balances: Balance[]
  transactions: Transaction[]
}

interface AppState {
  user: User | null
  wallet: Wallet | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  
  // Actions
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  createTransaction: (transaction: Omit<Transaction, 'id' | 'timestamp' | 'status'>) => void
  addMember: (email: string) => void
  clearError: () => void
  testApiConnection: () => Promise<void>
}

// Mock data
const mockUser: User = {
  id: '1',
  name: 'João Silva',
  email: 'joao@zelo.com',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
}

const mockWallet: Wallet = {
  id: '1',
  name: 'Carteira Principal',
  members: [
    mockUser,
    {
      id: '2',
      name: 'Maria Santos',
      email: 'maria@zelo.com',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
    },
    {
      id: '3',
      name: 'Pedro Costa',
      email: 'pedro@zelo.com',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
    }
  ],
  balances: [
    {
      asset: 'XLM',
      amount: '1250.50',
      usdValue: '125.05'
    },
    {
      asset: 'USDC',
      amount: '500.00',
      usdValue: '500.00'
    },
    {
      asset: 'BTC',
      amount: '0.0025',
      usdValue: '125.00'
    }
  ],
  transactions: [
    {
      id: '1',
      type: 'send',
      amount: '100.00',
      asset: 'XLM',
      from: 'joao@zelo.com',
      to: 'maria@zelo.com',
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 min ago
      status: 'completed'
    },
    {
      id: '2',
      type: 'receive',
      amount: '50.00',
      asset: 'USDC',
      from: 'pedro@zelo.com',
      to: 'joao@zelo.com',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      status: 'completed'
    },
    {
      id: '3',
      type: 'swap',
      amount: '0.001',
      asset: 'BTC',
      from: 'joao@zelo.com',
      to: 'Exchange',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      status: 'completed'
    }
  ]
}

export const useStore = create<AppState>((set, get) => ({
  user: null,
  wallet: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null })
    
    try {
      const response = await apiService.login({ email, senha: password })
      
      if (response.success && response.data) {
        const { user, token } = response.data
        
        set({
          user: {
            id: user.id,
            name: user.nome,
            email: user.email,
            avatar: `https://ui-avatars.com/api/?name=${user.nome}&background=8b5cf6&color=fff`
          },
          isAuthenticated: true,
          isLoading: false,
          error: null
        })

        // Tentar carregar dados da carteira
        try {
          const walletResponse = await apiService.getMyWallet()
          if (walletResponse.success && walletResponse.data) {
            set({
              wallet: {
                id: walletResponse.data.id,
                name: 'Carteira Principal',
                members: [get().user!],
                balances: [{
                  asset: 'BRL',
                  amount: walletResponse.data.saldo.toString(),
                  usdValue: walletResponse.data.saldo.toString()
                }],
                transactions: []
              }
            })
          }
        } catch (walletError) {
          console.warn('Erro ao carregar carteira:', walletError)
          // Usar dados mock se não conseguir carregar
          set({ wallet: mockWallet })
        }
      } else {
        throw new Error(response.message || 'Erro no login')
      }
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      })
      throw error
    }
  },

  register: async (name: string, email: string, password: string) => {
    set({ isLoading: true, error: null })
    
    try {
      const response = await apiService.register({ nome: name, email, senha: password })
      
      if (response.success && response.data) {
        const { user, token } = response.data
        
        set({
          user: {
            id: user.id,
            name: user.nome,
            email: user.email,
            avatar: `https://ui-avatars.com/api/?name=${user.nome}&background=8b5cf6&color=fff`
          },
          isAuthenticated: true,
          isLoading: false,
          error: null
        })

        // Criar carteira para o novo usuário
        try {
          await apiService.createWallet()
        } catch (walletError) {
          console.warn('Erro ao criar carteira:', walletError)
        }
      } else {
        throw new Error(response.message || 'Erro no registro')
      }
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      })
      throw error
    }
  },

  logout: async () => {
    try {
      await apiService.logout()
    } catch (error) {
      console.warn('Erro no logout:', error)
    } finally {
      set({
        user: null,
        wallet: null,
        isAuthenticated: false,
        error: null
      })
    }
  },

  createTransaction: (transactionData) => {
    const { wallet } = get()
    if (!wallet) return

    const newTransaction: Transaction = {
      ...transactionData,
      id: Date.now().toString(),
      timestamp: new Date(),
      status: 'pending'
    }

    set({
      wallet: {
        ...wallet,
        transactions: [newTransaction, ...wallet.transactions]
      }
    })
  },

  addMember: (email: string) => {
    const { wallet } = get()
    if (!wallet) return

    const newMember: User = {
      id: Date.now().toString(),
      name: email.split('@')[0],
      email,
      avatar: `https://ui-avatars.com/api/?name=${email.split('@')[0]}&background=8b5cf6&color=fff`
    }

    set({
      wallet: {
        ...wallet,
        members: [...wallet.members, newMember]
      }
    })
  },

  clearError: () => {
    set({ error: null })
  },

  testApiConnection: async () => {
    set({ isLoading: true, error: null })
    
    try {
      const { testApiConnection } = await import('../services/api')
      const result = await testApiConnection()
      
      if (result.success) {
        set({ error: null })
        console.log('✅ Teste de comunicação bem-sucedido!')
      } else {
        set({ error: result.message })
        console.error('❌ Teste de comunicação falhou:', result.message)
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido'
      set({ error: errorMessage })
      console.error('❌ Erro no teste de comunicação:', error)
    } finally {
      set({ isLoading: false })
    }
  }
}))
