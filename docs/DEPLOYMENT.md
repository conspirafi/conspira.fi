# Deployment Guide

## Vercel + Supabase Setup

### Prerequisites

- Vercel account
- Supabase project
- Domain configured (optional)

## Database Setup (Supabase)

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Wait for the project to initialize

### 2. Get Database Connection String

From your Supabase project:
1. Go to **Settings** → **Database**
2. Copy the **Connection Pooling** connection string (Transaction mode)
3. This should look like:
   ```
   postgresql://postgres:[password]@[project-ref].supabase.co:5432/postgres?pgbouncer=true&connection_limit=1
   ```

### 3. Configure Connection String

**Important**: For Vercel deployment with Supabase, use these connection string parameters:

```
postgresql://postgres:[password]@[project-ref].supabase.co:5432/postgres?pgbouncer=true&connection_limit=1
```

Key parameters:
- `pgbouncer=true`: Enables connection pooling compatibility
- `connection_limit=1`: Limits connections per serverless function

### 4. Run Migrations

From your local environment:

```bash
# Set the Supabase DATABASE_URL
export DATABASE_URL="postgresql://postgres:[password]@[project-ref].supabase.co:5432/postgres?pgbouncer=true&connection_limit=1"

# Run migrations
npm run db:migrate:deploy

# Optionally seed the database
npm run db:seed
```

## File Storage Setup (Supabase)

### 1. Create Storage Bucket

1. In Supabase, go to **Storage**
2. Create a new bucket called `admin-uploads`
3. Make it **public** (for serving images)

### 2. Configure Policies

Add these policies to the bucket:

**SELECT (Read) - Public access:**
```sql
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'admin-uploads' );
```

**INSERT (Upload) - Authenticated only:**
```sql
CREATE POLICY "Authenticated Upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'admin-uploads'
  AND auth.role() = 'authenticated'
);
```

Or for service role uploads (which is what we use):
```sql
CREATE POLICY "Service Role Upload"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'admin-uploads' );
```

### 3. Get Supabase Credentials

From your Supabase project:
1. Go to **Settings** → **API**
2. Copy:
   - **Project URL**: `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public key**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role key**: `SUPABASE_SERVICE_ROLE_KEY` (keep secret!)

## Vercel Setup

### 1. Connect Repository

1. Go to [vercel.com](https://vercel.com)
2. Import your repository
3. Select the project

### 2. Configure Environment Variables

In Vercel project settings, add these environment variables:

#### Required Variables
```bash
# Database
DATABASE_URL="postgresql://postgres:[password]@[project-ref].supabase.co:5432/postgres?pgbouncer=true&connection_limit=1"

# Admin
ADMIN_PASSWORD="your-secure-admin-password"

# Twitter
TWITTER_BEARER_TOKEN="your-twitter-bearer-token"

# xAI
XAI_API_KEY="your-xai-api-key"

# PMX API
PMX_API_KEY="your-pmx-api-key"
PMX_API_AUTHORIZATION="your-pmx-authorization"
PMX_BASE_URL="https://api.pmx.com"
PMX_FEES_BASE_URL="https://fees.pmx.com"

# Historic Prices
HISTORIC_PRICES_API_URL="https://prices.example.com"

# Node Environment (set by Vercel automatically)
NODE_ENV="production"
```

#### Optional (for Supabase Storage)
```bash
# Supabase (for file uploads)
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
```

**Note**: If you don't configure Supabase Storage, uploads will use `/tmp` directory (which is ephemeral on Vercel).

### 3. Deploy

Vercel will automatically deploy when you push to your main branch.

## Post-Deployment

### Verify Deployment

1. Check that the site loads
2. Test admin login
3. Try uploading an image
4. Verify database queries work

### Monitor for Issues

Common issues:

#### "Prepared statement already exists"
- Check `DATABASE_URL` has `pgbouncer=true&connection_limit=1`
- Verify Prisma client configuration in `src/server/db.ts`

#### Upload fails with 500 error
- If not using Supabase Storage, uploads will be ephemeral
- Check Vercel logs for specific errors
- Verify Supabase credentials if configured

#### Database connection timeout
- Check connection string is correct
- Verify Supabase project is running
- Check connection limit settings

## Maintenance

### Database Migrations

To run new migrations on production:

```bash
# Set production DATABASE_URL
export DATABASE_URL="postgresql://postgres:[password]@[project-ref].supabase.co:5432/postgres?pgbouncer=true&connection_limit=1"

# Run migrations
npm run db:migrate:deploy
```

### Backup Database

Use Supabase's built-in backup features:
1. Go to **Settings** → **Database**
2. Configure daily backups
3. Enable Point-in-Time Recovery (for paid plans)

### Monitor Performance

- Use Vercel Analytics for frontend performance
- Use Supabase logs for database queries
- Set up error tracking (Sentry, etc.)

## Scaling

### Database
- Upgrade Supabase plan for more connections
- Use Supabase's connection pooler (PgBouncer)
- Consider read replicas for high traffic

### Storage
- Supabase Storage scales automatically
- Consider CDN for static assets

### Serverless Functions
- Vercel scales automatically
- Monitor function execution time
- Optimize cold starts if needed

## Troubleshooting

### Database Issues

**Connection Errors:**
```bash
# Test connection
psql "postgresql://postgres:[password]@[project-ref].supabase.co:5432/postgres?pgbouncer=true"

# Check migrations
npm run prisma migrate status
```

**Performance Issues:**
- Add indexes to frequently queried fields
- Use Supabase dashboard to analyze slow queries
- Consider database plan upgrade

### Upload Issues

**Images not persisting:**
- Without Supabase Storage, uploads to `/tmp` are ephemeral
- Configure Supabase Storage for persistent uploads

**Large files failing:**
- Check file size limits (default 5MB)
- Adjust limits in storage handler if needed
- Consider Vercel function size limits

## Rollback

To rollback a deployment:

1. In Vercel dashboard, go to **Deployments**
2. Find previous working deployment
3. Click **⋯** → **Promote to Production**

To rollback database migrations:

```bash
# This is not recommended - better to migrate forward
# Only use in emergencies
npm run prisma migrate resolve -- --rolled-back [migration-name]
```

## Security Checklist

- [ ] All environment variables are set
- [ ] `ADMIN_PASSWORD` is strong and unique
- [ ] `SUPABASE_SERVICE_ROLE_KEY` is kept secret (server-side only)
- [ ] Supabase Storage policies are configured correctly
- [ ] Database is only accessible via Supabase (not exposed publicly)
- [ ] CORS is configured if needed
- [ ] Rate limiting is in place for API routes


