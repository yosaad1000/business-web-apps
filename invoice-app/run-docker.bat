@echo off
echo Starting Invoice Processing Application with Docker...
echo.

echo Stopping any existing containers...
docker-compose down

echo Building and starting containers...
docker-compose up --build

echo.
echo Application should be available at:
echo Frontend: http://localhost:3000
echo Backend API: http://localhost:8080
echo MySQL: localhost:3306