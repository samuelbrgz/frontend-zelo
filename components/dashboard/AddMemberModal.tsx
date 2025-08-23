'use client'

import { useState } from 'react'
import { X, UserPlus, Mail, Shield } from 'lucide-react'
import { useStore } from '@/store/useStore'

interface AddMemberModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function AddMemberModal({ isOpen, onClose }: AddMemberModalProps) {
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<'member' | 'admin'>('member')
  const [isLoading, setIsLoading] = useState(false)
  
  const { wallet, addMember } = useStore()

  if (!isOpen || !wallet) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      addMember(email)
      
      onClose()
      setEmail('')
      setRole('member')
    } catch (error) {
      console.error('Erro ao adicionar membro:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const roles = [
    {
      value: 'member',
      label: 'Membro',
      description: 'Pode visualizar e aprovar transações',
      icon: Shield,
      color: 'bg-blue-500/20',
      iconColor: 'text-blue-400'
    },
    {
      value: 'admin',
      label: 'Administrador',
      description: 'Pode gerenciar membros e configurações',
      icon: Shield,
      color: 'bg-violet-500/20',
      iconColor: 'text-violet-400'
    }
  ]

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
          <div className="w-16 h-16 bg-violet-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserPlus className="w-8 h-8 text-violet-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Adicionar Membro
          </h2>
          <p className="text-white/60">
            Convide uma nova pessoa para sua carteira compartilhada
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-white/80 mb-2">
              Email do Membro
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input w-full pl-10"
                placeholder="membro@exemplo.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-3">
              Tipo de Acesso
            </label>
            <div className="space-y-3">
              {roles.map((roleOption) => (
                <label
                  key={roleOption.value}
                  className={`flex items-start space-x-3 p-3 rounded-lg cursor-pointer transition-colors ${
                    role === roleOption.value
                      ? 'bg-violet-500/20 border border-violet-400/30'
                      : 'bg-white/5 hover:bg-white/10'
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value={roleOption.value}
                    checked={role === roleOption.value}
                    onChange={(e) => setRole(e.target.value as 'member' | 'admin')}
                    className="sr-only"
                  />
                  
                  <div className={`w-5 h-5 ${roleOption.color} rounded-full flex items-center justify-center flex-shrink-0 mt-0.5`}>
                    {role === roleOption.value && (
                      <div className="w-2.5 h-2.5 bg-violet-400 rounded-full" />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <roleOption.icon className={`w-4 h-4 ${roleOption.iconColor}`} />
                      <span className="text-white font-medium">{roleOption.label}</span>
                    </div>
                    <p className="text-white/60 text-sm">{roleOption.description}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Adicionando...' : 'Adicionar Membro'}
          </button>
        </form>

        {/* Info */}
        <div className="mt-6 p-4 bg-white/5 rounded-lg">
          <p className="text-white/60 text-sm text-center">
            Um convite será enviado por email. O membro precisará aceitar para ter acesso à carteira.
          </p>
        </div>
      </div>
    </div>
  )
}
