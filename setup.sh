#!/bin/bash

# Stack Platform Setup Script
# This script helps set up the Stack platform services

echo "Setting up Stack platform services..."

# Create necessary directories
mkdir -p ./uploads

# Install dependencies for all services
echo "Installing dependencies for all services..."

# Auth Service
echo "Setting up Auth Service..."
cd ./services/auth-service
npm install
cd ../..

# User Service
echo "Setting up User Service..."
cd ./services/user-service
npm install
cd ../..

# Meeting Service
echo "Setting up Meeting Service..."
cd ./services/meeting-service
npm install
cd ../..

# Task Service
echo "Setting up Task Service..."
cd ./services/task-service
npm install
cd ../..

# Frontend
echo "Setting up Frontend..."
cd ./frontend
npm install
cd ..

echo "Creating environment files from examples..."
# Copy example env files to actual env files if they don't exist
for service in auth-service user-service meeting-service task-service; do
  if [ -f "./services/$service/.env.example" ] && [ ! -f "./services/$service/.env" ]; then
    cp "./services/$service/.env.example" "./services/$service/.env"
    echo "Created .env file for $service"
  fi
done

echo "Setup complete! You can now start the services using:"
echo "  - For development: Run 'npm run dev' in each service directory"
echo "  - For Docker: Run 'docker-compose up'"
echo ""
echo "Available services:"
echo "  - Frontend: http://localhost:3000"
echo "  - Auth Service: http://localhost:3001"
echo "  - User Service: http://localhost:3002"
echo "  - Meeting Service: http://localhost:3003"
echo "  - Task Service: http://localhost:3004"
