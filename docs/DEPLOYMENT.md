# Deployment Guide - Railway

This guide covers deploying Conspira.fi to Railway using Docker.

## Prerequisites

- Railway account ([railway.app](https://railway.app))
- GitHub repository connected to Railway
- Domain configured (optional)

## Database Setup (Railway Postgres)

### 1. Create PostgreSQL Database

1. In your Railway project, click "New" → "Database" → "Add PostgreSQL"
2. Railway will automatically create the database and provide connection details
3. Copy the `DATABASE_URL` from the "Connect" tab

### 2. Run Migrations

From your local environment with DATABASE_URL set:

```bash
# Set the Railway DATABASE_URL
export DATABASE_URL="postgresql://postgres:password@host:port/railway"

# Run migrations
pnpm db:migrate:deploy

# Optionally seed the database
pnpm db:seed
```

Or run migrations directly in Railway:

1. Go to your Railway project
2. Click on your service
3. Go to "Settings" → "Deploy" → "Custom Start Command"
4. Temporarily set: `pnpm db:migrate:deploy && node server.js`
5. Redeploy, then change back to: `node server.js`

## File Storage Setup

Railway provides **persistent volumes** for file storage.

### Create a Volume

1. In your Railway service, go to "Settings" → "Volumes"
2. Click "New Volume"
3. Set mount path: `/app/public/admin-uploads`
4. Capacity: 1GB (adjust as needed)
5. Click "Add"

This ensures uploaded images persist across deployments.

## Railway Deployment

### 1. Connect Repository

1. Go to [railway.app](https://railway.app)
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your `conspira.fi` repository
5. Railway will auto-detect the Dockerfile

### 2. Configure Environment Variables

In Railway project settings, add these environment variables:

```bash
# Database (automatically set by Railway if using their Postgres)
DATABASE_URL=${{Postgres.DATABASE_URL}}

# Admin
ADMIN_PASSWORD=your-secure-admin-password

# Twitter
TWITTER_BEARER_TOKEN=your-twitter-bearer-token

# xAI
XAI_API_KEY=your-xai-api-key

# PMX API
PMX_API_KEY=your-pmx-api-key
PMX_API_AUTHORIZATION=your-pmx-authorization
PMX_BASE_URL=https://xqdrbspnwgjvzvgzulls.supabase.co/rest/v1/
PMX_FEES_BASE_URL=https://backend-production-2715.up.railway.app/api/
HISTORIC_PRICES_API_URL=https://streamer-production-3d21.up.railway.app/api/prices/

# Node Environment (automatically set by Railway)
NODE_ENV=production
```

**Note**: Use Railway's reference variables like `${{Postgres.DATABASE_URL}}` to automatically inject database credentials.

### 3. Deploy

Railway will automatically deploy when you push to your main branch.

**Manual deployment:**

1. Click "Deploy" in Railway dashboard
2. Railway builds the Docker image
3. Runs health checks
4. Serves on the generated Railway URL

### 4. Custom Domain (Optional)

1. In Railway, go to "Settings" → "Domains"
2. Click "Generate Domain" for a Railway subdomain
3. Or add your custom domain and configure DNS

## Post-Deployment

### Verify Deployment

1. ✅ Check that the site loads
2. ✅ Test admin login at `your-url.railway.app/admin/login`
3. ✅ Try uploading an image
4. ✅ Verify database queries work
5. ✅ Check volume is mounted: uploaded images persist after redeployment

### Monitor for Issues

View logs in Railway:

1. Go to your service
2. Click "Deployments"
3. View real-time logs

Common issues:

#### Database connection errors

- Verify `DATABASE_URL` is correctly set
- Check Prisma client is generated (should happen in Docker build)
- Ensure migrations have run

#### Upload fails

- Check volume is mounted at `/app/public/admin-uploads`
- Verify volume has write permissions
- Check Railway logs for specific errors

#### Port binding issues

- Ensure `PORT=3000` is set
- Verify `HOSTNAME="0.0.0.0"` in Dockerfile

## Maintenance

### Running Migrations

When you have new migrations:

Option 1 - Local:

```bash
export DATABASE_URL="your-railway-postgres-url"
pnpm db:migrate:deploy
```

Option 2 - Railway CLI:

```bash
railway run pnpm db:migrate:deploy
```

### Viewing Database

Use Railway's built-in database viewer:

1. Go to your Postgres service
2. Click "Data" tab
3. Browse tables directly

Or use Prisma Studio:

```bash
export DATABASE_URL="your-railway-postgres-url"
pnpm db:studio
```

### Backup Database

Railway provides automatic backups for paid plans.

Manual backup:

```bash
railway run pg_dump > backup.sql
```

### Scaling

Railway automatically handles:

- Horizontal scaling (add more replicas in `railway.json`)
- Vertical scaling (upgrade service plan)
- Auto-restart on failures

To scale:

1. Edit `railway.json` → `deploy.numReplicas`
2. Push to trigger redeployment

**Note**: With multiple replicas, ensure volume is configured for shared access.

## Environment Variables Reference

| Variable                  | Required | Description                                        |
| ------------------------- | -------- | -------------------------------------------------- |
| `DATABASE_URL`            | Yes      | PostgreSQL connection string (auto-set by Railway) |
| `ADMIN_PASSWORD`          | Yes      | Admin panel password                               |
| `TWITTER_BEARER_TOKEN`    | Yes      | Twitter API v2 bearer token                        |
| `XAI_API_KEY`             | Yes      | xAI API key for AI features                        |
| `PMX_API_KEY`             | Yes      | PMX platform API key                               |
| `PMX_API_AUTHORIZATION`   | Yes      | PMX authorization token                            |
| `PMX_BASE_URL`            | Yes      | PMX API base URL                                   |
| `PMX_FEES_BASE_URL`       | Yes      | PMX fees API URL                                   |
| `HISTORIC_PRICES_API_URL` | Yes      | Historic prices API URL                            |

## Rollback

To rollback a deployment:

1. In Railway dashboard, go to "Deployments"
2. Find the previous working deployment
3. Click "⋯" → "Redeploy"

Or rollback your git commit and push.

## Security Checklist

- [x] All environment variables are set
- [x] `ADMIN_PASSWORD` is strong and unique
- [x] Database is only accessible within Railway network
- [x] HTTPS is enabled (automatic with Railway domains)
- [x] Volume permissions are set correctly
- [x] Health checks are passing

## Troubleshooting

### Deployment fails during build

Check Docker build logs in Railway:

- Ensure all dependencies install correctly
- Verify Prisma generates properly
- Check for TypeScript errors

### Application crashes on startup

View logs:

```bash
railway logs
```

Common causes:

- Missing environment variables
- Database connection failure
- Port binding issues

### Images not persisting

- Verify volume is created and mounted
- Check mount path: `/app/public/admin-uploads`
- Ensure volume has adequate space

### Database query timeouts

- Check connection pooling settings
- Verify database plan has adequate resources
- Add indexes to frequently queried fields

## Cost Optimization

Railway pricing tips:

- Use the free tier for development
- Upgrade to Pro for production
- Monitor usage in Railway dashboard
- Set up usage alerts

## Additional Resources

- [Railway Documentation](https://docs.railway.app)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)

---

**Ready to deploy?** Push your code and Railway will handle the rest! 🚀
