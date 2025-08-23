'use client'

import { Shield, Users, Zap, Lock, Globe, BarChart3 } from 'lucide-react'

const features = [
  {
    icon: Shield,
    title: 'Multi-assinatura Avançada',
    description: 'Configure múltiplas chaves de segurança com diferentes níveis de permissão. Controle total sobre quem pode aprovar transações.',
    details: ['2-3 assinaturas configuráveis', 'Diferentes níveis de permissão', 'Aprovação em tempo real']
  },
  {
    icon: Users,
    title: 'Gestão Colaborativa',
    description: 'Gerencie fundos em equipe com transparência total. Adicione ou remova membros conforme necessário.',
    details: ['Múltiplos membros', 'Histórico de atividades', 'Notificações em tempo real']
  },
  {
    icon: Zap,
    title: 'Stellar & Soroban',
    description: 'Construído na blockchain mais rápida e eficiente. Suporte completo a tokens personalizados e smart contracts.',
    details: ['Transações em segundos', 'Taxas mínimas', 'Smart contracts Soroban']
  },
  {
    icon: Lock,
    title: 'Segurança Passkey',
    description: 'Autenticação biométrica e hardware security modules (HSM) para máxima segurança.',
    details: ['Biometria (Face ID, Touch ID)', 'HSM support', '2FA opcional']
  },
  {
    icon: Globe,
    title: 'Ecosistema Stellar',
    description: 'Integração nativa com o ecossistema Stellar, incluindo DEX, stablecoins e DeFi protocols.',
    details: ['Stellar DEX', 'Stablecoins nativos', 'DeFi protocols']
  },
  {
    icon: BarChart3,
    title: 'Analytics & Relatórios',
    description: 'Dashboard completo com analytics, relatórios fiscais e histórico detalhado de transações.',
    details: ['Relatórios fiscais', 'Analytics avançados', 'Exportação de dados']
  }
]

export default function FeaturesSection() {
  return (
    <section id="features" className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Recursos Avançados
          </h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            O Zelo oferece uma solução completa para carteiras compartilhadas, 
            combinando segurança blockchain com facilidade de uso.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="glass rounded-2xl p-8 hover:scale-105 transition-all duration-300 group"
            >
              <div className="w-16 h-16 bg-violet-500/20 rounded-xl flex items-center justify-center mb-6 group-hover:bg-violet-500/30 transition-colors">
                <feature.icon className="w-8 h-8 text-violet-400" />
              </div>
              
              <h3 className="text-xl font-semibold text-white mb-4">
                {feature.title}
              </h3>
              
              <p className="text-white/70 mb-6 leading-relaxed">
                {feature.description}
              </p>
              
              <ul className="space-y-2">
                {feature.details.map((detail, detailIndex) => (
                  <li key={detailIndex} className="flex items-center text-white/60 text-sm">
                    <div className="w-2 h-2 bg-violet-400 rounded-full mr-3" />
                    {detail}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <div className="glass rounded-2xl p-12 max-w-4xl mx-auto">
            <h3 className="text-3xl font-bold text-white mb-4">
              Pronto para começar?
            </h3>
            <p className="text-white/80 mb-8 text-lg">
              Junte-se ao futuro das carteiras compartilhadas no ecossistema Stellar
            </p>
            <button className="btn-primary text-lg px-8 py-4">
              Criar Carteira Gratuita
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
