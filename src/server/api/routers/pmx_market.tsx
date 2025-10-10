import { createTRPCRouter, publicProcedure } from "../trpc";
import type { AxiosResponse } from "axios";
import z from "zod";
import { events } from "~/server/events";
import {
  historicPricesApiClient,
  pmxApiClient,
  pmxFeesApiClient,
} from "~/server/lib/axiosConfig";
import { type ITweetFullData } from "~/server/lib/twitterApi";
import { searchTweetsCached } from "~/server/lib/twitterCache";
import type {
  IFundingSnapshot,
  IMarketHistory,
  IPMXGetMarket,
  IPMXGetMarketFees,
  IPMXGetPresaleMarketDetails,
} from "~/server/schemas";

export const pmxMarketRouter = createTRPCRouter({
  getEvents: publicProcedure.query(async () => {
    const result = [];
    for (const event of events) {
      let tweets: ITweetFullData[] = [];

      if (event.tweetSearchPhrase) {
        const chachedTweets = await searchTweetsCached(event.tweetSearchPhrase);
        tweets = chachedTweets.data;
      }
      result.push({ ...event, tweets });
    }
    return result;
  }),
  getPresaleMarketDetails: publicProcedure
    .input(z.object({ marketSlug: z.string() }).optional())
    .query(async ({ input }) => {
      const { marketSlug } = input || { marketSlug: undefined };
      const pmxMarketResponse = (await pmxApiClient.get(
        `presale-markets?select=*&slug=eq.${marketSlug || process.env.MARKET_SLUG}`,
      )) as AxiosResponse<IPMXGetPresaleMarketDetails[]>;

      return pmxMarketResponse.data[0];
    }),
  getFundingSnapshot: publicProcedure
    .input(z.object({ marketSlug: z.string() }).optional())
    .query(async ({ input }) => {
      const { marketSlug } = input || { marketSlug: undefined };
      try {
        const pmxMarketFeesResponse = (await pmxFeesApiClient.post(
          `snapshot-funding-wallets`,
          {
            marketSlug: marketSlug || process.env.MARKET_SLUG,
          },
        )) as AxiosResponse<IFundingSnapshot>;
        return pmxMarketFeesResponse.data;
      } catch {
        return null;
      }
    }),
  getMarket: publicProcedure
    .input(z.object({ marketSlug: z.string() }).optional())
    .query(async ({ input }) => {
      const { marketSlug } = input || { marketSlug: undefined };
      try {
        const pmxMarketResponse = (await pmxApiClient.get(
          `markets?select=*&slug=eq.${marketSlug || process.env.MARKET_SLUG}`,
        )) as AxiosResponse<IPMXGetMarket[]>;
        return pmxMarketResponse.data[0] || null;
      } catch {
        return null;
      }
    }),
  getMarketFees: publicProcedure
    .input(z.object({ marketSlug: z.string() }).optional())
    .query(async ({ input }) => {
      const { marketSlug } = input || { marketSlug: undefined };
      try {
        const pmxMarketFeesResponse = (await pmxFeesApiClient.get(
          `markets/${marketSlug || process.env.MARKET_SLUG}/fees`,
        )) as AxiosResponse<IPMXGetMarketFees>;
        return pmxMarketFeesResponse.data;
      } catch {
        return null;
      }
    }),
  getMarketHistory: publicProcedure
    .input(
      z.object({
        type: z.enum(["YES", "NO"]),
        tokenMints: z
          .object({ yesTokenMints: z.string(), noTokenMint: z.string() })
          .optional(),
        limit: z.number().optional(),
      }),
    )
    .query(async ({ input }) => {
      const { tokenMints } = input;
      const tokenMint =
        input.type === "YES"
          ? tokenMints?.yesTokenMints ||
            process.env.HISTORIC_PRICES_API_YES_TOKEN_MINT
          : tokenMints?.noTokenMint ||
            process.env.HISTORIC_PRICES_API_NO_TOKEN_MINT;
      const limit = input.limit ? input.limit : "7";
      const historyMarketResponse = (await historicPricesApiClient.get(
        `${tokenMint}/history?limit=${limit}`,
      )) as AxiosResponse<IMarketHistory>;
      return historyMarketResponse.data;
    }),
});
