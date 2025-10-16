# Conspira.fi

> **Every week, a new conspiracy becomes a market. Prediction markets cut through the noise. Every signal strengthens the symbol: $MOCK.**

Conspira.fi is a prediction market platform that transforms conspiracy theories into tradeable markets on Solana, powered by PMX.

🌐 **Live:** [conspira.fi](https://conspira.fi)

## 🚀 Quick Start

### Prerequisites

- **Node.js 18+** (we recommend using [nvm](https://github.com/nvm-sh/nvm))
- **npm 9+** (comes with Node.js)
- **API Keys** (see Getting API Keys section below)

### Development Options

You have two ways to set up the development environment:

#### Option A: Dev Container (Recommended)

The easiest way to get started with a production-like environment using Docker:

**Prerequisites:**
- Docker Desktop
- VS Code with "Dev Containers" extension

**Setup:**
1. Open this project in VS Code
2. Press `Cmd+Shift+P` (Mac) or `Ctrl+Shift+P` (Windows/Linux)
3. Select "Dev Containers: Reopen in Container"
4. Wait for automatic setup (dependencies, database, migrations)
5. Run `npm run dev` when ready

✨ Benefits:
- PostgreSQL 16 (same as production)
- Automatic database setup
- Production-like environment
- No local PostgreSQL installation needed

See [.devcontainer/README.md](.devcontainer/README.md) for detailed documentation.

#### Option B: Local Development Setup

1. **Clone and Install Dependencies**
```bash
git clone https://github.com/yourusername/conspira.fi.git
cd conspira.fi
npm install --legacy-peer-deps
```

2. **Set Up Environment Variables**
```bash
# Create .env file
touch .env

# Add your environment variables (see Environment Variables section below)
# Or copy from .env.example if it exists:
# cp .env.example .env
```

3. **Initialize Database**
```bash
# Generate Prisma client
npm run db:generate

# Run migrations to create database schema
npm run db:migrate

# Seed database with initial data (creates example market)
npm run db:seed
```

4. **Start Development Server**
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

### Getting API Keys

1. **Twitter API v2**
   - Go to [Twitter Developer Portal](https://developer.twitter.com)
   - Create a project and app
   - Generate Bearer Token under "Keys and tokens"

2. **PMX Platform API**
   - Contact PMX team for API access
   - You'll receive API key and authorization token

3. **xAI API** (Optional)
   - Visit [x.ai](https://x.ai) for API access
   - Only needed for AI-powered features

### Environment Variables

Create a `.env` file with the following variables:

```env
# Database 
# For local development with SQLite:
DATABASE_URL="file:./prisma/dev.db"
# For local development with devcontainer (PostgreSQL):
# DATABASE_URL="postgresql://postgres:postgres@localhost:5432/conspirafi?schema=public"
# For production with PostgreSQL (Supabase):
# DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@[project-ref].supabase.co:5432/postgres?pgbouncer=true&connection_limit=1"

# Admin Panel Password
ADMIN_PASSWORD="your-secure-password"

# Twitter API v2 (Required for tweet fetching)
TWITTER_BEARER_TOKEN="your_bearer_token"

# xAI API (Optional - for AI features)
XAI_API_KEY="your_xai_api_key"

# PMX Platform API (Required for market data)
PMX_API_KEY="your_pmx_api_key"
PMX_API_AUTHORIZATION="your_pmx_auth_token"
PMX_BASE_URL="https://xqdrbspnwgjvzvgzulls.supabase.co/rest/v1/"
PMX_FEES_BASE_URL="https://backend-production-2715.up.railway.app/api/"

# Historic Prices API (Required for price charts)
HISTORIC_PRICES_API_URL="https://streamer-production-3d21.up.railway.app/api/prices/"

# Supabase (Optional - for file uploads in production)
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
```

## 🔐 Admin Panel

The admin panel allows you to manage multiple prediction markets, videos, and conspiracy leaks.

### Accessing Admin Panel

1. Navigate to `http://localhost:3000/admin/login`
2. Enter your `ADMIN_PASSWORD`
3. You'll see the dashboard with Markets, Videos, and Leaks sections

### Key Features

- **Multi-Market Support**: Manage multiple prediction markets simultaneously
- **Drag & Drop Reordering**: Easily reorder videos and leaks
- **Auto-Metadata Fetching**: Paste a URL and metadata (title, image) is auto-populated
- **Image Uploads**: Upload custom images for leaks
- **Market Preview**: Preview markets before making them live
- **Validation**: Markets require at least 1 video and 1 leak before activation

### Creating a New Market

1. **Create Market**
   - Click "Create" in Markets section
   - Fill in required fields:
     - **Name**: Short display name (e.g., "UFO DISCLOSURE")
     - **Event Title**: The prediction question
     - **Event Description**: Detailed explanation
     - **Market Slug**: Copy from PMX market URL
     - **Market End Time**: When the market resolves
     - **Tweet Search Phrase**: Twitter search term
     - **Token Mints**: YES and NO token addresses from Solana
   - Optional: Add PMX and Jupiter links
   - Keep "Active" unchecked initially

2. **Add Video**
   - After creating market, click "Add Video" button
   - Paste video URL (YouTube, etc.)
   - Videos auto-play in the UI

3. **Add Leaks**
   - Click "Add Leak" button
   - Select type (YouTube, Article, Podcast)
   - Paste URL - metadata auto-fetches
   - Optionally upload custom image
   - Set date (defaults to today)

4. **Activate Market**
   - Once you have at least 1 video and 1 leak
   - Edit market and check "Active"
   - Market will appear on the main site

### Preview Mode

Test markets before going live:
- Use the "Preview Market" button in admin
- Or visit: `http://localhost:3000/?preview=MARKET_ID`

## 🚀 Production Deployment (Vercel + Supabase)

For detailed deployment instructions, see **[docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)**

### Quick Deployment Guide

1. **Set up Supabase Database**
   - Create a Supabase project
   - Get the connection string with `pgbouncer=true&connection_limit=1`
   - Run migrations: `npm run db:migrate:deploy`

2. **Configure Supabase Storage (for image uploads)**
   - Create `admin-uploads` bucket
   - Set up public access policies
   - Get API credentials

3. **Deploy to Vercel**
   - Connect your repository
   - Set environment variables (see below)
   - Deploy automatically on push

4. **Environment Variables in Vercel**

```env
# Database (IMPORTANT: use connection pooling)
DATABASE_URL="postgresql://postgres:[password]@[project-ref].supabase.co:5432/postgres?pgbouncer=true&connection_limit=1"

# Supabase Storage (for persistent file uploads)
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

# Admin Panel
ADMIN_PASSWORD="use-a-very-secure-password-here"

# APIs (same as local)
TWITTER_BEARER_TOKEN="your_production_bearer_token"
XAI_API_KEY="your_production_xai_key"
PMX_API_KEY="your_production_pmx_key"
PMX_API_AUTHORIZATION="your_production_pmx_auth"
PMX_BASE_URL="https://xqdrbspnwgjvzvgzulls.supabase.co/rest/v1/"
PMX_FEES_BASE_URL="https://backend-production-2715.up.railway.app/api/"
HISTORIC_PRICES_API_URL="https://streamer-production-3d21.up.railway.app/api/prices/"
```

### Troubleshooting Production Issues

**"Prepared statement already exists" error:**
- Ensure `DATABASE_URL` includes `pgbouncer=true&connection_limit=1`
- See [docs/DATABASE_CONNECTION.md](docs/DATABASE_CONNECTION.md) for detailed solutions

**Image uploads failing (500 error):**
- Configure Supabase Storage (recommended for production)
- Without Supabase Storage, uploads use `/tmp` (ephemeral on Vercel)
- See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for Supabase Storage setup

## 🛠️ Database Commands

```bash
# Development
npm run db:generate           # Generate Prisma client
npm run db:migrate            # Create and apply migrations
npm run db:migrate -- --reset # Reset database (WARNING: deletes all data)
npm run db:studio             # Open GUI to view/edit data
npm run db:seed               # Seed database with initial data

# Production
npm run db:migrate:deploy     # Apply migrations in production
```

## 💻 Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Admin Panel**: React Admin + Shadcn UI
- **Database**: Prisma ORM, SQLite (dev), PostgreSQL (prod)
- **API**: tRPC for type-safe APIs
- **State Management**: Zustand, TanStack Query
- **Authentication**: HTTP-only cookies for admin
- **File Uploads**: Next.js API routes
- **External APIs**: Twitter v2, PMX Platform, xAI

## 📁 Project Structure

```
conspira.fi/
├── prisma/
│   ├── schema.prisma     # Database schema
│   ├── migrations/       # Database migrations
│   └── seed.ts          # Seed data
├── public/
│   ├── admin-uploads/   # Uploaded images
│   └── fonts/           # Custom fonts
├── src/
│   ├── app/
│   │   ├── _components/ # Reusable UI components
│   │   ├── (main)/      # Main app routes
│   │   ├── admin/       # Admin panel
│   │   ├── api/         # API routes
│   │   └── providers/   # React context providers
│   ├── server/
│   │   ├── api/routers/ # tRPC routers
│   │   │   ├── admin.ts     # Admin CRUD operations
│   │   │   ├── pmx_market.tsx # PMX market data
│   │   │   └── metadata.ts  # URL metadata fetching
│   │   ├── lib/         # Server utilities
│   │   └── db.ts       # Prisma client instance
│   └── trpc/           # tRPC client configuration
├── .env                # Environment variables
└── package.json        # Dependencies
```

## 🔧 Troubleshooting

### Common Issues

**Admin login not working**
- Ensure `ADMIN_PASSWORD` is set in `.env`
- Check browser console for errors
- Try clearing cookies

**Tweets not loading**
- Verify `TWITTER_BEARER_TOKEN` is valid
- Check rate limits (300 requests/15min)
- Look for errors in server logs

**Database errors**
- Run `npx prisma generate` after schema changes
- Ensure migrations are up to date: `npx prisma migrate dev`
- For production: check connection string format

**Preview not showing market**
- Ensure market is saved in database
- Check if market has `isActive: true`
- Verify market ID in URL is correct

## 🚢 Deployment Checklist

- [ ] All environment variables set in Vercel
- [ ] Database migrations applied
- [ ] Admin password is secure
- [ ] API keys are production keys
- [ ] First market created and tested
- [ ] Preview mode tested
- [ ] Mobile responsiveness verified

## 📚 Additional Resources

- [PMX Platform Docs](https://docs.pmx.trade)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [React Admin](https://marmelab.com/react-admin/)

## 🔗 Links

- **Live Site**: [conspira.fi](https://conspira.fi)
- **Twitter**: [@agent_mock](https://twitter.com/agent_mock)
- **$MOCK Token**: [View on DexScreener](https://dexscreener.com/solana/ee7o1zq7w5c65aapgvjnq4pa7lxhhaigjnjohqarvbcx)
- **PMX Platform**: [pmx.trade](https://pmx.trade)

---

Built with ❤️ using the [T3 Stack](https://create.t3.gg/) | Powered by Agent $MOCK
