# Dev Container Setup

This devcontainer configuration provides a complete development environment that closely emulates the production Vercel/Supabase setup.

## Features

- **Node.js 20**: Latest LTS version
- **PostgreSQL 16**: Production-like database with optimized settings
- **pnpm**: Fast, disk space efficient package manager
- **Automatic Setup**: Dependencies install and database migrations run automatically

## Getting Started

### Prerequisites

- Docker Desktop installed
- VS Code with "Dev Containers" extension

### Starting the Dev Container

1. Open this project in VS Code
2. Press `Cmd+Shift+P` (Mac) or `Ctrl+Shift+P` (Windows/Linux)
3. Select "Dev Containers: Reopen in Container"
4. Wait for the container to build and initialize

The setup script will automatically:

- Install dependencies with pnpm
- Generate Prisma client
- Run database migrations
- Seed the database (if configured)

### Running the Development Server

Once the container is ready:

```bash
pnpm dev
```

The server will be available at `http://localhost:3000`

## Database

### Connection Details

- **Host**: `localhost` (from within the container)
- **Port**: `5432`
- **User**: `postgres`
- **Password**: `postgres`
- **Database**: `conspirafi`

The `DATABASE_URL` is automatically configured in the container.

### Working with Prisma

```bash
# Generate Prisma Client
pnpm db:generate

# Create a new migration
pnpm db:migrate -- --name your_migration_name

# Apply migrations
pnpm db:migrate:deploy

# Seed database
pnpm db:seed

# Open Prisma Studio
pnpm db:studio
```

### Accessing PostgreSQL

```bash
# Connect to PostgreSQL
psql postgresql://postgres:postgres@localhost:5432/conspirafi

# Or use the shorter form
psql -U postgres -d conspirafi
```

## Environment Variables

The devcontainer automatically sets:

- `DATABASE_URL`: PostgreSQL connection string
- `NODE_ENV`: Set to `development`

For other environment variables, create a `.env` file in the project root based on `.env.example`.

## Troubleshooting

### Database Connection Issues

If you can't connect to the database:

```bash
# Check if PostgreSQL is running
pg_isready -h localhost -p 5432 -U postgres

# Restart the database container
docker-compose -f .devcontainer/docker-compose.yml restart db
```

### Port Already in Use

If port 3000 or 5432 is already in use:

1. Stop any local processes using those ports
2. Rebuild the container: `Dev Containers: Rebuild Container`

### Reset Everything

To start fresh:

```bash
# From outside the container
docker-compose -f .devcontainer/docker-compose.yml down -v
```

Then rebuild the container in VS Code.

## Production Parity

This devcontainer is configured to match the production environment:

- **PostgreSQL 16**: Same version as Supabase
- **Connection Pooling**: Similar settings to PgBouncer
- **Node.js 20**: Same runtime as Vercel
- **Environment Variables**: Similar configuration to production

## Differences from Production

- **File Storage**: Uses local filesystem instead of Supabase Storage
- **Serverless**: Not serverless (but database settings are similar)
- **Scale**: Single container vs distributed system

For file uploads in production, configure Supabase Storage credentials in your environment variables.
