#!/usr/bin/env node

/**
 * Script para testar a comunicação entre frontend e backend
 * Execute com: node scripts/test-communication.js
 */

const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const BACKEND_URL = 'http://localhost:4000';
const API_URL = `${BACKEND_URL}/api`;

// Cores para output no terminal
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logError(message) {
  log(`❌ ${message}`, 'red');
}

function logWarning(message) {
  log(`⚠️  ${message}`, 'yellow');
}

function logInfo(message) {
  log(`ℹ️  ${message}`, 'blue');
}

async function testHealthCheck() {
  logInfo('Testando Health Check...');
  try {
    const response = await fetch(`${BACKEND_URL}/health`);
    const data = await response.json();
    
    if (response.ok && data.success) {
      logSuccess(`Health Check: ${data.message}`);
      return { success: true, data };
    } else {
      logError(`Health Check falhou: ${data.message || 'Resposta inválida'}`);
      return { success: false, error: data.message };
    }
  } catch (error) {
    logError(`Health Check falhou: ${error.message}`);
    return { success: false, error: error.message };
  }
}

async function testApiRoot() {
  logInfo('Testando API Root...');
  try {
    const response = await fetch(`${BACKEND_URL}/`);
    const data = await response.json();
    
    if (response.ok && data.success) {
      logSuccess(`API Root: ${data.message}`);
      return { success: true, data };
    } else {
      logError(`API Root falhou: ${data.message || 'Resposta inválida'}`);
      return { success: false, error: data.message };
    }
  } catch (error) {
    logError(`API Root falhou: ${error.message}`);
    return { success: false, error: error.message };
  }
}

async function testAuthEndpoints() {
  logInfo('Testando endpoints de autenticação...');
  
  // Teste de login com credenciais inválidas (deve falhar)
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@invalid.com',
        senha: 'invalidpassword'
      })
    });
    
    const data = await response.json();
    
    if (response.status === 401 || response.status === 400) {
      logSuccess('Endpoint de login responde corretamente para credenciais inválidas');
    } else {
      logWarning(`Endpoint de login retornou status inesperado: ${response.status}`);
    }
  } catch (error) {
    logError(`Erro ao testar login: ${error.message}`);
  }

  // Teste de registro com dados inválidos (deve falhar)
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nome: '',
        email: 'invalid-email',
        senha: '123'
      })
    });
    
    const data = await response.json();
    
    if (response.status === 400) {
      logSuccess('Endpoint de registro valida dados corretamente');
    } else {
      logWarning(`Endpoint de registro retornou status inesperado: ${response.status}`);
    }
  } catch (error) {
    logError(`Erro ao testar registro: ${error.message}`);
  }
}

async function testCORS() {
  logInfo('Testando CORS...');
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'OPTIONS',
      headers: {
        'Origin': 'http://localhost:3000',
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'Content-Type'
      }
    });
    
    const corsHeaders = {
      'Access-Control-Allow-Origin': response.headers.get('Access-Control-Allow-Origin'),
      'Access-Control-Allow-Methods': response.headers.get('Access-Control-Allow-Methods'),
      'Access-Control-Allow-Headers': response.headers.get('Access-Control-Allow-Headers')
    };
    
    if (corsHeaders['Access-Control-Allow-Origin']) {
      logSuccess('CORS configurado corretamente');
      logInfo(`Origin permitido: ${corsHeaders['Access-Control-Allow-Origin']}`);
    } else {
      logWarning('CORS pode não estar configurado corretamente');
    }
  } catch (error) {
    logError(`Erro ao testar CORS: ${error.message}`);
  }
}

async function testRateLimit() {
  logInfo('Testando Rate Limiting...');
  try {
    const promises = [];
    for (let i = 0; i < 5; i++) {
      promises.push(fetch(`${BACKEND_URL}/health`));
    }
    
    const responses = await Promise.all(promises);
    const successCount = responses.filter(r => r.ok).length;
    
    if (successCount === 5) {
      logSuccess('Rate limiting não está bloqueando requisições normais');
    } else {
      logWarning(`Algumas requisições foram bloqueadas: ${successCount}/5`);
    }
  } catch (error) {
    logError(`Erro ao testar rate limiting: ${error.message}`);
  }
}

async function runAllTests() {
  log('\n🚀 Iniciando testes de comunicação Frontend ↔ Backend\n', 'bright');
  
  const results = {
    healthCheck: await testHealthCheck(),
    apiRoot: await testApiRoot(),
    cors: await testCORS(),
    rateLimit: await testRateLimit()
  };
  
  await testAuthEndpoints();
  
  log('\n📊 Resumo dos Testes:\n', 'bright');
  
  const tests = [
    { name: 'Health Check', result: results.healthCheck },
    { name: 'API Root', result: results.apiRoot },
    { name: 'CORS', result: results.cors },
    { name: 'Rate Limiting', result: results.rateLimit }
  ];
  
  let successCount = 0;
  tests.forEach(test => {
    if (test.result.success) {
      logSuccess(`${test.name}: PASSOU`);
      successCount++;
    } else {
      logError(`${test.name}: FALHOU - ${test.result.error || 'Erro desconhecido'}`);
    }
  });
  
  log(`\n🎯 Resultado Final: ${successCount}/${tests.length} testes passaram\n`, 'bright');
  
  if (successCount === tests.length) {
    logSuccess('🎉 Todos os testes passaram! A comunicação está funcionando corretamente.');
  } else if (successCount > tests.length / 2) {
    logWarning('⚠️  Alguns testes falharam, mas a comunicação básica está funcionando.');
  } else {
    logError('❌ Muitos testes falharam. Verifique se o backend está rodando corretamente.');
  }
  
  log('\n💡 Próximos passos:', 'cyan');
  log('1. Certifique-se de que o backend está rodando na porta 4000', 'cyan');
  log('2. Verifique se não há conflitos de porta', 'cyan');
  log('3. Teste a interface web em http://localhost:3000', 'cyan');
  log('4. Use o painel de teste na página principal para testes interativos\n', 'cyan');
}

// Verificar se o node-fetch está disponível
try {
  require('node-fetch');
} catch (error) {
  logError('node-fetch não está instalado. Execute: npm install node-fetch');
  process.exit(1);
}

// Executar os testes
runAllTests().catch(error => {
  logError(`Erro fatal: ${error.message}`);
  process.exit(1);
});
