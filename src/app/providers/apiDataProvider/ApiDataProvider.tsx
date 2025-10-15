"use client";

import React, { type ReactNode, useMemo, useEffect, useState } from "react";
import { api } from "~/trpc/react";
import { ApiDataContext } from "./ApiDataContext";
import { useEventCasesStore } from "~/app/store/useEventStore";

interface ApiDataProviderProps {
  children: ReactNode;
}

export const ApiDataProvider: React.FC<ApiDataProviderProps> = ({
  children,
}) => {
  const [previewId, setPreviewId] = useState<string | undefined>(undefined);
  const { activeEventCase } = useEventCasesStore();

  useEffect(() => {
    // Check for preview parameter in URL
    const params = new URLSearchParams(window.location.search);
    const preview = params.get("preview");
    if (preview) {
      setPreviewId(preview);
    }
  }, []);

  // Get marketSlug from active event case
  const marketSlug = activeEventCase?.marketSlug || "";
  const yesTokenMint = activeEventCase?.historicPricesTokens.yesTokenMint || "";
  const noTokenMint = activeEventCase?.historicPricesTokens.noTokenMint || "";

  const {
    data: marketData,
    isLoading: isLoadingMarket,
    error: marketError,
    refetch: refetchMarket,
  } = api.pmxMarketRouter.getMarket.useQuery(
    { marketSlug },
    { enabled: !!marketSlug },
  );

  const {
    data: marketFeesData,
    isLoading: isLoadingMarketFees,
    error: marketFeesError,
    refetch: refetchMarketFees,
  } = api.pmxMarketRouter.getMarketFees.useQuery(
    { marketSlug },
    { enabled: !!marketSlug },
  );

  const {
    data: fundingSnapshotData,
    isLoading: isLoadingFundingSnapshot,
    error: fundingSnapshotError,
    refetch: refetchFundingSnapshot,
  } = api.pmxMarketRouter.getFundingSnapshot.useQuery(
    { marketSlug },
    { enabled: !!marketSlug },
  );

  const {
    data: marketPresaleDetailsData,
    isLoading: isLoadingMarketPresaleDetails,
    error: marketPresaleDetailsError,
    refetch: refetchMarketPresaleDetails,
  } = api.pmxMarketRouter.getPresaleMarketDetails.useQuery(
    { marketSlug },
    { enabled: !!marketSlug },
  );

  const {
    data: marketPriceHistoryYesData,
    isLoading: isMarketPriceHistoryYes,
    error: marketPriceHistoryYesError,
    refetch: refetchMarketPriceHistoryYes,
  } = api.pmxMarketRouter.getMarketHistory.useQuery(
    {
      type: "YES",
      tokenMints: {
        yesTokenMints: yesTokenMint,
        noTokenMint: noTokenMint,
      },
    },
    { enabled: !!yesTokenMint && !!noTokenMint },
  );

  const {
    data: marketPriceHistoryNoData,
    isLoading: isMarketPriceHistoryNo,
    error: marketPriceHistoryNoError,
    refetch: refetchMarketPriceHistoryNo,
  } = api.pmxMarketRouter.getMarketHistory.useQuery(
    {
      type: "NO",
      tokenMints: {
        yesTokenMints: yesTokenMint,
        noTokenMint: noTokenMint,
      },
    },
    { enabled: !!yesTokenMint && !!noTokenMint },
  );

  const contextValue = useMemo(
    () => ({
      marketData: marketData ?? null,
      isLoadingMarket,
      marketError,
      refetchMarket,

      marketFeesData: marketFeesData ?? null,
      isLoadingMarketFees,
      marketFeesError,
      refetchMarketFees,

      fundingSnapshotData: fundingSnapshotData ?? null,
      isLoadingFundingSnapshot,
      fundingSnapshotError,
      refetchFundingSnapshot,

      marketPresaleDetailsData: marketPresaleDetailsData || undefined,
      isLoadingMarketPresaleDetails,
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

      fundingSnapshotData,
      isLoadingFundingSnapshot,
      fundingSnapshotError,
      refetchFundingSnapshot,

      marketPresaleDetailsData,
      isLoadingMarketPresaleDetails,
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
