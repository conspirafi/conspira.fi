# Changelog - Production Ready Updates

## Summary

This update prepares Conspira.fi for production deployment with enhanced features, security improvements, and Docker/Railway deployment support.

## 🔐 Security Enhancements

### Admin Route Protection

- **Added `protectedProcedure`** in `src/server/api/trpc.ts`
  - Validates admin authentication via HTTP-only cookies
  - Throws `UNAUTHORIZED` error if not authenticated
- **Secured all admin CRUD operations** in `src/server/api/routers/admin.ts`
  - Replaced `publicProcedure` with `protectedProcedure` for all mutations
  - Markets, videos, and conspiraInfo endpoints now require authentication

### Rate Limiting

- **Implemented rate limiting** on `/api/admin/auth` login endpoint
  - 5 attempts per IP per 15 minutes
  - Returns 429 status with retry-after header
  - In-memory tracking with automatic cleanup

## ✨ New Features

### 1. Auto-Discovery of Token Mints ✨

- **Made token mints optional** in database schema
  - `yesTokenMint` and `noTokenMint` are now nullable
  - Markets can be created without tokens (presale mode)
- **Automatic syncing when markets load**
  - When `getEvents` is called, checks if token mints are missing
  - Attempts to fetch from PMX active markets API
  - If market transitioned from presale to active, auto-updates tokens
  - Happens transparently in the background
  - Logs sync attempts for monitoring
- **Manual sync endpoint**: `admin.markets.syncTokenMints`
  - Accessible via "Sync Token Mints" button in admin panel
  - Useful as fallback or for forcing immediate sync
  - Same logic as automatic sync

### 2. Dynamic Jupiter Swap Links

- **Removed hardcoded Jupiter links** from database
- **Generate links dynamically** in `src/server/api/routers/pmx_market.tsx`
  - Format: `https://jup.ag/swap/USDC-{tokenMint}`
  - Separate links for YES and NO tokens
  - Handles null token mints gracefully
- **Updated EventSchema** to include `JUPITER_YES` and `JUPITER_NO` fields

### 3. Configurable Volume Percentage

- **Added `volumePercentage` field** to Market model
  - Default: 33.33%
  - Configurable per market
  - Admin UI includes NumberInput for easy adjustment
- **Updated volume calculations**:
  - `TradeInComponent`: Uses dynamic percentage from event data
  - `MobileEventDetails`: Uses market-specific percentage
  - Both components fall back to 33.33% if not set
- **Database migration**: `20251022163010_add_volume_percentage_and_optional_mints`

### 4. Enhanced Admin Panel

- **Volume percentage input** in market forms
  - Step: 0.01 for precise control
  - Helper text with default value
- **Sync Token Mints button** in market detail view
  - Shows sync status with loading state
  - Displays success message with truncated token addresses
  - Auto-refreshes page on successful sync
- **Updated field labels** and helper text for clarity
- **Removed Jupiter link input** (auto-generated now)

## 🐳 Docker & Deployment

### Docker Configuration

- **Created production `Dockerfile`**
  - Multi-stage build for optimization
  - Node 20 Alpine base
  - Standalone Next.js output
  - Non-root user (nextjs:nodejs)
  - Persistent volume support at `/app/public/admin-uploads`
  - Health check on `/api/health` endpoint
- **Created `.dockerignore`** to optimize build context
- **Added health check route**: `/api/health`

### Railway Deployment

- **Created `railway.json`** configuration
  - Dockerfile-based build
  - Single replica with restart policy
  - Auto-restart on failure (max 10 retries)
- **Updated documentation**:
  - `docs/DEPLOYMENT.md`: Complete Railway deployment guide
  - `README.md`: Replaced Vercel/Supabase with Railway/Docker instructions
  - Persistent volume setup for file uploads

### Storage Simplification

- **Removed Supabase dependencies** from `src/server/lib/storage.ts`
  - Always uses filesystem at `public/admin-uploads/`
  - Works with persistent volumes in production
  - Simpler, more reliable upload handling
- **Removed Supabase env vars** from `src/env.js`
  - No longer required for deployment
  - Cleaner environment configuration

### Configuration Updates

- **Updated `next.config.js`**:
  - Added `output: "standalone"` for Docker builds
  - Removed Ukrainian comment
  - Optimized for containerized deployment

## 📊 Database Changes

### Schema Updates (`prisma/schema.prisma`)

```prisma
model Market {
  yesTokenMint      String?   // Now optional
  noTokenMint       String?   // Now optional
  volumePercentage  Float    @default(33.33)  // New field
  // ... other fields unchanged
}
```

