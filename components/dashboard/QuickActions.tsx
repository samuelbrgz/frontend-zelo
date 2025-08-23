'use client'

import { useState } from 'react'
import { Send, Download, UserPlus, Plus } from 'lucide-react'
import { useStore } from '@/store/useStore'
import TransactionModal from './TransactionModal'
import AddMemberModal from './AddMemberModal'

export default function QuickActions() {
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false)
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false)
  const { wallet } = useStore()

  if (!wallet) return null

  const actions = [
    {
      icon: Send,
      title: 'Enviar',
      description: 'Enviar criptomoedas',
      color: 'bg-blue-500/20',
      iconColor: 'text-blue-400',
      onClick: () => setIsTransactionModalOpen(true)
    },
    {
      icon: Download,
      title: 'Solicitar',
      description: 'Solicitar pagamento',
      color: 'bg-green-500/20',
      iconColor: 'text-green-400',
      onClick: () => setIsTransactionModalOpen(true)
    },
    {
      icon: UserPlus,
      title: 'Adicionar Membro',
      description: 'Convidar nova pessoa',
      color: 'bg-violet-500/20',
      iconColor: 'text-violet-400',
      onClick: () => setIsAddMemberModalOpen(true)
    }
  ]

  return (
    <>
      <div className="glass rounded-2xl p-6">
        <h2 className="text-2xl font-bold text-white mb-6">Ações Rápidas</h2>
        
        <div className="grid md:grid-cols-3 gap-4">
          {actions.map((action, index) => (
            <button
              key={index}
              onClick={action.onClick}
              className="glass rounded-xl p-6 text-center hover:scale-105 transition-all duration-200 group"
            >
              <div className={`w-16 h-16 ${action.color} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                <action.icon className={`w-8 h-8 ${action.iconColor}`} />
              </div>
              
              <h3 className="text-lg font-semibold text-white mb-2">
                {action.title}
              </h3>
              
              <p className="text-white/70 text-sm">
                {action.description}
              </p>
            </button>
          ))}
        </div>

        {/* Additional Actions */}
        <div className="mt-6 pt-6 border-t border-white/10">
          <div className="grid md:grid-cols-2 gap-4">
            <button className="glass rounded-xl p-4 text-left hover:bg-white/10 transition-colors">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
                  <Plus className="w-5 h-5 text-orange-400" />
                </div>
                <div>
                  <h4 className="text-white font-medium">Criar Carteira</h4>
                  <p className="text-white/60 text-sm">Nova carteira compartilhada</p>
                </div>
              </div>
            </button>

            <button className="glass rounded-xl p-4 text-left hover:bg-white/10 transition-colors">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <Plus className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h4 className="text-white font-medium">Adicionar Ativo</h4>
                  <p className="text-white/60 text-sm">Novo token ou moeda</p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>

      <TransactionModal 
        isOpen={isTransactionModalOpen} 
        onClose={() => setIsTransactionModalOpen(false)} 
      />
      
      <AddMemberModal 
        isOpen={isAddMemberModalOpen} 
        onClose={() => setIsAddMemberModalOpen(false)} 
      />
    </>
  )
}
