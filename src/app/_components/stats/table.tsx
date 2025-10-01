"use client";
import { cn } from "@sglara/cn";
import React, { useMemo, useState } from "react";
import {
  AxiomIcon,
  JupiterIcon,
  ArrowUpRight,
  PmxIcon,
  CloseIcon,
} from "./statsIcons";
import type { IMarketHistory } from "~/server/schemas";
import { prepareTableData, type Activity } from "~/app/utils/tableUtils";

interface StatsTableProps {
  marketSlug: string;
  yesHistory: IMarketHistory | undefined;
  noHistory: IMarketHistory | undefined;
  onClose: () => void;
}

const StatsTable: React.FC<StatsTableProps> = (props) => {
  const activity = useMemo(() => {
    if (props.yesHistory?.historicalData && props.noHistory?.historicalData) {
      const prepareData = prepareTableData(
        props.yesHistory?.historicalData,
        props.noHistory?.historicalData,
      );
      return prepareData;
    }
    return [];
  }, [props.yesHistory, props.noHistory]);

  const openTrade = (type: "PMX" | "JUPITER" | "AXIOM") => {
    switch (type) {
      case "PMX":
        window.open(`https://pmx.trade/markets/${props.marketSlug}`);
        break;
      case "JUPITER":
        window.open("https://pmx.trade/markets/");
        break;
      case "AXIOM":
        window.open("https://pmx.trade/markets/");
        break;
    }
  };
  return (
    <div className="bg-base-gray pointer-events-auto relative z-10 flex min-w-[658px] flex-col gap-8 rounded-2xl px-8 py-6 text-amber-50 backdrop-blur-[100px]">
      <div
        onClick={props.onClose}
        className="absolute top-3 right-3 m-auto size-6 cursor-pointer rounded-full text-center text-[15px]"
      >
        <CloseIcon />
      </div>
      <div className="flex min-h-60 flex-col gap-4">
        <div className="grid grid-cols-[repeat(2,1fr)_180px_minmax(70px,auto)] justify-start text-left text-[0.75rem] font-normal text-white/30">
          <div>Lastest activity</div>
          <div>Procent</div>
          <div>Profit</div>
          <div>Time</div>
        </div>
        <div className="min-h-60">
          {activity.map((item, idx) => (
            <div
              key={idx}
              className="mb-2 grid grid-cols-[repeat(2,1fr)_180px_minmax(70px,auto)] justify-start text-left text-[0.75rem]"
            >
              <div className="flex text-left">
                <div
                  className={cn(
                    "text-base-green flex gap-1 rounded-[20px] px-4 py-1",
                    {
                      "bg-base-green/10": item.type === "Yes",
                      "text-base-red": item.type === "No",
                      "bg-base-red/10": item.type === "No",
                    },
                  )}
                >
                  <span>{item.lastest_activity}</span>
                </div>
              </div>
              <div>{item.procent}</div>
              <div>${item.price}</div>
              <div>
                <div className="flex items-center justify-start gap-0.5 text-white/30">
                  {item.time}
                  {/* <div className="flex size-4 items-center justify-center opacity-30">
                    <ArrowUpRight />
                  </div> */}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="grid h-12 grid-cols-3 place-items-center gap-3.5 text-[0.75rem] text-nowrap">
        <div
          onClick={() => openTrade("PMX")}
          className="bg-base-dark-gray m-auto flex h-full w-[188px] cursor-pointer items-center justify-center gap-3.5 rounded-xl border-1 border-white/10"
        >
          <PmxIcon />
          Trade om PMX
        </div>
        <div
          onClick={() => openTrade("JUPITER")}
          className="bg-base-blue flex h-full w-[188px] cursor-pointer items-center justify-center gap-3.5 rounded-xl border-1 border-white/10"
        >
          <JupiterIcon />
          <span>Trade on Jupiter</span>
        </div>
        <div
          onClick={() => openTrade("AXIOM")}
          className="bg-base-black flex h-full w-[188px] cursor-pointer items-center justify-center gap-3.5 rounded-xl border-1 border-white/10"
        >
          <AxiomIcon />
          <span>Trade on Axiom</span>
        </div>
      </div>
    </div>
  );
};

export default StatsTable;