### Migration

- **File**: `prisma/migrations/20251022163010_add_volume_percentage_and_optional_mints/migration.sql`
- **Changes**:
  - Made `yesTokenMint` nullable
  - Made `noTokenMint` nullable
  - Added `volumePercentage` with default 33.33

## 📝 Type Updates

### EventSchema (`src/server/types.ts`)

- Added `volumePercentage: z.number().default(33.33)`
- Added `JUPITER_YES` and `JUPITER_NO` to eventLinks

### Component Props

- **TradeInProps**: Added optional `volumePercentage`
- **VolumeElementProps**: Added optional `volumePercentage`

## 📚 Documentation

### New Documentation

- **`docs/DEPLOYMENT.md`**: Complete Railway deployment guide
  - PostgreSQL setup
  - Persistent volume configuration
  - Environment variables reference
  - Troubleshooting guide
  - Security checklist
- **`docs/TESTING_MULTI_MARKET.md`**: Multi-market testing guide
  - Step-by-step test procedures
  - Expected results
  - Troubleshooting tips
- **`CHANGELOG.md`**: This file

### Updated Documentation

- **`README.md`**:
  - Replaced Vercel/Supabase with Railway/Docker
  - Updated tech stack
  - Added token mint sync troubleshooting
  - Updated deployment checklist
  - Updated additional resources

## 🔧 Technical Improvements

### Code Quality

- Consistent use of TypeScript types
- Proper error handling in sync endpoint
- Graceful fallbacks for missing data
- Clean separation of concerns

### Performance

- Optimized Docker image with multi-stage builds
- Efficient volume mounts for uploads
- Standalone Next.js build reduces container size
- Health checks ensure reliability

### Developer Experience

- Clear helper text in admin forms
- Informative error messages
- Comprehensive documentation
- Easy local development with devcontainer

## 🧪 Testing

### Manual Testing Required

1. ✅ Create 2 markets in admin panel (leave token mints empty)
2. ✅ Verify both display correctly on frontend
3. ✅ Test volume percentage calculation
4. ✅ Test automatic token mint sync when viewing markets
   - Markets in presale: No tokens yet (expected)
   - Markets that went active: Tokens auto-sync on page load
5. ✅ Verify Jupiter links generate correctly after sync
6. ✅ Test preview mode for each market
7. ✅ Verify data isolation between markets
8. ✅ Check server logs for sync attempts

See `docs/TESTING_MULTI_MARKET.md` for detailed test procedure.

## 🚀 Deployment Steps

1. **Set up Railway**:
   - Connect GitHub repository
   - Add PostgreSQL database
   - Configure persistent volume

2. **Set environment variables**:

   ```env
   DATABASE_URL=${{Postgres.DATABASE_URL}}
   ADMIN_PASSWORD=your-secure-password
   TWITTER_BEARER_TOKEN=your-token
   XAI_API_KEY=your-key
   PMX_API_KEY=your-key
   PMX_API_AUTHORIZATION=your-auth
   PMX_BASE_URL=https://xqdrbspnwgjvzvgzulls.supabase.co/rest/v1/
   PMX_FEES_BASE_URL=https://backend-production-2715.up.railway.app/api/
   HISTORIC_PRICES_API_URL=https://streamer-production-3d21.up.railway.app/api/prices/
   ```

3. **Run migrations**:

   ```bash
   pnpm db:migrate:deploy
   ```

4. **Deploy**: Push to GitHub or click "Deploy" in Railway

5. **Verify**: Test admin login, market creation, and token sync

## 🐛 Bug Fixes

- None - this is a feature release

## Breaking Changes

- ⚠️ **Supabase env vars removed**: No longer required (simplified deployment)
- ⚠️ **Admin routes now protected**: Must be authenticated to access
- ⚠️ **Jupiter links auto-generated**: Don't set jupiterLink manually

## Migration Guide

### From Vercel/Supabase to Railway

1. Export your database from Supabase
2. Import to Railway Postgres
3. Remove Supabase env vars
4. Configure persistent volume
5. Deploy with Docker

### Updating Existing Markets

1. Existing markets with token mints: No changes needed
2. Markets without token mints: Use "Sync Token Mints" button when active
3. Volume percentage: Defaults to 33.33%, edit to customize

## Contributors

- Implementation by AI Assistant
- Requested by @eemnauwl

## Version

- **Release**: Production Ready v1.0
- **Date**: October 22, 2025
- **Next.js**: 15.2.3
- **React**: 19.0.0
- **Node**: 20+

---

**Status**: ✅ Ready for production deployment
