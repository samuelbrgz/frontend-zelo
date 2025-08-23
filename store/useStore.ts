import { create } from 'zustand'

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
  
  // Actions
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  createTransaction: (transaction: Omit<Transaction, 'id' | 'timestamp' | 'status'>) => void
  addMember: (email: string) => void
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

  login: async (email: string, password: string) => {
    set({ isLoading: true })
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    if (email === 'demo@zelo.com' && password === 'demo123') {
      set({
        user: mockUser,
        wallet: mockWallet,
        isAuthenticated: true,
        isLoading: false
      })
    } else {
      set({ isLoading: false })
      throw new Error('Credenciais inválidas')
    }
  },

  logout: () => {
    set({
      user: null,
      wallet: null,
      isAuthenticated: false
    })
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
  }
}))
