"use client";

import Overlay from "../../shared/Overlay/Overlay";

import "./HomeComponent.scss";
import { TradeInComponent } from "../TradeInComponent/TradeInComponent";
import { useApiData } from "~/app/providers/apiDataProvider/useApiData";
import FullScreenSpawner from "../../full-screen-spawner/full-screen-spawner";
import { FundingStateComponent } from "../FundingStateComponent/FundingStateComponent";

import { useEventCasesStore } from "~/app/store/useEventStore";
import { type Easing, AnimatePresence, motion } from "framer-motion";
import { useOnboardingStore } from "~/app/store/onboardingStore";
import ConspirafiInfo from "../../conspirafi-info/ConspirafiInfo";
import { useConspirafiStore } from "~/app/store/conspirafiStore";
import BackBtn from "../../buttons/back-btn";

const contentVariants = {
  hidden: { opacity: 0, y: 0 },
  visible: { opacity: 1, y: 0 },
};

const transition = {
  duration: 0.5,
  ease: [0.43, 0.13, 0.23, 0.96] as Easing,
};

const conspirafiVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
};

const HomeComponent: React.FC = () => {
  const { activeEventCase } = useEventCasesStore();
  const { isVisible: isConspirafiVisible } = useConspirafiStore();

  const { isOnboarding } = useOnboardingStore();
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
      {!isOnboarding && (
        <main className="bg-from-black flex min-h-screen w-screen">
          <AnimatePresence mode="wait">
            {activeEventCase?.isActive && (
              <motion.div
                key={activeEventCase.marketSlug}
                className="h-full w-full"
              >
                <AnimatePresence mode="wait">
                  {isFundingState ? (
                    <motion.div
                      key="funding-state"
                      variants={contentVariants}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      transition={transition}
                    >
                      <FundingStateComponent
                        data={marketPresaleDetailsData}
                        fundingSnapshot={fundingSnapshotData}
                      />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="trade-in-state"
                      variants={contentVariants}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      transition={transition}
                    >
                      <TradeInComponent
                        marketFees={marketFeesData}
                        market={marketData}
                        yesHistory={marketPriceHistoryYesData}
                        noHistory={marketPriceHistoryNoData}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>

          {activeEventCase?.isActive && <FullScreenSpawner />}

          <AnimatePresence>
            {isConspirafiVisible && (
              <motion.div
                key="conspirafi-info-back-btn"
                className="pointer-events-auto fixed bottom-0 left-1/2 z-[100] -translate-x-1/2"
                variants={conspirafiVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <BackBtn />
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {isConspirafiVisible && (
              <motion.div
                className="absolute inset-0 z-20"
                key="conspirafi-info"
                variants={conspirafiVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <ConspirafiInfo />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      )}
    </Overlay>
  );
};

export default HomeComponent;
