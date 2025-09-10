'use client'

import { useState } from 'react'
import { useStore } from '../store/useStore'

export default function ApiTestPanel() {
  const { testApiConnection, isLoading, error, clearError } = useStore()
  const [testResults, setTestResults] = useState<any>(null)
  const [showDetails, setShowDetails] = useState(false)

  const handleTest = async () => {
    setTestResults(null)
    clearError()
    
    const tests = []
    
    try {
      // Teste 1: Health Check
      try {
        const healthResponse = await fetch('http://localhost:4000/health')
        if (healthResponse.ok) {
          const data = await healthResponse.json()
          tests.push({
            name: 'Health Check',
            status: 'success',
            message: `Backend respondendo: ${data.message}`
          })
        } else {
          tests.push({
            name: 'Health Check',
            status: 'error',
            message: `Erro HTTP: ${healthResponse.status}`
          })
        }
      } catch (error) {
        tests.push({
          name: 'Health Check',
          status: 'error',
          message: `Falha na conexão: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
        })
      }

      // Teste 2: API Root
      try {
        const apiResponse = await fetch('http://localhost:4000/')
        if (apiResponse.ok) {
          const data = await apiResponse.json()
          tests.push({
            name: 'API Root',
            status: 'success',
            message: `API acessível: ${data.message}`
          })
        } else {
          tests.push({
            name: 'API Root',
            status: 'error',
            message: `Erro HTTP: ${apiResponse.status}`
          })
        }
      } catch (error) {
        tests.push({
          name: 'API Root',
          status: 'error',
          message: `Falha na conexão: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
        })
      }

      // Teste 3: Login Endpoint
      try {
        const loginResponse = await fetch('http://localhost:4000/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: 'test@invalid.com',
            senha: 'invalidpassword'
          })
        })
        
        if (loginResponse.status === 401 || loginResponse.status === 400) {
          tests.push({
            name: 'Login Endpoint',
            status: 'success',
            message: 'Endpoint de login funcionando (rejeitou credenciais inválidas)'
          })
        } else {
          tests.push({
            name: 'Login Endpoint',
            status: 'warning',
            message: `Status inesperado: ${loginResponse.status}`
          })
        }
      } catch (error) {
        tests.push({
          name: 'Login Endpoint',
          status: 'error',
          message: `Falha na conexão: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
        })
      }

      // Teste 4: CORS
      try {
        const corsResponse = await fetch('http://localhost:4000/api/auth/login', {
          method: 'OPTIONS',
          headers: {
            'Origin': 'http://localhost:3000',
            'Access-Control-Request-Method': 'POST',
            'Access-Control-Request-Headers': 'Content-Type'
          }
        })
        
        const corsOrigin = corsResponse.headers.get('Access-Control-Allow-Origin')
        if (corsOrigin) {
          tests.push({
            name: 'CORS',
            status: 'success',
            message: `CORS configurado: ${corsOrigin}`
          })
        } else {
          tests.push({
            name: 'CORS',
            status: 'warning',
            message: 'CORS pode não estar configurado corretamente'
          })
        }
      } catch (error) {
        tests.push({
          name: 'CORS',
          status: 'error',
          message: `Falha no teste CORS: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
        })
      }

      setTestResults({
        timestamp: new Date().toISOString(),
        tests
      })
      
    } catch (error) {
      console.error('Erro no teste:', error)
      setTestResults({
        timestamp: new Date().toISOString(),
        tests: [{
          name: 'Erro Geral',
          status: 'error',
          message: `Erro inesperado: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
        }]
      })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-600 bg-green-100'
      case 'warning': return 'text-yellow-600 bg-yellow-100'
      case 'error': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return '✅'
      case 'warning': return '⚠️'
      case 'error': return '❌'
      default: return 'ℹ️'
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Teste de Comunicação Frontend ↔ Backend
        </h3>
        <button
          onClick={handleTest}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Testando...
            </>
          ) : (
            <>
              🔍 Testar Comunicação
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <div className="flex items-center gap-2">
            <span className="text-red-600">❌</span>
            <span className="text-red-800 font-medium">Erro na Comunicação</span>
          </div>
          <p className="text-red-700 mt-1">{error}</p>
        </div>
      )}

      {testResults && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-gray-900">Resultados do Teste</h4>
            <span className="text-sm text-gray-500">
              {new Date(testResults.timestamp).toLocaleString()}
            </span>
          </div>

          <div className="space-y-2">
            {testResults.tests.map((test: any, index: number) => (
              <div
                key={index}
                className={`p-3 rounded-md border ${getStatusColor(test.status)}`}
              >
                <div className="flex items-center gap-2">
                  <span>{getStatusIcon(test.status)}</span>
                  <span className="font-medium">{test.name}</span>
                </div>
                <p className="text-sm mt-1 opacity-80">{test.message}</p>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-gray-200">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              {showDetails ? 'Ocultar' : 'Mostrar'} Detalhes Técnicos
              <span className="transform transition-transform">
                {showDetails ? '▲' : '▼'}
              </span>
            </button>

            {showDetails && (
              <div className="mt-3 p-4 bg-gray-50 rounded-md">
                <h5 className="font-medium text-gray-900 mb-2">Informações Técnicas:</h5>
                <div className="text-sm text-gray-600 space-y-1">
                  <p><strong>Frontend URL:</strong> {typeof window !== 'undefined' ? window.location.origin : 'N/A'}</p>
                  <p><strong>Backend URL:</strong> {process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'}</p>
                  <p><strong>Token Storage:</strong> {typeof window !== 'undefined' && localStorage.getItem('auth_token') ? 'Token presente' : 'Sem token'}</p>
                  <p><strong>User Agent:</strong> {typeof window !== 'undefined' ? navigator.userAgent.substring(0, 50) + '...' : 'N/A'}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
        <h5 className="font-medium text-blue-900 mb-2">Como usar:</h5>
        <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
          <li>Certifique-se de que o backend está rodando na porta 4000</li>
          <li>Clique em "Testar Comunicação" para verificar a conectividade</li>
          <li>Verifique os resultados de cada teste</li>
          <li>Se houver erros, verifique se o backend está acessível</li>
        </ol>
      </div>
    </div>
  )
}
