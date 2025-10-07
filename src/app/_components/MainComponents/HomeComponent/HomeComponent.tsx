"use client";

import Overlay from "../../shared/Overlay/Overlay";

import "./HomeComponent.scss";
import { TradeInComponent } from "../TradeInComponent/TradeInComponent";
import { useApiData } from "~/app/providers/apiDataProvider/useApiData";
import FullScreenSpawner from "../../full-screen-spawner/full-screen-spawner";
import { FundingStateComponent } from "../FundingStateComponent/FundingStateComponent";

import { xDataStore } from "~/app/store/xDataStore";

const HomeComponent: React.FC = () => {
  const {
    marketFeesData,
    fundingSnapshotData,
    marketData,
    marketPresaleDetailsData,
    marketPriceHistoryYesData,
    marketPriceHistoryNoData,
    isLoadingMarket,
    isLoadingMarketFees,
    isLoadingFundingSnapshot,
    isMarketPriceHistoryYes,
    isMarketPriceHistoryNo,
    marketError,
    marketFeesError,
    marketPresaleDetailsError,
    marketPriceHistoryYesError,
    marketPriceHistoryNoError,
    fundingSnapshotError,
  } = useApiData();

  const isInitialLoading =
    isLoadingFundingSnapshot ||
    isLoadingMarket ||
    isLoadingMarketFees ||
    isMarketPriceHistoryYes ||
    isMarketPriceHistoryNo;

  const anyError =
    fundingSnapshotError ||
    marketError ||
    marketFeesError ||
    marketPresaleDetailsError ||
    marketPriceHistoryYesError ||
    marketPriceHistoryNoError;

  if (isInitialLoading) {
    return <div></div>;
  }
  if (marketPresaleDetailsError) {
    return (
      <div>
        Error loading market details: {marketPresaleDetailsError.message}
      </div>
    );
  }

  if (anyError) {
    return <div>Error loading data: {anyError.message}</div>;
  }

  const isFundingState = marketPresaleDetailsData
    ? !(
        marketPresaleDetailsData.migrated &&
        fundingSnapshotData?.summary.targetReached
      )
    : true;

  return (
    <Overlay data={marketPresaleDetailsData} marketFees={marketFeesData}>
      <main className="bg-from-black flex min-h-screen w-screen">
        {isFundingState ? (
          <FundingStateComponent
            data={marketPresaleDetailsData}
            fundingSnapshot={fundingSnapshotData}
          />
        ) : (
          <TradeInComponent
            marketFees={marketFeesData}
            market={marketData}
            yesHistory={marketPriceHistoryYesData}
            noHistory={marketPriceHistoryNoData}
          />
        )}
        <FullScreenSpawner tweets={xDataStore} />
      </main>
    </Overlay>
  );
};

export default HomeComponent;
