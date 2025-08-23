'use client'

import { TrendingUp, TrendingDown } from 'lucide-react'
import { Balance } from '@/store/useStore'

interface BalanceCardsProps {
  balances: Balance[]
}

export default function BalanceCards({ balances }: BalanceCardsProps) {
  const totalUSD = balances.reduce((sum, balance) => sum + parseFloat(balance.usdValue), 0)

  return (
    <div className="space-y-6">
      {/* Total Balance */}
      <div className="glass rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-white">Saldo Total</h2>
          <div className="flex items-center space-x-2 text-green-400">
            <TrendingUp className="w-5 h-5" />
            <span className="text-sm">+2.5%</span>
          </div>
        </div>
        <div className="text-4xl font-bold text-white mb-2">
          ${totalUSD.toFixed(2)}
        </div>
        <p className="text-white/60">Valor total em USD</p>
      </div>

      {/* Individual Balances */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {balances.map((balance, index) => (
          <div key={index} className="glass rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-violet-500/20 rounded-lg flex items-center justify-center">
                  <span className="text-violet-400 font-semibold text-sm">
                    {balance.asset}
                  </span>
                </div>
                <span className="text-white font-medium">{balance.asset}</span>
              </div>
              <div className="flex items-center space-x-1 text-green-400">
                <TrendingUp className="w-4 h-4" />
                <span className="text-xs">+1.2%</span>
              </div>
            </div>
            
            <div className="text-2xl font-bold text-white mb-1">
              {balance.amount}
            </div>
            
            <p className="text-white/60 text-sm">
              ${balance.usdValue} USD
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
