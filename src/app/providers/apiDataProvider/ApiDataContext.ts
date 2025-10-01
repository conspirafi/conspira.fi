import type { QueryObserverResult } from "@tanstack/react-query";
import type { TRPCClientErrorLike } from "@trpc/client";
import React from "react";
import type { AppRouter } from "~/server/api/root";
import type {
  IMarketHistory,
  IPMXGetMarket,
  IPMXGetMarketFees,
  IPMXGetPresaleMarketDetails,
} from "~/server/schemas";

export interface ApiDataContextType {
  marketData: IPMXGetMarket | undefined;
  isLoadingMarket: boolean;
  marketError: TRPCClientErrorLike<AppRouter> | null;
  refetchMarket: () => Promise<
    QueryObserverResult<
      IPMXGetMarket | undefined,
      TRPCClientErrorLike<AppRouter>
    >
  >;

  marketFeesData: IPMXGetMarketFees | undefined;
  isLoadingMarketFees: boolean;
  marketFeesError: TRPCClientErrorLike<AppRouter> | null;
  refetchMarketFees: () => Promise<
    QueryObserverResult<
      IPMXGetMarketFees | undefined,
      TRPCClientErrorLike<AppRouter>
    >
  >;

  marketPresaleDetailsData: IPMXGetPresaleMarketDetails | undefined;
  isLoadingMarketPresaleDetails: boolean;
  marketPresaleDetailsError: TRPCClientErrorLike<AppRouter> | null;
  refetchMarketPresaleDetails: () => Promise<
    QueryObserverResult<
      IPMXGetPresaleMarketDetails | undefined,
      TRPCClientErrorLike<AppRouter>
    >
  >;

  marketPriceHistoryYesData: IMarketHistory | undefined;
  isMarketPriceHistoryYes: boolean;
  marketPriceHistoryYesError: TRPCClientErrorLike<AppRouter> | null;
  refetchMarketPriceHistoryYes: () => Promise<
    QueryObserverResult<
      IMarketHistory | undefined,
      TRPCClientErrorLike<AppRouter>
    >
  >;

  marketPriceHistoryNoData: IMarketHistory | undefined;
  isMarketPriceHistoryNo: boolean;
  marketPriceHistoryNoError: TRPCClientErrorLike<AppRouter> | null;
  refetchMarketPriceHistoryNo: () => Promise<
    QueryObserverResult<
      IMarketHistory | undefined,
      TRPCClientErrorLike<AppRouter>
    >
  >;
}

export const ApiDataContext = React.createContext<
  ApiDataContextType | undefined
>(undefined);
