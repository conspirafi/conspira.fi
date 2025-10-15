# Conspira.fi

> **Every week, a new conspiracy becomes a market. Prediction markets cut through the noise. Every signal strengthens the symbol: $MOCK.**

Conspira.fi is a prediction market platform that transforms conspiracy theories into tradeable markets on Solana, powered by PMX.

🌐 **Live:** [conspira.fi](https://conspira.fi)

## 🚀 Quick Start

### Prerequisites

- **Node.js 18+** (we recommend using [nvm](https://github.com/nvm-sh/nvm))
- **pnpm 9+** (`npm install -g pnpm`)
- **API Keys** (see Getting API Keys section below)

### Local Development Setup

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
npx prisma generate

# Run migrations to create database schema
npx prisma migrate dev

# Seed database with initial data (creates example market)
npx prisma db seed
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
# Database (SQLite for local development)
DATABASE_URL="file:./prisma/dev.db"

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

## 🚀 Production Deployment (Vercel)

### 1. Database Setup

Choose one of these options:

**Option A: Vercel Postgres**
```bash
# Install Vercel CLI
npm i -g vercel

# Link project and create database
vercel link
vercel env pull
```

**Option B: External PostgreSQL (Supabase, Neon, etc.)**
- Create a PostgreSQL database
- Get the connection string

### 2. Environment Variables in Vercel

Go to your Vercel project settings and add:

```env
# Database (PostgreSQL connection string)
DATABASE_URL="postgresql://user:password@host:5432/database?sslmode=require"

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

### 3. Deploy to Vercel

The project includes a `vercel.json` configuration file that handles the deployment setup automatically.

```bash
# Push to GitHub
git add .
git commit -m "Deploy to production"
git push origin main

# Deploy (if not auto-deploying)
vercel --prod
```

**Troubleshooting Deployment**:
- If you see pnpm registry errors, the project will automatically install pnpm during deployment
- The build command includes Prisma migrations
- React 19 compatibility is handled via pnpm overrides

### 4. Initialize Production Database

After first deployment:

```bash
# Run migrations on production
npx prisma migrate deploy

# Optional: Seed with initial data
npx prisma db seed
```

### 5. Post-Deployment

- Access admin panel at `https://yourdomain.com/admin/login`
- Create your first market following the steps above
- Monitor logs in Vercel dashboard

## 🛠️ Database Commands

```bash
# Development
npx prisma generate          # Generate Prisma client
npx prisma migrate dev       # Create and apply migrations
npx prisma migrate reset     # Reset database (WARNING: deletes all data)
npx prisma studio           # Open GUI to view/edit data
npx prisma db seed          # Seed database with initial data

# Production
npx prisma migrate deploy    # Apply migrations in production
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
