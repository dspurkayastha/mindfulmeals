#!/bin/bash

# MindfulMeals Deployment Script
echo "🍽️  Deploying MindfulMeals..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

# Build and start services
echo "🏗️  Building and starting services..."
cd "$(dirname "$0")/../docker"
docker-compose up -d --build

# Wait for services to be healthy
echo "⏳ Waiting for services to be healthy..."
sleep 10

# Check service status
echo "🔍 Checking service status..."
docker-compose ps

echo "✅ MindfulMeals deployment complete!"
echo "🌐 Backend API: http://localhost:3000"
echo "🗄️  Database: localhost:5432"
echo "📱 Mobile app: Run 'npm run start:mobile' in mobile-app directory"

# Show logs
echo "📋 Recent logs:"
docker-compose logs --tail=20
