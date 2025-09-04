#!/bin/bash

# Unified ERP System Development Setup Script

echo "🚀 Setting up Unified ERP System for development..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check if Java is installed
if ! command -v java &> /dev/null; then
    echo "❌ Java is not installed. Please install Java 17+ first."
    exit 1
fi

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

echo "✅ Prerequisites check passed"

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install

# Create Maven wrapper for services (if not exists)
if [ ! -f "gateway/mvnw" ]; then
    echo "📦 Setting up Maven wrapper..."
    cd gateway && mvn -N io.takari:maven:wrapper && cd ..
fi

echo "🔧 Development environment setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Update .env file with your actual Supabase credentials"
echo "2. Run 'npm run dev' to start development servers"
echo "3. Run 'npm run docker:up' to start with Docker"
echo ""
echo "🌐 Application URLs:"
echo "   Frontend: http://localhost:3000"
echo "   API Gateway: http://localhost:8080"
echo "   Employee Service: http://localhost:8081"
echo "   Invoice Service: http://localhost:8082"
echo "   Quiz Service: http://localhost:8083"
echo "   Job Service: http://localhost:8084"
echo "   CRUD Service: http://localhost:8085"