# URL Structure

Conspira.fi supports multiple URL patterns for accessing markets.

## URL Patterns

### 1. Homepage - All Active Markets

```
https://conspira.fi/
```

- Shows all markets where `isActive = true`
- Displays most recently created market first
- Users can switch between markets

### 2. Direct Market Access - By Slug

```
https://conspira.fi/m/[market-slug]
```

**Examples:**

```
https://conspira.fi/m/will-comet-3iatlas-show-evidence-of-alien-technology-20250926084948
https://conspira.fi/m/colts-vs-chargers-20251014021806
```

**Features:**

- ✅ Clean, shareable URLs
- ✅ SEO-friendly with market slug
- ✅ Only shows active markets
- ✅ Perfect for social media sharing

**Usage:**

- Share on Twitter/X
- Embed in articles
- Link from other sites
- Direct user engagement

### 3. Preview Mode - By ID

```
https://conspira.fi/preview/[market-id]
```

**Example:**

```
https://conspira.fi/preview/cm27q3a40000n54j0m0du2fx
```

**Features:**

- ✅ Works for inactive markets
- ✅ Test before activating
- ✅ Review content privately
- ✅ Admin-only feature

**Usage:**

- Click "Preview Market" button in admin
- Test market before going live
- Review content changes
- QA testing

## URL Parameters (Legacy - Still Supported)

### Query Parameter Access

```
https://conspira.fi/?slug=market-slug
https://conspira.fi/?preview=market-id
```

**Status:** ✅ Backwards compatible, still works
**Recommendation:** Use path-based URLs for cleaner links

## Admin Panel URLs

### Admin Login

```
https://conspira.fi/admin/login
```

### Admin Dashboard

```
https://conspira.fi/admin
```

- Requires authentication
- Redirects to `/admin/login` if not authenticated

## API Endpoints

### tRPC API

```
https://conspira.fi/api/trpc/[procedure]
```

### Health Check

```
https://conspira.fi/api/health
```

### Admin Auth

```
https://conspira.fi/api/admin/auth
```

- POST: Login
- GET: Check auth status
- DELETE: Logout

### Admin Upload

```
https://conspira.fi/api/admin/upload
```

- POST: Upload image for conspiracy leaks

### Static Uploads

```
https://conspira.fi/api/uploads/[filename]
```

- GET: Serve uploaded images

## Market Slug Format

Market slugs typically follow this format:

```
will-[event-name]-[timestamp]
```

**Examples:**

- `will-comet-3iatlas-show-evidence-of-alien-technology-20250926084948`
- `will-bitcoin-hit-1m-2025`
- `will-ufo-disclosure-happen-2025`

**Best Practices:**

- Use lowercase
- Hyphen-separated words
- Descriptive and readable
- Include timestamp for uniqueness (optional)
- Match PMX market slug exactly for auto-sync

## SEO & Sharing

### Open Graph Tags

All market pages include OG tags:

- Title
- Description
- Image (`/conspirafi-og.png`)
- Site name

### Twitter Cards

Optimized for Twitter/X sharing:

- Large image card
- Market title and description
- @agent_mock attribution

---

**Recommendation:** Use `/m/[slug]` URLs for all public sharing! 🚀
