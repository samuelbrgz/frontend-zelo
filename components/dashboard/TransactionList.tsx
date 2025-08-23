'use client'

import { ArrowUpRight, ArrowDownLeft, ArrowLeftRight, Clock, CheckCircle, XCircle } from 'lucide-react'
import { Transaction } from '@/store/useStore'

interface TransactionListProps {
  transactions: Transaction[]
}

export default function TransactionList({ transactions }: TransactionListProps) {
  const getTransactionIcon = (type: Transaction['type']) => {
    switch (type) {
      case 'send':
        return <ArrowUpRight className="w-5 h-5 text-red-400" />
      case 'receive':
        return <ArrowDownLeft className="w-5 h-5 text-green-400" />
      case 'swap':
        return <ArrowLeftRight className="w-5 h-5 text-blue-400" />
      default:
        return <ArrowLeftRight className="w-5 h-5 text-gray-400" />
    }
  }

  const getStatusIcon = (status: Transaction['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-400" />
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-400" />
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-400" />
      default:
        return <Clock className="w-4 h-4 text-gray-400" />
    }
  }

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'Agora'
    if (diffInMinutes < 60) return `${diffInMinutes}m atrás`
    
    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) return `${diffInHours}h atrás`
    
    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays}d atrás`
  }

  return (
    <div className="glass rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Transações Recentes</h2>
        <button className="text-violet-400 hover:text-violet-300 text-sm font-medium">
          Ver Todas
        </button>
      </div>

      <div className="space-y-4">
        {transactions.map((transaction) => (
          <div key={transaction.id} className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                {getTransactionIcon(transaction.type)}
              </div>
              
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-white font-medium">
                    {transaction.type === 'send' ? 'Enviado' : 
                     transaction.type === 'receive' ? 'Recebido' : 'Trocado'}
                  </span>
                  <span className="text-white/60">
                    {transaction.amount} {transaction.asset}
                  </span>
                </div>
                
                <div className="flex items-center space-x-2 text-sm">
                  <span className="text-white/60">
                    {transaction.type === 'send' ? 'Para:' : 'De:'} {transaction.to}
                  </span>
                  <span className="text-white/40">•</span>
                  <span className="text-white/40">
                    {formatTimeAgo(transaction.timestamp)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1">
                {getStatusIcon(transaction.status)}
                <span className={`text-sm ${
                  transaction.status === 'completed' ? 'text-green-400' :
                  transaction.status === 'pending' ? 'text-yellow-400' :
                  'text-red-400'
                }`}>
                  {transaction.status === 'completed' ? 'Concluído' :
                   transaction.status === 'pending' ? 'Pendente' :
                   'Falhou'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {transactions.length === 0 && (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <ArrowLeftRight className="w-8 h-8 text-white/40" />
          </div>
          <p className="text-white/60">Nenhuma transação ainda</p>
          <p className="text-white/40 text-sm">Suas transações aparecerão aqui</p>
        </div>
      )}
    </div>
  )
}
