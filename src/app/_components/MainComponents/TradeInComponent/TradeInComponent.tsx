"use client";

import StatsTable from "../../stats/table";
import LineChart from "../../chart/line-chart";
import VoteSection from "../../vote-section/vote-section";
import type {
  IMarketHistory,
  IPMXGetMarket,
  IPMXGetMarketFees,
} from "~/server/schemas";
import { useMemo, useState } from "react";
import { roundToTwoDecimals } from "~/app/utils/math";
import { useViewport } from "~/app/providers/ViewportProvider";
import { cn } from "@sglara/cn";
import { AnimatePresence, motion } from "framer-motion";
import ShowLeaksBtn from "../../buttons/show-leaks-btn";
import { useConspirafiStore } from "~/app/store/conspirafiStore";
import { useEventCasesStore } from "~/app/store/useEventStore";

const conspirafiVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
};
interface TradeInProps {
  yesHistory: IMarketHistory | undefined;
  noHistory: IMarketHistory | undefined;
  market: IPMXGetMarket | null;
  marketFees: IPMXGetMarketFees | null;
  volumePercentage?: number;
}

type HistoryType = "Yes" | "No";

function splitData(
  data: {
    market_cap: number;
    price: number;
    timestamp: string;
    volume: number;
  }[],
): { labels: string[]; values: number[] } {
  const labels = data.map((item) => item.timestamp);
  const values = data.map((item) => item.price);
  return { labels, values };
}

export const TradeInComponent = (props: TradeInProps) => {
  const { isVisible: isConspirafiVisible } = useConspirafiStore();
  const { activeEventCase } = useEventCasesStore();

  const { isMobile, isDesktop } = useViewport();
  const [showTable, setShowTable] = useState(false);
  const [selectedOutcome, setSelectedOutcome] = useState<HistoryType | null>(
    null,
  );
  const [selectedHistory, setSelectedHistory] = useState<{
    labels: string[];
    values: number[];
  }>({
    labels: [],
    values: [],
  });

  const chartData = useMemo(() => {
    const yesData = props.yesHistory
      ? splitData(props.yesHistory?.historicalData)
      : { labels: [], values: [] };
    const noData = props.noHistory
      ? splitData(props.noHistory?.historicalData)
      : { labels: [], values: [] };
    return { yesChart: yesData, noChart: noData };
  }, [props.yesHistory?.historicalData, props.noHistory]);

  const volume = useMemo(() => {
    if (
      props.marketFees &&
      props.marketFees.totalFees &&
      typeof props.marketFees.totalFees.total === "number"
    ) {
      const percentage = props.volumePercentage ?? 33.33;
      return roundToTwoDecimals(props.marketFees.totalFees.total * percentage);
    }
    return 0;
  }, [props.marketFees, props.volumePercentage]);

  const percent = useMemo(() => {
    const rawPrice = {
      yes: props.yesHistory?.historicalData[0]?.price || 0,
      no: props.noHistory?.historicalData[0]?.price || 0,
    };

    const total =
      parseFloat(rawPrice.yes.toString()) + parseFloat(rawPrice.no.toString());
    if (total === 0) {
      return { yes: 50, no: 50 };
    }

    const yesPercentage = (rawPrice.yes / total) * 100;
    const noPercentage = (rawPrice.no / total) * 100;

    return {
      yes: parseFloat(yesPercentage.toFixed(1)),
      no: parseFloat(noPercentage.toFixed(1)),
    };
  }, [props.yesHistory, props.noHistory]);

  const setCurrentHistory = (type: HistoryType) => {
    const currentChartData =
      type === "Yes" ? chartData.yesChart : chartData.noChart;
    setSelectedHistory(currentChartData);
    setSelectedOutcome(type);
    setShowTable(true);
  };

  return (
    <div
      className={cn(
        "pointer-events-none z-40 flex h-screen w-full flex-col items-center justify-end gap-[16px]",
        { "p-2.5": isMobile, "p-[15px]": isDesktop },
      )}
    >
      <AnimatePresence>
        {!isConspirafiVisible && !showTable && (
          <motion.div
            key="conspirafi-info-show-leaks"
            className="pointer-events-auto"
            variants={conspirafiVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <ShowLeaksBtn />
          </motion.div>
        )}
      </AnimatePresence>
      {showTable && selectedOutcome && (
        <>
          <StatsTable
            onClose={() => setShowTable(false)}
            yesHistory={props.yesHistory}
            noHistory={props.noHistory}
            marketSlug={props.market?.slug || ""}
            pmxLink={activeEventCase?.eventLinks.PMX || ""}
            selectedOutcome={selectedOutcome}
            yesTokenMint={props.market?.cas?.YES?.tokenMint || ""}
            noTokenMint={props.market?.cas?.NO?.tokenMint || ""}
          />
          <LineChart
            labels={selectedHistory.labels}
            values={selectedHistory.values}
          />
        </>
      )}

      {/* Only show vote section if we have active market data from PMX */}
      {props.market && (
        <VoteSection
          volume={volume}
          percent={percent}
          setHistoryType={setCurrentHistory}
        />
      )}
    </div>
  );
};
