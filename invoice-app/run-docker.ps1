Write-Host "Starting Invoice Processing Application with Docker..." -ForegroundColor Green
Write-Host ""

Write-Host "Stopping any existing containers..." -ForegroundColor Yellow
docker-compose down

Write-Host "Building and starting containers..." -ForegroundColor Yellow
docker-compose up --build

Write-Host ""
Write-Host "Application should be available at:" -ForegroundColor Green
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "Backend API: http://localhost:8080" -ForegroundColor Cyan
Write-Host "MySQL: localhost:3306" -ForegroundColor Cyan