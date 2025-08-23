'use client'

import { useState } from 'react'
import { ArrowRight, Shield, Users, Zap } from 'lucide-react'
import LoginModal from './LoginModal'

export default function HeroSection() {
  const [isLoginOpen, setIsLoginOpen] = useState(false)

  return (
    <>
      <section className="relative min-h-screen flex items-center justify-center pt-16 px-4">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-violet-400/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-violet-500/20 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto text-center">
          {/* Main Content */}
          <div className="mb-12">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              <span className="text-gradient">Zelo</span>
              <br />
              <span className="text-4xl md:text-5xl text-white/90">
                Carteira Compartilhada
              </span>
              <br />
              <span className="text-3xl md:text-4xl text-violet-300">
                Multi-assinatura
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto mb-8 leading-relaxed">
              Gerencie criptomoedas coletivamente com amigos, equipes e comunidades. 
              Construído no ecossistema Stellar com segurança e transparência por design.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={() => setIsLoginOpen(true)}
                className="btn-primary text-lg px-8 py-4 group"
              >
                Começar Agora
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button className="btn-secondary text-lg px-8 py-4">
                Saiba Mais
              </button>
            </div>
          </div>

          {/* Features Preview */}
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="glass rounded-xl p-6 text-center group hover:scale-105 transition-transform">
              <div className="w-16 h-16 bg-violet-500/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-violet-500/30 transition-colors">
                <Shield className="w-8 h-8 text-violet-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Multi-assinatura
              </h3>
              <p className="text-white/70 text-sm">
                Controle compartilhado com múltiplas chaves de segurança
              </p>
            </div>

            <div className="glass rounded-xl p-6 text-center group hover:scale-105 transition-transform">
              <div className="w-16 h-16 bg-violet-500/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-violet-500/30 transition-colors">
                <Users className="w-8 h-8 text-violet-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Colaborativo
              </h3>
              <p className="text-white/70 text-sm">
                Gerencie fundos em equipe com transparência total
              </p>
            </div>

            <div className="glass rounded-xl p-6 text-center group hover:scale-105 transition-transform">
              <div className="w-16 h-16 bg-violet-500/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-violet-500/30 transition-colors">
                <Zap className="w-8 h-8 text-violet-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Stellar & Soroban
              </h3>
              <p className="text-white/70 text-sm">
                Construído na blockchain mais rápida e eficiente
              </p>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-pulse" />
          </div>
        </div>
      </section>

      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </>
  )
}
