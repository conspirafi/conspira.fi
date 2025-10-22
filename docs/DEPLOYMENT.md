# Railway Deployment Guide

Complete guide for deploying Conspira.fi to Railway using their native Node.js buildpack.

## Prerequisites

- Railway account ([railway.app](https://railway.app))
- GitHub repository connected to Railway
- Domain configured (optional)

## Quick Start

1. **Connect GitHub Repository**
   - Go to [railway.app](https://railway.app)
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository
   - Railway will auto-detect Node.js/Next.js

2. **Add PostgreSQL Database**
   - In your Railway project, click "+ New"
   - Select "Database" → "Add PostgreSQL"
   - Railway automatically sets `DATABASE_URL` environment variable

3. **Configure Environment Variables**

   ```bash
   # Railway auto-sets this
   DATABASE_URL=${{Postgres.DATABASE_URL}}

   # Add these manually
   ADMIN_PASSWORD=your-secure-password
   TWITTER_BEARER_TOKEN=your-twitter-bearer-token
   XAI_API_KEY=your-xai-api-key
   PMX_API_KEY=your-pmx-api-key
   PMX_API_AUTHORIZATION=your-pmx-authorization
   PMX_BASE_URL=https://xqdrbspnwgjvzvgzulls.supabase.co/rest/v1/
   PMX_FEES_BASE_URL=https://backend-production-2715.up.railway.app/api/
   HISTORIC_PRICES_API_URL=https://streamer-production-3d21.up.railway.app/api/prices/
   ```

4. **Deploy**
   - Railway automatically deploys on push to main
   - Or click "Deploy" in the Railway dashboard

## Database Setup

### Run Migrations

**Option 1 - Local with Railway DB URL:**

```bash
# Get DATABASE_URL from Railway dashboard
export DATABASE_URL="your-railway-postgres-url"
pnpm db:migrate:deploy
```

**Option 2 - Railway CLI:**

```bash
railway run pnpm db:migrate:deploy
```

**Option 3 - Temporary Start Command:**

1. Go to Settings → Deploy
2. Set custom start command: `pnpm db:migrate:deploy && pnpm start`
3. Deploy once
4. Change back to: `pnpm start`

### Seed Database (Optional)

```bash
railway run pnpm db:seed
```

## Build Configuration

Railway automatically detects:

- `package.json` scripts
- Node.js version from `.nvmrc` or `package.json`
- Build command: `pnpm build`
- Start command: `pnpm start`

**No additional configuration needed!**

## File Uploads

For image uploads (conspiracy leak images), Railway provides **persistent disks**.

### Add Persistent Disk

1. Go to your service in Railway
2. Click "Settings" → "Volumes"
3. Click "New Volume"
4. Mount path: `/app/public/admin-uploads`
5. Size: 1GB (adjust as needed)
6. Save

This ensures uploaded images persist across deployments.

## Environment Variables Reference

| Variable                  | Required | Description                  | Example                           |
| ------------------------- | -------- | ---------------------------- | --------------------------------- |
| `DATABASE_URL`            | Yes      | Auto-set by Railway Postgres | `postgresql://...`                |
| `ADMIN_PASSWORD`          | Yes      | Admin panel password         | `strong-password-123`             |
| `TWITTER_BEARER_TOKEN`    | Yes      | Twitter API v2 bearer token  | `AAAAAAAAAAAAAAAAAAAAAFxB...`     |
| `XAI_API_KEY`             | Yes      | xAI API key                  | `xai-...`                         |
| `PMX_API_KEY`             | Yes      | PMX platform API key         | `your-key`                        |
| `PMX_API_AUTHORIZATION`   | Yes      | PMX authorization token      | `Bearer ...`                      |
| `PMX_BASE_URL`            | Yes      | PMX API base URL             | `https://xqdrbspnwgjvzvgzulls...` |
| `PMX_FEES_BASE_URL`       | Yes      | PMX fees API URL             | `https://backend-production...`   |
| `HISTORIC_PRICES_API_URL` | Yes      | Historic prices API URL      | `https://streamer-production...`  |

## Monitoring & Logs

### View Logs

Railway dashboard → Your service → "Deployments" → Click deployment → "View Logs"

Or use Railway CLI:

```bash
railway logs
```

### Health Checks

Railway automatically monitors your deployment. Access health endpoint:

```
https://your-app.railway.app/api/health
```

## Troubleshooting

### Build Fails

**Check build logs** in Railway dashboard for errors like:

- TypeScript compilation errors
- Missing dependencies
- Environment variable issues

**Common fixes:**

```bash
# Ensure all dependencies are in package.json
pnpm install

# Check for type errors locally
pnpm typecheck

# Test build locally
pnpm build
```

### Database Connection Errors

- Verify `DATABASE_URL` is set (Railway does this automatically)
- Check Prisma client is generated during build
- Ensure migrations have run

### Application Crashes

**Check logs for:**

- Missing environment variables
- Database connection failures
- Port binding issues (Railway sets PORT automatically)

**Verify all required env vars are set:**

```bash
railway variables
```

### Images Not Loading

- Ensure persistent volume is mounted at `/app/public/admin-uploads`
- Check file permissions
- Verify uploads are going to the correct path

## Scaling

Railway handles scaling automatically. To adjust:

1. Go to Settings → Resources
2. Adjust instance size
3. Enable autoscaling (paid plans)

## Custom Domain

1. Go to Settings → Domains
2. Click "Custom Domain"
3. Add your domain
4. Update DNS records as instructed
5. SSL is automatic

## Rollback

If a deployment fails:

1. Go to "Deployments"
2. Find last working deployment
3. Click "..." → "Redeploy"

## CI/CD

Railway automatically deploys when you push to your main branch.

**To disable auto-deploy:**

1. Settings → Deploy
2. Toggle "Deploy on Push"

**To deploy specific branch:**

1. Settings → Deploy
2. Set "Production Branch"

## Database Backups

### Manual Backup

```bash
# Using Railway CLI
railway run pg_dump > backup-$(date +%Y%m%d).sql
```

### Restore Backup

```bash
railway run psql < backup.sql
```

## Cost Optimization

- Free tier: 500 hours/month ($5 credit)
- Starter: $5/month (500 hours)
- Pro: $20/month (unlimited)

**Tips:**

- Use free tier for development
- Upgrade to Pro for production
- Monitor usage in Railway dashboard

## Security Checklist

- ✅ `ADMIN_PASSWORD` is strong and unique
- ✅ Environment variables are not committed to git
- ✅ API keys are rotated regularly
- ✅ Database has strong password (auto-generated by Railway)
- ✅ HTTPS is enabled (automatic with Railway)

## Additional Resources

- [Railway Docs](https://docs.railway.app)
- [Railway CLI](https://docs.railway.app/develop/cli)
- [Railway Pricing](https://railway.app/pricing)
- [Next.js on Railway](https://docs.railway.app/guides/nextjs)

---

**Ready to deploy?** Just push to GitHub and Railway will handle the rest! 🚀
