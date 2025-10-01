import { createTRPCRouter, publicProcedure } from "../trpc";
import type { AxiosResponse } from "axios";
import z from "zod";
import {
  historicPricesApiClient,
  pmxApiClient,
  pmxFeesApiClient,
} from "~/server/lib/axiosConfig";
import type {
  IMarketHistory,
  IPMXGetMarket,
  IPMXGetMarketFees,
  IPMXGetPresaleMarketDetails,
} from "~/server/schemas";

export const pmxMarketRouter = createTRPCRouter({
  getPresaleMarketDetails: publicProcedure.query(async () => {
    const pmxMarketResponse = (await pmxApiClient.get(
      `presale-markets?select=*&slug=eq.${process.env.MARKET_SLUG}`,
    )) as AxiosResponse<IPMXGetPresaleMarketDetails[]>;

    return pmxMarketResponse.data[0];
  }),
  getMarket: publicProcedure.query(async () => {
    try {
      const pmxMarketResponse = (await pmxApiClient.get(
        `markets?select=*&slug=eq.${process.env.MARKET_SLUG}`,
      )) as AxiosResponse<IPMXGetMarket[]>;
      return pmxMarketResponse.data[0] || null;
    } catch {
      return null;
    }
  }),
  getMarketFees: publicProcedure.query(async () => {
    try {
      const pmxMarketFeesResponse = (await pmxFeesApiClient.get(
        `markets/${process.env.MARKET_SLUG}/fees`,
      )) as AxiosResponse<IPMXGetMarketFees>;
      return pmxMarketFeesResponse.data;
    } catch {
      return null;
    }
  }),
  getMarketHistory: publicProcedure
    .input(
      z.object({ type: z.enum(["YES", "NO"]), limit: z.number().optional() }),
    )
    .query(async ({ input }) => {
      const tokenMint =
        input.type === "YES"
          ? process.env.HISTORIC_PRICES_API_YES_TOKEN_MINT
          : process.env.HISTORIC_PRICES_API_NO_TOKEN_MINT;
      const limit = input.limit ? input.limit : "7";
      const historyMarketResponse = (await historicPricesApiClient.get(
        `${tokenMint}/history?limit=${limit}`,
      )) as AxiosResponse<IMarketHistory>;
      return historyMarketResponse.data;
    }),
});
