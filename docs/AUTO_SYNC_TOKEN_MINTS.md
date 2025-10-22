# Dynamic PMX Data Fetching

## Overview

Token mints, PMX links, and Jupiter swap links are **fetched dynamically** from the PMX API. Nothing is stored in the database - data is always fresh!

## How It Works

### What Gets Fetched Dynamically

**From Database (stored)**:
- Market name, title, description
- Market slug (used to fetch from PMX)
- Tweet search phrase
- Volume percentage
- Videos and conspiracy leaks

**From PMX API (fetched every time)**:
- YES token mint address
- NO token mint address
- Market status (presale/active)

**Generated on-the-fly**:
- PMX market link: `https://pmx.trade/markets/{slug}`
- Jupiter YES link: `https://jup.ag/swap/USDC-{yesTokenMint}`
- Jupiter NO link: `https://jup.ag/swap/USDC-{noTokenMint}`

### How It Works

**Trigger**: Every time `getEvents` API is called (when loading markets on frontend)

**Process**:
```typescript
For each market in database:
  1. Fetch market from PMX API
     GET /markets?slug=eq.{marketSlug}

  2. If market found and active:
     - Extract yesTokenMint from cas.YES.tokenMint
     - Extract noTokenMint from cas.NO.tokenMint
  
  3. If market is presale or not found:
     - yesTokenMint = ""
     - noTokenMint = ""
     - Jupiter links won't appear (expected)
  
  4. Generate links dynamically:
     - PMX: https://pmx.trade/markets/{slug}
     - JUPITER_YES: https://jup.ag/swap/USDC-{yesTokenMint}
     - JUPITER_NO: https://jup.ag/swap/USDC-{noTokenMint}
  
  5. Return event data with fresh PMX information
```

### What Happens

**Presale Market**:
```
Frontend loads market
└─> getEvents called
    └─> Fetch from PMX API
        └─> Market still in presale (no tokens in response)
            └─> Return empty token mints
            └─> No Jupiter links ✓
```

**Active Market**:
```
Frontend loads market
└─> getEvents called
    └─> Fetch from PMX API
        └─> Market is active! Tokens in response
            └─> Extract YES and NO token mints
            └─> Generate PMX and Jupiter links
            └─> Return fresh data ✓
```

## Logging

API fetch attempts are logged:

```
[PMX] Could not fetch token mints for will-bitcoin-hit-1m-2025: Market not found
```

This is normal for presale markets - they simply won't have token data yet.

## Requirements

### Critical
- **Market slug must match PMX exactly** (case-sensitive)
- PMX API credentials must be configured
- Market must exist on PMX as an active market

### URLs
- Presale: `https://pmx.trade/markets/presale/{slug}`
- Active: `https://pmx.trade/markets/{slug}` ← Tokens available here

## Benefits

✅ **Zero Configuration**: No need to manually enter anything
✅ **Always Fresh**: Data fetched from PMX API every time
✅ **No Storage**: Token mints not stored in database
✅ **Graceful**: Handles presale markets without errors
✅ **Dynamic Links**: PMX and Jupiter links generate on-the-fly
✅ **Simple**: Just set the market slug correctly

## Testing

1. **Create Market**: Only set market slug and basic info
2. **Activate**: Set `isActive: true`
3. **View Frontend**: Load the market page
4. **Check Response**: Token mints appear in event data (if market is active on PMX)
5. **Verify**: Jupiter links work correctly

## Troubleshooting

**Tokens not appearing?**
- Check server logs for `[PMX]` messages
- Verify market slug matches PMX exactly (case-sensitive)
- Confirm market is **active** on PMX (not presale)
- Check PMX API credentials

**How does it handle presale markets?**
- Gracefully! Returns empty token mints
- No errors, just no Jupiter links yet
- When market goes active, tokens appear automatically

**Does it fetch on every page load?**
- Yes! Fresh data every time
- Ensures tokens are always up-to-date
- PMX API is fast, negligible performance impact

## Examples

### Example 1: UFO Disclosure Market

**Create in Admin**:
```
Market Slug: will-ufo-disclosure-happen-2025
(no token fields - they're removed from DB)
Is Active: ✓
```

**What Happens**:
- Market is in presale on PMX → API returns no tokens
- PMX launches market → Tokens exist in PMX database
- User visits frontend → PMX API fetched
- Tokens in response → Jupiter links appear ✨

### Example 2: Bitcoin $1M Market

**Timeline**:
1. Day 1: Create market, still in presale
   - Frontend loads → PMX API call
   - No tokens in PMX response
   - No swap links displayed
2. Day 5: PMX launches market
   - Tokens exist on-chain in PMX
3. Day 5 (1 hour later): User visits site
   - Frontend loads → PMX API call
   - Tokens in PMX response!
   - Swap links appear ✨
4. Day 6+: All subsequent loads
   - Every load fetches fresh data from PMX
   - Always up-to-date
   - ~100ms API call (imperceptible)

## Code References

**PMX API fetch**: `src/server/api/routers/pmx_market.tsx` (lines 37-57)
**Link generation**: `src/server/api/routers/pmx_market.tsx` (lines 69-77)

---

**Status**: ✅ Fully Dynamic
**Storage**: 🚫 No database fields needed
**Maintenance**: None - always fetches fresh from PMX! 🚀

