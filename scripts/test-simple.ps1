# Script PowerShell simples para testar comunicação
# Execute com: .\scripts\test-simple.ps1

$BackendUrl = "http://localhost:4000"
$ApiUrl = "$BackendUrl/api"
$FrontendUrl = "http://localhost:3000"

Write-Host "=== TESTE DE COMUNICACAO FRONTEND <-> BACKEND ===" -ForegroundColor Cyan
Write-Host ""

# Teste 1: Health Check
Write-Host "1. Testando Health Check..." -ForegroundColor Blue
try {
    $response = Invoke-WebRequest -Uri "$BackendUrl/health" -UseBasicParsing -TimeoutSec 5
    Write-Host "   SUCESSO: Status $($response.StatusCode)" -ForegroundColor Green
    $healthOk = $true
} catch {
    Write-Host "   FALHOU: $($_.Exception.Message)" -ForegroundColor Red
    $healthOk = $false
}

# Teste 2: API Root
Write-Host "2. Testando API Root..." -ForegroundColor Blue
try {
    $response = Invoke-WebRequest -Uri "$BackendUrl/" -UseBasicParsing -TimeoutSec 5
    Write-Host "   SUCESSO: Status $($response.StatusCode)" -ForegroundColor Green
    $apiOk = $true
} catch {
    Write-Host "   FALHOU: $($_.Exception.Message)" -ForegroundColor Red
    $apiOk = $false
}

# Teste 3: Frontend
Write-Host "3. Testando Frontend..." -ForegroundColor Blue
try {
    $response = Invoke-WebRequest -Uri "$FrontendUrl" -UseBasicParsing -TimeoutSec 5
    Write-Host "   SUCESSO: Status $($response.StatusCode)" -ForegroundColor Green
    $frontendOk = $true
} catch {
    Write-Host "   FALHOU: $($_.Exception.Message)" -ForegroundColor Red
    $frontendOk = $false
}

# Teste 4: Login Endpoint
Write-Host "4. Testando Login Endpoint..." -ForegroundColor Blue
try {
    $body = @{
        email = "test@invalid.com"
        senha = "invalidpassword"
    } | ConvertTo-Json
    
    $response = Invoke-WebRequest -Uri "$ApiUrl/auth/login" -Method POST -Body $body -ContentType "application/json" -UseBasicParsing -TimeoutSec 5
    Write-Host "   SUCESSO: Status $($response.StatusCode)" -ForegroundColor Green
    $loginOk = $true
} catch {
    if ($_.Exception.Response.StatusCode -eq 401 -or $_.Exception.Response.StatusCode -eq 400) {
        Write-Host "   SUCESSO: Endpoint responde corretamente (Status: $($_.Exception.Response.StatusCode))" -ForegroundColor Green
        $loginOk = $true
    } else {
        Write-Host "   FALHOU: $($_.Exception.Message)" -ForegroundColor Red
        $loginOk = $false
    }
}

# Resumo
Write-Host ""
Write-Host "=== RESUMO DOS TESTES ===" -ForegroundColor Cyan
$totalTests = 4
$passedTests = 0

if ($healthOk) { $passedTests++ }
if ($apiOk) { $passedTests++ }
if ($frontendOk) { $passedTests++ }
if ($loginOk) { $passedTests++ }

Write-Host "Testes passaram: $passedTests/$totalTests" -ForegroundColor Yellow

if ($passedTests -eq $totalTests) {
    Write-Host "RESULTADO: TODOS OS TESTES PASSARAM!" -ForegroundColor Green
} elseif ($passedTests -gt ($totalTests / 2)) {
    Write-Host "RESULTADO: COMUNICACAO BASICA FUNCIONANDO" -ForegroundColor Yellow
} else {
    Write-Host "RESULTADO: PROBLEMAS NA COMUNICACAO" -ForegroundColor Red
}

Write-Host ""
Write-Host "=== INFORMACOES DOS SERVICOS ===" -ForegroundColor Cyan
Write-Host "Frontend: $FrontendUrl"
Write-Host "Backend: $BackendUrl"
Write-Host "API: $ApiUrl"

Write-Host ""
Write-Host "=== PROXIMOS PASSOS ===" -ForegroundColor Cyan
Write-Host "1. Acesse $FrontendUrl no navegador"
Write-Host "2. Use o painel de teste na pagina principal"
Write-Host "3. Teste o login com: demo@zelo.com / demo123"

