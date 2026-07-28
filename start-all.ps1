param(
  [switch]$InstallDependencies
)

$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$frontend = Join-Path $root 'frontend'
$nodeBackend = Join-Path $root 'node-backend'
$djangoMain = Join-Path $root 'backend'
$djangoML = Join-Path $root 'django-ml-service'

$mainVenv = Join-Path $djangoMain '.venv'
$mlVenv = Join-Path $djangoML '.venv'

$mainPython = Join-Path $mainVenv 'Scripts\python.exe'
$mlPython = Join-Path $mlVenv 'Scripts\python.exe'

function Start-StackService {
  param(
    [string]$Name,
    [string]$Path,
    [string]$Command
  )

  Write-Host "Starting $Name..." -ForegroundColor Cyan
  Start-Process -FilePath 'powershell' -ArgumentList @('-NoExit', '-ExecutionPolicy', 'Bypass', '-Command', "Set-Location '$Path'; $Command")
}

if ($InstallDependencies) {
  # Node Backend Dependencies
  if (Test-Path (Join-Path $nodeBackend 'package.json')) {
    Write-Host "Installing Node API Gateway dependencies..." -ForegroundColor Cyan
    Push-Location $nodeBackend
    npm install
    Pop-Location
  }

  # Frontend Dependencies
  if (Test-Path (Join-Path $frontend 'package.json')) {
    Write-Host "Installing Frontend dependencies..." -ForegroundColor Cyan
    Push-Location $frontend
    npm install
    Pop-Location
  }

  # Django Main Backend Virtualenv & Dependencies (using sqlparse bypass)
  Write-Host "Setting up Django Main Backend virtual environment..." -ForegroundColor Cyan
  if (-not (Test-Path $mainVenv)) {
    python -m venv $mainVenv
  }
  & $mainPython -m pip install --upgrade pip
  & $mainPython -m pip install "Django>=4.2,<5.0" "djangorestframework>=3.14" "pymongo>=4.6.0" "djangorestframework-simplejwt>=5.2.2" "django-cors-headers>=4.2.0" "channels>=4.0.0" "daphne>=4.0.0" "channels-redis>=4.1.0" "python-dotenv" "pytz"
  & $mainPython -m pip install "djongo>=1.3.6" --no-deps

  # Django ML Recommender Virtualenv & Dependencies (using sqlparse bypass)
  Write-Host "Setting up Django ML Recommender virtual environment..." -ForegroundColor Cyan
  if (-not (Test-Path $mlVenv)) {
    python -m venv $mlVenv
  }
  & $mlPython -m pip install --upgrade pip
  & $mlPython -m pip install "Django>=5.0,<6.0" "pandas>=2.2.0" "numpy>=1.26.0" "scikit-learn>=1.5.0" "pymongo" "pytz"
  & $mlPython -m pip install "djongo>=1.3.6" --no-deps
}

# Verify environments exist before starting
if (-not (Test-Path $mainPython)) {
  Write-Error "Django Main virtual environment Python not found. Please run with -InstallDependencies."
}
if (-not (Test-Path $mlPython)) {
  Write-Error "Django ML virtual environment Python not found. Please run with -InstallDependencies."
}

# Start Stack Services
Start-StackService -Name 'Node API Gateway' -Path $nodeBackend -Command 'npm run dev'
Start-StackService -Name 'Frontend' -Path $frontend -Command 'npm run dev -- --host 0.0.0.0'
Start-StackService -Name 'Django Main Backend' -Path $djangoMain -Command "& '$mainPython' -u manage.py runserver 8000"
Start-StackService -Name 'Django ML Recommender' -Path $djangoML -Command "& '$mlPython' -u manage.py runserver 8002"

Write-Host 'NovaTunes services launched in separate terminals.' -ForegroundColor Green
Write-Host 'Frontend:            http://localhost:5173' -ForegroundColor Green
Write-Host 'Node API Gateway:    http://localhost:5000' -ForegroundColor Green
Write-Host 'Django Main Backend: http://localhost:8000' -ForegroundColor Green
Write-Host 'Django ML Service:   http://localhost:8002' -ForegroundColor Green