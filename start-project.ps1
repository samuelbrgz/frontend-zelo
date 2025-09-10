# Script para iniciar o projeto Zelo completo
# Execute com: .\start-project.ps1

Write-Host "=== INICIANDO PROJETO ZELO ===" -ForegroundColor Cyan
Write-Host ""

# Parar processos Node.js existentes
Write-Host "Parando processos Node.js existentes..." -ForegroundColor Yellow
Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2

# Verificar se estamos no diretório correto
if (-not (Test-Path "package.json")) {
    Write-Host "ERRO: Execute este script no diretório raiz do projeto (frontend-zelo)" -ForegroundColor Red
    exit 1
}

# Iniciar Frontend
Write-Host "Iniciando Frontend..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; npm run dev"

# Aguardar um pouco
Start-Sleep -Seconds 3

# Iniciar Backend
Write-Host "Iniciando Backend..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\backend-zelo'; npm run dev"

# Aguardar os serviços iniciarem
Write-Host "Aguardando serviços iniciarem..." -ForegroundColor Yellow
Start-Sleep -Seconds 8

# Abrir navegadores
Write-Host "Abrindo navegadores..." -ForegroundColor Cyan
Start-Process "http://localhost:3000"
Start-Sleep -Seconds 2
Start-Process "http://localhost:4000/health"

Write-Host ""
Write-Host "=== PROJETO INICIADO ===" -ForegroundColor Green
Write-Host "Frontend: http://localhost:3000" -ForegroundColor White
Write-Host "Backend: http://localhost:4000" -ForegroundColor White
Write-Host "API Docs: http://localhost:4000/api-docs" -ForegroundColor White
Write-Host ""
Write-Host "Para testar a comunicação:" -ForegroundColor Cyan
Write-Host "1. Acesse http://localhost:3000" -ForegroundColor White
Write-Host "2. Role até 'Teste de Comunicação'" -ForegroundColor White
Write-Host "3. Clique em 'Testar Comunicação'" -ForegroundColor White
Write-Host ""
Write-Host "Credenciais de teste:" -ForegroundColor Cyan
Write-Host "Email: demo@zelo.com" -ForegroundColor White
Write-Host "Senha: demo123" -ForegroundColor White

