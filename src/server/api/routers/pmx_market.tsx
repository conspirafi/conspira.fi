import { createTRPCRouter, publicProcedure } from "../trpc";
import type { AxiosResponse } from "axios";
import z from "zod";
import { prisma } from "~/server/db";
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
  getEvents: publicProcedure
    .input(
      z
        .object({
          previewId: z.string().optional(),
          marketSlug: z.string().optional(),
        })
        .optional(),
    )
    .query(async ({ input }) => {
      const { previewId, marketSlug } = input || {};

      // Determine query filter based on input
      let whereClause: any;
      if (previewId) {
        // Preview mode: get specific market by ID
        whereClause = { id: previewId };
      } else if (marketSlug) {
        // Direct access: get specific market by slug
        whereClause = { marketSlug, isActive: true };
      } else {
        // Default: get all active markets
        whereClause = { isActive: true };
      }

      const markets = await prisma.market.findMany({
        where: whereClause,
        include: {
          videos: { orderBy: { order: "asc" } },
          conspiraInfos: { orderBy: { order: "asc" } },
        },
        orderBy: { createdAt: "desc" },
      });

      const result = [];
      for (const market of markets) {
        // Fetch token mints dynamically from PMX API (not stored in DB)
        let yesTokenMint = "";
        let noTokenMint = "";

        try {
          const pmxResponse = (await pmxApiClient.get(
            `markets?select=*&slug=eq.${market.marketSlug}`,
          )) as AxiosResponse<IPMXGetMarket[]>;

          const pmxMarket = pmxResponse.data[0];
          if (pmxMarket?.cas?.YES?.tokenMint && pmxMarket?.cas?.NO?.tokenMint) {
            yesTokenMint = pmxMarket.cas.YES.tokenMint;
            noTokenMint = pmxMarket.cas.NO.tokenMint;
          }
        } catch (error) {
          // Market might still be in presale or API error
          console.log(
            `[PMX] Could not fetch token mints for ${market.marketSlug}:`,
            error instanceof Error ? error.message : "Unknown error",
          );
        }

        let tweets: ITweetFullData[] = [];

        if (market.tweetSearchPhrase) {
          try {
            console.log(
              `[Tweets] Fetching tweets for phrase: "${market.tweetSearchPhrase}"`,
            );
            const cachedTweets = await searchTweetsCached(
              market.tweetSearchPhrase,
            );
            tweets = cachedTweets.data;
            console.log(
              `[Tweets] Found ${tweets.length} tweets for market: ${market.name}`,
            );
          } catch (error) {
            console.error(
              `[Tweets] Error fetching tweets for "${market.tweetSearchPhrase}":`,
              error,
            );
            tweets = [];
          }
        } else {
          console.log(
            `[Tweets] No tweet search phrase set for market: ${market.name}`,
          );
        }

        // Generate dynamic Jupiter links from fetched token mints
        const jupiterYesLink = yesTokenMint
          ? `https://jup.ag/tokens/${yesTokenMint}`
          : null;
        const jupiterNoLink = noTokenMint
          ? `https://jup.ag/tokens/${noTokenMint}`
          : null;

        // Generate PMX link from market slug
        const pmxLink = `https://pmx.trade/markets/${market.marketSlug}`;

        // Transform database format to match expected event format
        const event = {
          name: market.name,
          eventVideo: market.videos[0]?.videoUrl ?? null,
          eventTitle: market.eventTitle,
          eventDescription: market.eventDescription,
          marketSlug: market.marketSlug,
          tweetSearchPhrase: market.tweetSearchPhrase,
          marketEndTime: market.marketEndTime?.toISOString() ?? null,
          historicPricesTokens: {
            yesTokenMint,
            noTokenMint,
          },
          eventLinks: {
            PMX: pmxLink,
            JUPITER: jupiterYesLink,
            JUPITER_YES: jupiterYesLink,
            JUPITER_NO: jupiterNoLink,
          },
          volumePercentage: market.volumePercentage,
          isActive: market.isActive,
          conspiraInfoId: market.id,
          tweets,
          // Include conspiraInfos for the new system
          conspiraInfos: market.conspiraInfos.map((info) => ({
            type: info.type as "youtube" | "article" | "podcast",
            link: info.link ?? undefined,
            imgSrc: info.imgSrc ?? undefined,
            title: info.title,
            date: info.date,
          })),
        };
        result.push(event);
      }
      return result;
    }),
  getPresaleMarketDetails: publicProcedure
    .input(z.object({ marketSlug: z.string() }))
    .query(async ({ input }) => {
      try {
        const pmxMarketResponse = (await pmxApiClient.get(
          `presale-markets?select=*&slug=eq.${input.marketSlug}`,
        )) as AxiosResponse<IPMXGetPresaleMarketDetails[]>;

        return pmxMarketResponse.data[0] || null;
      } catch (error) {
        console.log(
          `[PMX] Could not fetch presale market details for ${input.marketSlug}:`,
          error instanceof Error
            ? error.message
            : "Market not found on PMX yet",
        );
        return null;
      }
    }),
  getFundingSnapshot: publicProcedure
    .input(z.object({ marketSlug: z.string() }))
    .query(async ({ input }) => {
      try {
        const pmxMarketFeesResponse = (await pmxFeesApiClient.post(
          `snapshot-funding-wallets`,
          {
            marketSlug: input.marketSlug,
          },
        )) as AxiosResponse<IFundingSnapshot>;
        return pmxMarketFeesResponse.data;
      } catch {
        return null;
      }
    }),
  getMarket: publicProcedure
    .input(z.object({ marketSlug: z.string() }))
    .query(async ({ input }) => {
      try {
        const pmxMarketResponse = (await pmxApiClient.get(
          `markets?select=*&slug=eq.${input.marketSlug}`,
        )) as AxiosResponse<IPMXGetMarket[]>;
        return pmxMarketResponse.data[0] || null;
      } catch {
        return null;
      }
    }),
  getMarketFees: publicProcedure
    .input(z.object({ marketSlug: z.string() }))
    .query(async ({ input }) => {
      try {
        const pmxMarketFeesResponse = (await pmxFeesApiClient.get(
          `markets/${input.marketSlug}/fees`,
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
        tokenMints: z.object({
          yesTokenMints: z.string(),
          noTokenMint: z.string(),
        }),
        limit: z.number().optional(),
      }),
    )
    .query(async ({ input }) => {
      const tokenMint =
        input.type === "YES"
          ? input.tokenMints.yesTokenMints
          : input.tokenMints.noTokenMint;
      const limit = input.limit ? input.limit : "7";
      const historyMarketResponse = (await historicPricesApiClient.get(
        `${tokenMint}/history?limit=${limit}`,
      )) as AxiosResponse<IMarketHistory>;
      return historyMarketResponse.data;
    }),
});
