#!/bin/bash
set -e

echo "Setting up development environment..."

# Update npm to latest version for better override support
echo "Updating npm..."
npm install -g npm@latest

# Clean any existing node_modules and package-lock
echo "Cleaning previous installation artifacts..."
rm -rf node_modules package-lock.json

# Clear npm cache to avoid conflicts
echo "Clearing npm cache..."
npm cache clean --force

# Install dependencies
echo "Installing dependencies (this may take a few minutes)..."
npm install --legacy-peer-deps

# Wait for database to be ready
echo "Waiting for database..."
until pg_isready -h localhost -p 5432 -U postgres; do
  echo "Database is unavailable - sleeping"
  sleep 2
done

echo "Database is ready!"

# Generate Prisma Client
echo "Generating Prisma client..."
npm run db:generate

# Run migrations
echo "Running database migrations..."
npm run db:migrate:deploy

# Seed database (optional, will fail gracefully if seed doesn't exist)
echo "Seeding database..."
npm run db:seed || echo "Seeding skipped or failed (this is okay)"

echo "Setup complete! You can now run 'npm run dev' to start the development server."


