# Script PowerShell para testar comunicação Frontend ↔ Backend
# Execute com: .\scripts\test-communication.ps1

$BackendUrl = "http://localhost:4000"
$ApiUrl = "$BackendUrl/api"
$FrontendUrl = "http://localhost:3000"

Write-Host "🚀 Iniciando testes de comunicação Frontend ↔ Backend" -ForegroundColor Cyan
Write-Host ""

# Função para testar endpoint
function Test-Endpoint {
    param(
        [string]$Url,
        [string]$Name,
        [string]$Method = "GET",
        [hashtable]$Body = $null
    )
    
    Write-Host "ℹ️  Testando $Name..." -ForegroundColor Blue
    
    try {
        $params = @{
            Uri = $Url
            Method = $Method
            UseBasicParsing = $true
            TimeoutSec = 10
        }
        
        if ($Body) {
            $params.Body = ($Body | ConvertTo-Json)
            $params.ContentType = "application/json"
        }
        
        $response = Invoke-WebRequest @params
        
        if ($response.StatusCode -eq 200 -or $response.StatusCode -eq 201) {
            Write-Host "✅ $Name: PASSOU (Status: $($response.StatusCode))" -ForegroundColor Green
            return @{ Success = $true; StatusCode = $response.StatusCode; Content = $response.Content }
        } else {
            Write-Host "⚠️  $Name: Status inesperado $($response.StatusCode)" -ForegroundColor Yellow
            return @{ Success = $false; StatusCode = $response.StatusCode; Error = "Status inesperado" }
        }
    }
    catch {
        Write-Host "❌ $Name: FALHOU - $($_.Exception.Message)" -ForegroundColor Red
        return @{ Success = $false; Error = $_.Exception.Message }
    }
}

# Teste 1: Health Check
$healthResult = Test-Endpoint -Url "$BackendUrl/health" -Name "Health Check"

# Teste 2: API Root
$apiRootResult = Test-Endpoint -Url "$BackendUrl/" -Name "API Root"

# Teste 3: Frontend
$frontendResult = Test-Endpoint -Url "$FrontendUrl" -Name "Frontend"

# Teste 4: Endpoint de Login (deve falhar com credenciais inválidas)
$loginResult = Test-Endpoint -Url "$ApiUrl/auth/login" -Name "Login Endpoint" -Method "POST" -Body @{
    email = "test@invalid.com"
    senha = "invalidpassword"
}

# Teste 5: CORS
Write-Host "ℹ️  Testando CORS..." -ForegroundColor Blue
try {
    $corsResponse = Invoke-WebRequest -Uri "$ApiUrl/auth/login" -Method "OPTIONS" -UseBasicParsing -Headers @{
        "Origin" = $FrontendUrl
        "Access-Control-Request-Method" = "POST"
        "Access-Control-Request-Headers" = "Content-Type"
    }
    
    $corsOrigin = $corsResponse.Headers["Access-Control-Allow-Origin"]
    if ($corsOrigin) {
        Write-Host "✅ CORS: PASSOU (Origin: $corsOrigin)" -ForegroundColor Green
        $corsSuccess = $true
    } else {
        Write-Host "⚠️  CORS: Pode não estar configurado corretamente" -ForegroundColor Yellow
        $corsSuccess = $false
    }
}
catch {
    Write-Host "❌ CORS: FALHOU - $($_.Exception.Message)" -ForegroundColor Red
    $corsSuccess = $false
}

# Resumo dos resultados
Write-Host ""
Write-Host "📊 Resumo dos Testes:" -ForegroundColor Cyan
Write-Host ""

$tests = @(
    @{ Name = "Health Check"; Result = $healthResult },
    @{ Name = "API Root"; Result = $apiRootResult },
    @{ Name = "Frontend"; Result = $frontendResult },
    @{ Name = "Login Endpoint"; Result = $loginResult },
    @{ Name = "CORS"; Result = @{ Success = $corsSuccess } }
)

$successCount = 0
foreach ($test in $tests) {
    if ($test.Result.Success) {
        Write-Host "✅ $($test.Name): PASSOU" -ForegroundColor Green
        $successCount++
    } else {
        Write-Host "❌ $($test.Name): FALHOU" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "🎯 Resultado Final: $successCount/$($tests.Count) testes passaram" -ForegroundColor Cyan

if ($successCount -eq $tests.Count) {
    Write-Host "🎉 Todos os testes passaram! A comunicação está funcionando corretamente." -ForegroundColor Green
} elseif ($successCount -gt ($tests.Count / 2)) {
    Write-Host "⚠️  Alguns testes falharam, mas a comunicação básica está funcionando." -ForegroundColor Yellow
} else {
    Write-Host "❌ Muitos testes falharam. Verifique se os serviços estão rodando corretamente." -ForegroundColor Red
}

Write-Host ""
Write-Host "💡 Informações dos Serviços:" -ForegroundColor Cyan
Write-Host "Frontend: $FrontendUrl" -ForegroundColor White
Write-Host "Backend: $BackendUrl" -ForegroundColor White
Write-Host "API: $ApiUrl" -ForegroundColor White

Write-Host ""
Write-Host "🔧 Próximos passos:" -ForegroundColor Cyan
Write-Host "1. Acesse $FrontendUrl no navegador" -ForegroundColor White
Write-Host "2. Use o painel de teste na página principal" -ForegroundColor White
Write-Host "3. Teste o login com: demo@zelo.com / demo123" -ForegroundColor White

