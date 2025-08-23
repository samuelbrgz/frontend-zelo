'use client'

import { useState } from 'react'
import { X, Send, Download, ArrowLeftRight } from 'lucide-react'
import { useStore } from '@/store/useStore'

interface TransactionModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function TransactionModal({ isOpen, onClose }: TransactionModalProps) {
  const [type, setType] = useState<'send' | 'receive' | 'swap'>('send')
  const [amount, setAmount] = useState('')
  const [asset, setAsset] = useState('XLM')
  const [recipient, setRecipient] = useState('')
  const [memo, setMemo] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  
  const { wallet, createTransaction } = useStore()

  if (!isOpen || !wallet) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      createTransaction({
        type,
        amount,
        asset,
        from: wallet.members[0]?.email || '',
        to: recipient
      })

      onClose()
      setAmount('')
      setRecipient('')
      setMemo('')
    } catch (error) {
      console.error('Erro ao criar transação:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getTypeIcon = () => {
    switch (type) {
      case 'send':
        return <Send className="w-5 h-5 text-blue-400" />
      case 'receive':
        return <Download className="w-5 h-5 text-green-400" />
      case 'swap':
        return <ArrowLeftRight className="w-5 h-5 text-purple-400" />
      default:
        return <Send className="w-5 h-5" />
    }
  }

  const getTypeTitle = () => {
    switch (type) {
      case 'send':
        return 'Enviar'
      case 'receive':
        return 'Solicitar'
      case 'swap':
        return 'Trocar'
      default:
        return 'Transação'
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-md glass rounded-2xl p-6 shadow-2xl animate-fade-in">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
            {getTypeIcon()}
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            {getTypeTitle()}
          </h2>
          <p className="text-white/60">
            Complete os detalhes da transação
          </p>
        </div>

        {/* Type Selector */}
        <div className="flex space-x-2 mb-6">
          {(['send', 'receive', 'swap'] as const).map((transactionType) => (
            <button
              key={transactionType}
              onClick={() => setType(transactionType)}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                type === transactionType
                  ? 'bg-violet-500 text-white'
                  : 'bg-white/10 text-white/60 hover:bg-white/20'
              }`}
            >
              {transactionType === 'send' ? 'Enviar' :
               transactionType === 'receive' ? 'Solicitar' : 'Trocar'}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-white/80 mb-2">
              Quantidade
            </label>
            <div className="relative">
              <input
                id="amount"
                type="number"
                step="0.000001"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="input w-full pr-20"
                placeholder="0.00"
                required
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <select
                  value={asset}
                  onChange={(e) => setAsset(e.target.value)}
                  className="bg-transparent text-white/80 text-sm border-none outline-none"
                >
                  {wallet.balances.map((balance) => (
                    <option key={balance.asset} value={balance.asset} className="bg-violet-600">
                      {balance.asset}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="recipient" className="block text-sm font-medium text-white/80 mb-2">
              {type === 'send' ? 'Destinatário' : 'Remetente'}
            </label>
            <input
              id="recipient"
              type="text"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="input w-full"
              placeholder={type === 'send' ? 'Endereço Stellar ou email' : 'Email do remetente'}
              required
            />
          </div>

          <div>
            <label htmlFor="memo" className="block text-sm font-medium text-white/80 mb-2">
              Memo (opcional)
            </label>
            <input
              id="memo"
              type="text"
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              className="input w-full"
              placeholder="Descrição da transação"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Processando...' : `${getTypeTitle()} ${asset}`}
          </button>
        </form>

        {/* Info */}
        <div className="mt-6 p-4 bg-white/5 rounded-lg">
          <p className="text-white/60 text-sm text-center">
            Esta transação será processada na rede Stellar e pode levar alguns segundos para ser confirmada.
          </p>
        </div>
      </div>
    </div>
  )
}
