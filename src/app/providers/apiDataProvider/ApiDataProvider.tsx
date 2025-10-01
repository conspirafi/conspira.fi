"use client";

import React, { type ReactNode, useMemo } from "react";
import { api } from "~/trpc/react";
import { ApiDataContext } from "./ApiDataContext";

interface ApiDataProviderProps {
  children: ReactNode;
}

export const ApiDataProvider: React.FC<ApiDataProviderProps> = ({
  children,
}) => {
  const {
    data: marketData,
    isLoading: isLoadingMarket,
    error: marketError,
    refetch: refetchMarket,
  } = api.pmxMarketRouter.getMarket.useQuery();

  const {
    data: marketFeesData,
    isLoading: isLoadingMarketFees,
    error: marketFeesError,
    refetch: refetchMarketFees,
  } = api.pmxMarketRouter.getMarketFees.useQuery();

  const {
    data: marketPresaleDetailsData,
    isLoading: isLoadingPresaleMarketDetails,
    error: marketPresaleDetailsError,
    refetch: refetchMarketPresaleDetails,
  } = api.pmxMarketRouter.getPresaleMarketDetails.useQuery();

  const {
    data: marketPriceHistoryYesData,
    isLoading: isMarketPriceHistoryYes,
    error: marketPriceHistoryYesError,
    refetch: refetchMarketPriceHistoryYes,
  } = api.pmxMarketRouter.getMarketHistory.useQuery({ type: "YES" });

  const {
    data: marketPriceHistoryNoData,
    isLoading: isMarketPriceHistoryNo,
    error: marketPriceHistoryNoError,
    refetch: refetchMarketPriceHistoryNo,
  } = api.pmxMarketRouter.getMarketHistory.useQuery({ type: "NO" });

  const contextValue = useMemo(
    () => ({
      marketData: marketData || undefined,
      isLoadingMarket,
      marketError,
      refetchMarket,

      marketFeesData: marketFeesData || undefined,
      isLoadingMarketFees,
      marketFeesError,
      refetchMarketFees,

      marketPresaleDetailsData: marketPresaleDetailsData || undefined,
      isLoadingPresaleMarketDetails,
      marketPresaleDetailsError,
      refetchMarketPresaleDetails,

      marketPriceHistoryYesData,
      isMarketPriceHistoryYes,
      marketPriceHistoryYesError,
      refetchMarketPriceHistoryYes,

      marketPriceHistoryNoData,
      isMarketPriceHistoryNo,
      marketPriceHistoryNoError,
      refetchMarketPriceHistoryNo,
    }),
    [
      marketData,
      isLoadingMarket,
      marketError,
      refetchMarket,

      marketFeesData,
      isLoadingMarketFees,
      marketFeesError,
      refetchMarketFees,

      marketPresaleDetailsData,
      isLoadingPresaleMarketDetails,
      marketPresaleDetailsError,
      refetchMarketPresaleDetails,

      marketPriceHistoryYesData,
      isMarketPriceHistoryYes,
      marketPriceHistoryYesError,
      refetchMarketPriceHistoryYes,

      marketPriceHistoryNoData,
      isMarketPriceHistoryNo,
      marketPriceHistoryNoError,
      refetchMarketPriceHistoryNo,
    ],
  );

  return (
    <ApiDataContext.Provider value={contextValue}>
      {children}
    </ApiDataContext.Provider>
  );
};
