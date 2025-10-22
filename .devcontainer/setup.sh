#!/bin/bash
set -e

echo "Setting up development environment..."

# Install pnpm globally
echo "Installing pnpm..."
npm install -g pnpm@latest

# Clean any existing node_modules and lock files
echo "Cleaning previous installation artifacts..."
rm -rf node_modules package-lock.json pnpm-lock.yaml

# Install dependencies
echo "Installing dependencies with pnpm (this may take a few minutes)..."
pnpm install

# Wait for database to be ready
echo "Waiting for database..."
until pg_isready -h localhost -p 5432 -U postgres; do
  echo "Database is unavailable - sleeping"
  sleep 2
done

echo "Database is ready!"

# Generate Prisma Client
echo "Generating Prisma client..."
pnpm db:generate

# Run migrations
echo "Running database migrations..."
pnpm db:migrate:deploy

# Seed database (optional, will fail gracefully if seed doesn't exist)
echo "Seeding database..."
pnpm db:seed || echo "Seeding skipped or failed (this is okay)"

echo "Setup complete! You can now run 'pnpm dev' to start the development server."


