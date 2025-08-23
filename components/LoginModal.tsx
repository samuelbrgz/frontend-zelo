'use client'

import { useState } from 'react'
import { X, Eye, EyeOff, Loader2 } from 'lucide-react'
import { useStore } from '@/store/useStore'
import { useRouter } from 'next/navigation'

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  
  const { login, isLoading } = useStore()
  const router = useRouter()

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    try {
      await login(email, password)
      onClose()
      router.push('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao fazer login')
    }
  }

  const handleDemoLogin = async () => {
    setEmail('demo@zelo.com')
    setPassword('demo123')
    
    try {
      await login('demo@zelo.com', 'demo123')
      onClose()
      router.push('/dashboard')
    } catch (err) {
      setError('Erro ao fazer login demo')
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
          <h2 className="text-2xl font-bold text-white mb-2">
            Bem-vindo ao Zelo
          </h2>
          <p className="text-white/60">
            Faça login para acessar sua carteira compartilhada
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-white/80 mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input w-full"
              placeholder="seu@email.com"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-white/80 mb-2">
              Senha
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input w-full pr-12"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="text-red-400 text-sm text-center bg-red-400/10 rounded-lg p-3">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Entrando...</span>
              </div>
            ) : (
              'Entrar'
            )}
          </button>
        </form>

        {/* Demo login */}
        <div className="mt-6 text-center">
          <button
            onClick={handleDemoLogin}
            className="text-violet-300 hover:text-violet-200 text-sm underline"
          >
            Entrar com conta demo
          </button>
          <p className="text-white/40 text-xs mt-2">
            demo@zelo.com / demo123
          </p>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-white/40 text-xs">
            Ao fazer login, você concorda com nossos{' '}
            <a href="#" className="text-violet-300 hover:underline">Termos de Serviço</a>
          </p>
        </div>
      </div>
    </div>
  )
}
