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
    .input(z.object({ previewId: z.string().optional() }).optional())
    .query(async ({ input }) => {
      const { previewId } = input || {};

      const markets = await prisma.market.findMany({
        where: previewId ? { id: previewId } : { isActive: true },
        include: {
          videos: { orderBy: { order: "asc" } },
          conspiraInfos: { orderBy: { order: "asc" } },
        },
        orderBy: { createdAt: "desc" },
      });

      const result = [];
      for (const market of markets) {
        let tweets: ITweetFullData[] = [];

        if (market.tweetSearchPhrase) {
          const cachedTweets = await searchTweetsCached(
            market.tweetSearchPhrase,
          );
          tweets = cachedTweets.data;
        }

        // Transform database format to match expected event format
        const event = {
          name: market.name,
          eventVideo: market.videos[0]?.videoUrl ?? null,
          eventTitle: market.eventTitle,
          eventDescription: market.eventDescription,
          marketSlug: market.marketSlug,
          tweetSearchPhrase: market.tweetSearchPhrase,
          historicPricesTokens: {
            yesTokenMint: market.yesTokenMint,
            noTokenMint: market.noTokenMint,
          },
          eventLinks: {
            PMX: market.pmxLink ?? null,
            JUPITER: market.jupiterLink ?? null,
          },
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
      const pmxMarketResponse = (await pmxApiClient.get(
        `presale-markets?select=*&slug=eq.${input.marketSlug}`,
      )) as AxiosResponse<IPMXGetPresaleMarketDetails[]>;

      return pmxMarketResponse.data[0];
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
