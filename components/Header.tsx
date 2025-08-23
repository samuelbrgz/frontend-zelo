'use client'

import { useState } from 'react'
import { Wallet, Menu, X } from 'lucide-react'
import LoginModal from './LoginModal'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLoginOpen, setIsLoginOpen] = useState(false)

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 glass backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-violet-500 rounded-lg flex items-center justify-center">
                <Wallet className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">Zelo</span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-white/80 hover:text-white transition-colors">
                Recursos
              </a>
              <a href="#about" className="text-white/80 hover:text-white transition-colors">
                Sobre
              </a>
              <a href="#contact" className="text-white/80 hover:text-white transition-colors">
                Contato
              </a>
            </nav>

            {/* CTA Button */}
            <div className="hidden md:block">
              <button
                onClick={() => setIsLoginOpen(true)}
                className="btn-primary"
              >
                Entrar
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-white p-2"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden glass rounded-xl mt-2 p-4">
              <nav className="flex flex-col space-y-4">
                <a href="#features" className="text-white/80 hover:text-white transition-colors">
                  Recursos
                </a>
                <a href="#about" className="text-white/80 hover:text-white transition-colors">
                  Sobre
                </a>
                <a href="#contact" className="text-white/80 hover:text-white transition-colors">
                  Contato
                </a>
                <button
                  onClick={() => {
                    setIsLoginOpen(true)
                    setIsMenuOpen(false)
                  }}
                  className="btn-primary w-full"
                >
                  Entrar
                </button>
              </nav>
            </div>
          )}
        </div>
      </header>

      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </>
  )
}
