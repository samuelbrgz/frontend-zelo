import Header from '@/components/Header'
import HeroSection from '@/components/HeroSection'
import FeaturesSection from '@/components/FeaturesSection'
import ApiTestPanel from '@/components/ApiTestPanel'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <HeroSection />
      
      {/* Seção de Teste de API */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Teste de Comunicação
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Verifique se o frontend está se comunicando corretamente com o backend
            </p>
          </div>
          <ApiTestPanel />
        </div>
      </section>

      <FeaturesSection />
      <Footer />
    </main>
  )
}
