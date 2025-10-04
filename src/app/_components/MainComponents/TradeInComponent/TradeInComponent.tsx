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

interface TradeInProps {
  yesHistory: IMarketHistory | undefined;
  noHistory: IMarketHistory | undefined;
  market: IPMXGetMarket | null;
  marketFees: IPMXGetMarketFees | null;
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
  const { isMobile, isDesktop } = useViewport();
  const [showTable, setShowTable] = useState(false);
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
      return roundToTwoDecimals(props.marketFees.totalFees.total * 25);
    }
    return 0;
  }, [props.marketFees]);

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
    setShowTable(true);
  };

  return (
    <div
      className={cn(
        "pointer-events-none z-40 flex h-screen w-full flex-col items-center justify-end gap-[16px]",
        { "p-2.5": isMobile, "p-[15px]": isDesktop },
      )}
    >
      {showTable && (
        <>
          <StatsTable
            onClose={() => setShowTable(false)}
            yesHistory={props.yesHistory}
            noHistory={props.noHistory}
            marketSlug={props.market?.slug || ""}
          />
          <LineChart
            labels={selectedHistory.labels}
            values={selectedHistory.values}
          />
        </>
      )}

      <VoteSection
        volume={volume}
        percent={percent}
        setHistoryType={setCurrentHistory}
      />
    </div>
  );
};
