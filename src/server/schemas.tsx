import z from "zod";

//////////// PMX ////////////

const MarketImageSchema = z.object({
  data: z.string(),
  filename: z.string(),
  mimetype: z.string(),
  size: z.number(),
});

const PresaleMarketDetailsSchema = z.object({
  balance: z.number(),
  created_at: z.string(),
  creator_address: z.string(),
  description: z.string(),
  end_date: z.string(),
  funding_wallet: z.string(),
  has_funded: z.boolean(),
  image_urls: z.object({
    market: MarketImageSchema,
    option1: MarketImageSchema,
    option2: MarketImageSchema,
  }),
  id: z.string(),
  limit: z.number(),
  migrated: z.boolean(),
  name: z.string(),
  options: z.array(z.string()),
  rules: z.string(),
  slug: z.string(),
});

const ImageUrlsSchema = z.object({
  NO: z.string().url(),
  YES: z.string().url(),
});

const PoolSchema = z.object({
  address: z.string(),
  position: z.string(),
});

const PoolsSchema = z.object({
  NO: PoolSchema,
  YES: PoolSchema,
});

const CaSchema = z.object({
  tokenMint: z.string(),
  poolAddress: z.string(),
  metadataAddress: z.string().nullable(),
});

const CasSchema = z.object({
  NO: CaSchema,
  YES: CaSchema,
});

const OptionSchema = z.object({
  name: z.string(),
  ticker: z.string(),
  metadata_url: z.string().url(),
});

const OptionsSchema = z.object({
  NO: OptionSchema,
  YES: OptionSchema,
});

const PositionAddressesSchema = z.object({
  NO: z.string(),
  YES: z.string(),
});

const MetadataSchema = z.object({
  type: z.string(),
  created_at: z.string().datetime({ offset: true }),
});

const MarketSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string(),
  end_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Must be a valid date in YYYY-MM-DD format"),
  slug: z.string(),
  image_urls: ImageUrlsSchema,
  pools: PoolsSchema,
  cas: CasSchema,
  options: OptionsSchema,
  position_addresses: PositionAddressesSchema,
  metadata: MetadataSchema,
  created_at: z.string().datetime({ offset: true }),
  updated_at: z.string().datetime({ offset: true }),
  status: z.enum(["active", "inactive", "resolved"]),
  resolved: z.string().nullable(),
  rules: z.string().nullable(),
  user_generated: z.boolean(),
  lp_snapshot: z.string().nullable(),
  published: z.boolean(),
  limit: z.number().int().nonnegative(),
  paid_out: z.boolean(),
  has_rebalancer: z.boolean(),
  returned_lp: z.boolean(),
  paid_creator: z.boolean(),
  collected_fees: z.number().nonnegative(),
});

///////////// streamer-production-3d21.up.railway.app ////////////////

const MarketHistoricalDataSchema = z.object({
  market_cap: z.number(),
  price: z.number(),
  timestamp: z.string(),
  volume: z.number(),
});

const MarketHistoryPricesSchema = z.object({
  count: z.number(),
  hasCurrentPrice: z.boolean(),
  historicalData: z.array(MarketHistoricalDataSchema),
  success: z.boolean(),
  tokenMint: z.string(),
});

////////// Market Fees ////////////

const TotalFeesSchema = z.object({
  usdc: z.number(),
  token: z.number(),
  total: z.number(),
});

// Schema for position fees
const PositionFeesSchema = z.array(
  z.object({
    option: z.enum(["YES", "NO"]),
    hasPosition: z.boolean(),
    usdcFees: z.number(),
    tokenFees: z.number(),
    totalFees: z.number(),
    positionAddress: z.string(),
    poolAddress: z.string(),
  }),
);

// Main schema
const PlatformFeesSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  marketSlug: z.string(),
  platformWallet: z.nullable(z.string()), // platformWallet can be null or a string
  totalFees: TotalFeesSchema,
  positionFees: PositionFeesSchema,
});

export type IPMXGetMarket = z.infer<typeof MarketSchema>;
export type IPMXGetPresaleMarketDetails = z.infer<
  typeof PresaleMarketDetailsSchema
>;
export type IPMXGetMarketFees = z.infer<typeof PlatformFeesSchema>;

export type IMarketHistory = z.infer<typeof MarketHistoryPricesSchema>;
export type IMarketHistoricalData = z.infer<typeof MarketHistoricalDataSchema>;
