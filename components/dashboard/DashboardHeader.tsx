'use client'

import { useState } from 'react'
import { Wallet, Bell, Settings, LogOut, User, ChevronDown } from 'lucide-react'
import { useStore } from '@/store/useStore'
import { useRouter } from 'next/navigation'

export default function DashboardHeader() {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const { user, logout } = useStore()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  if (!user) return null

  return (
    <header className="glass backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-violet-500 rounded-lg flex items-center justify-center">
              <Wallet className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">Zelo</span>
            <span className="text-white/60 text-sm">Dashboard</span>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <button className="relative p-2 text-white/60 hover:text-white transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-400 rounded-full"></span>
            </button>

            {/* Settings */}
            <button className="p-2 text-white/60 hover:text-white transition-colors">
              <Settings className="w-5 h-5" />
            </button>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-8 h-8 rounded-full"
                />
                <span className="text-white font-medium hidden sm:block">
                  {user.name}
                </span>
                <ChevronDown className="w-4 h-4 text-white/60" />
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 glass rounded-xl shadow-lg py-2 z-50">
                  <div className="px-4 py-2 border-b border-white/10">
                    <p className="text-white font-medium">{user.name}</p>
                    <p className="text-white/60 text-sm">{user.email}</p>
                  </div>
                  
                  <button className="w-full text-left px-4 py-2 text-white/80 hover:text-white hover:bg-white/10 transition-colors flex items-center space-x-2">
                    <User className="w-4 h-4" />
                    <span>Perfil</span>
                  </button>
                  
                  <button className="w-full text-left px-4 py-2 text-white/80 hover:text-white hover:bg-white/10 transition-colors flex items-center space-x-2">
                    <Settings className="w-4 h-4" />
                    <span>Configurações</span>
                  </button>
                  
                  <div className="border-t border-white/10 my-1" />
                  
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-red-400 hover:text-red-300 hover:bg-red-400/10 transition-colors flex items-center space-x-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sair</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
