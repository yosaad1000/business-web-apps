@echo off
REM Unified ERP System Development Setup Script for Windows

echo 🚀 Setting up Unified ERP System for development...

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ first.
    exit /b 1
)

REM Check if Java is installed
java --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Java is not installed. Please install Java 17+ first.
    exit /b 1
)

REM Check if Docker is installed
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker is not installed. Please install Docker first.
    exit /b 1
)

echo ✅ Prerequisites check passed

REM Install root dependencies
echo 📦 Installing root dependencies...
npm install

echo 🔧 Development environment setup complete!
echo.
echo 📋 Next steps:
echo 1. Update .env file with your actual Supabase credentials
echo 2. Run 'npm run dev' to start development servers
echo 3. Run 'npm run docker:up' to start with Docker
echo.
echo 🌐 Application URLs:
echo    Frontend: http://localhost:3000
echo    API Gateway: http://localhost:8080
echo    Employee Service: http://localhost:8081
echo    Invoice Service: http://localhost:8082
echo    Quiz Service: http://localhost:8083
echo    Job Service: http://localhost:8084
echo    CRUD Service: http://localhost:8085

pause