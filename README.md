# Conspira.fi

> **Every week, a new conspiracy becomes a market. Prediction markets cut through the noise. Every signal strengthens the symbol: $MOCK.**

Conspira.fi is a prediction market platform that transforms conspiracy theories into tradeable markets on Solana, powered by PMX.

🌐 **Live:** [conspira.fi](https://conspira.fi)

## 🚀 Quick Start

### Prerequisites

- **Node.js 18+** (we recommend using [nvm](https://github.com/nvm-sh/nvm))
- **pnpm 8+** - Fast, disk space efficient package manager
  ```bash
  npm install -g pnpm
  ```
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
5. Run `pnpm dev` when ready

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
pnpm install
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
pnpm db:generate

# Run migrations to create database schema
pnpm db:migrate

# Seed database with initial data (creates example market)
pnpm db:seed
```

4. **Start Development Server**

```bash
pnpm dev
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
     - **Market Slug**: Copy from PMX market URL (must match exactly)
     - **Market End Time**: When the market resolves
     - **Tweet Search Phrase**: Twitter search term
     - **Token Mints**: Leave empty - they auto-sync when market goes live on PMX
     - **Volume Percentage**: Defaults to 33.33% (customize if needed)
   - Optional: Add PMX link
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

5. **Token Mints Auto-Sync** ✨
   - When your market transitions from presale to active on PMX
   - Token mints (YES/NO contract addresses) automatically sync
   - Jupiter swap links generate automatically
   - No manual configuration needed!

### Preview Mode

Test markets before going live:

- Use the "Preview Market" button in admin
- Or visit: `http://localhost:3000/preview/MARKET_ID`

### Direct Market Access

Share specific markets with clean URLs:

- Visit: `http://localhost:3000/m/MARKET_SLUG`
- Example: `http://localhost:3000/m/will-comet-3iatlas-show-evidence-of-alien-technology-20250926084948`

## 🚀 Production Deployment (Railway)

For detailed deployment instructions, see **[docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)**

### Quick Deployment Guide

1. **Set up Railway Account**
   - Sign up at [railway.app](https://railway.app)
   - Connect your GitHub repository
   - Railway will auto-detect Next.js

2. **Add PostgreSQL Database**
   - Click "New" → "Database" → "Add PostgreSQL"
   - Railway automatically sets `DATABASE_URL`
   - Run migrations: `pnpm db:migrate:deploy`

3. **Configure Persistent Volume (for image uploads)**
   - Go to "Settings" → "Volumes" → "New Volume"
   - Mount path: `/app/public/admin-uploads`
   - Capacity: 1GB (adjust as needed)

4. **Set Environment Variables**

```env
# Database (automatically set by Railway)
DATABASE_URL=${{Postgres.DATABASE_URL}}

# Admin Panel
ADMIN_PASSWORD="use-a-very-secure-password-here"

# APIs
TWITTER_BEARER_TOKEN="your_production_bearer_token"
XAI_API_KEY="your_production_xai_key"
PMX_API_KEY="your_production_pmx_key"
PMX_API_AUTHORIZATION="your_production_pmx_auth"
PMX_BASE_URL="https://xqdrbspnwgjvzvgzulls.supabase.co/rest/v1/"
PMX_FEES_BASE_URL="https://backend-production-2715.up.railway.app/api/"
HISTORIC_PRICES_API_URL="https://streamer-production-3d21.up.railway.app/api/prices/"
```

5. **Deploy**
   - Push to GitHub - Railway deploys automatically
   - Or click "Deploy" in Railway dashboard
   - Monitor logs in real-time

### Troubleshooting Production Issues

**Database connection errors:**

- Verify `DATABASE_URL` is correctly set via Railway's reference variable
- Check migrations have run successfully

**Image uploads not persisting:**

- Ensure volume is mounted at `/app/public/admin-uploads`
- Verify volume has write permissions
- Check Railway logs for errors

## 🛠️ Database Commands

```bash
# Development
pnpm db:generate           # Generate Prisma client
pnpm db:migrate            # Create and apply migrations
pnpm db:migrate -- --reset # Reset database (WARNING: deletes all data)
pnpm db:studio             # Open GUI to view/edit data
pnpm db:seed               # Seed database with initial data

# Production
pnpm db:migrate:deploy     # Apply migrations in production
```

## 💻 Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Admin Panel**: React Admin + Shadcn UI
- **Database**: Prisma ORM, SQLite (dev), PostgreSQL (prod)
- **API**: tRPC for type-safe APIs
- **State Management**: Zustand, TanStack Query
- **Authentication**: HTTP-only cookies for admin
- **File Uploads**: Filesystem (persistent volume in production)
- **Deployment**: Docker + Railway
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

**Token mints not showing**

- Token mints automatically sync when market transitions from presale to active on PMX
- Syncing happens automatically when frontend loads the market
- Manual sync button available in admin as fallback
- Ensure market slug matches PMX exactly

## 🚢 Deployment Checklist

- [ ] All environment variables set in Railway
- [ ] Database migrations applied
- [ ] Persistent volume configured for uploads
- [ ] Admin password is secure
- [ ] API keys are production keys
- [ ] First market created and tested
- [ ] Preview mode tested
- [ ] Mobile responsiveness verified
- [ ] Docker build completes successfully

## 📚 Additional Resources

- [PMX Platform Docs](https://docs.pmx.trade)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Railway Documentation](https://docs.railway.app)
- [Docker Documentation](https://docs.docker.com)
- [React Admin](https://marmelab.com/react-admin/)

## 🔗 Links

- **Live Site**: [conspira.fi](https://conspira.fi)
- **Twitter**: [@agent_mock](https://twitter.com/agent_mock)
- **$MOCK Token**: [View on DexScreener](https://dexscreener.com/solana/ee7o1zq7w5c65aapgvjnq4pa7lxhhaigjnjohqarvbcx)
- **PMX Platform**: [pmx.trade](https://pmx.trade)

---

Built with ❤️ using the [T3 Stack](https://create.t3.gg/) | Powered by Agent $MOCK
