'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useStore } from '@/store/useStore'
import DashboardHeader from '@/components/dashboard/DashboardHeader'
import BalanceCards from '@/components/dashboard/BalanceCards'
import TransactionList from '@/components/dashboard/TransactionList'
import QuickActions from '@/components/dashboard/QuickActions'

export default function Dashboard() {
  const { isAuthenticated, wallet } = useStore()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/')
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated || !wallet) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-500 mx-auto mb-4"></div>
          <p className="text-white/60">Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <DashboardHeader />
      
      <main className="pt-16 px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              Bem-vindo de volta, {wallet.members[0]?.name}!
            </h1>
            <p className="text-white/60">
              Gerencie sua carteira compartilhada {wallet.name}
            </p>
          </div>

          {/* Balance Cards */}
          <div className="mb-8">
            <BalanceCards balances={wallet.balances} />
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Quick Actions */}
            <div className="lg:col-span-1">
              <QuickActions />
            </div>

            {/* Right Column - Transactions */}
            <div className="lg:col-span-2">
              <TransactionList transactions={wallet.transactions} />
            </div>
          </div>

          {/* Members Section */}
          <div className="mt-8">
            <div className="glass rounded-2xl p-6">
              <h2 className="text-2xl font-bold text-white mb-6">Membros da Carteira</h2>
              <div className="grid md:grid-cols-3 gap-4">
                {wallet.members.map((member) => (
                  <div key={member.id} className="flex items-center space-x-3 p-3 rounded-lg bg-white/5">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <p className="text-white font-medium">{member.name}</p>
                      <p className="text-white/60 text-sm">{member.email}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
