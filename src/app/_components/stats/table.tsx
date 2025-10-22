"use client";
import { cn } from "@sglara/cn";
import React, { useEffect, useMemo, useRef } from "react";
import { JupiterIcon, PmxIcon, CloseIcon } from "./statsIcons";
import type { IMarketHistory } from "~/server/schemas";
import { prepareTableData } from "~/app/utils/tableUtils";
import { useViewport } from "~/app/providers/ViewportProvider";
import PlatformButton from "../buttons/platform-btn";

interface StatsTableProps {
  marketSlug: string;
  yesHistory: IMarketHistory | undefined;
  noHistory: IMarketHistory | undefined;
  onClose: () => void;
  selectedOutcome: "Yes" | "No";
  yesTokenMint: string;
  noTokenMint: string;
}

const StatsTable: React.FC<StatsTableProps> = (props) => {
  const { isMobile, isDesktop } = useViewport();
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        isMobile &&
        !modalRef.current.contains(event.target as Node)
      ) {
        props.onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [props.onClose]);
  const activity = useMemo(() => {
    if (props.yesHistory?.historicalData && props.noHistory?.historicalData) {
      const prepareData = prepareTableData(
        props.yesHistory?.historicalData,
        props.noHistory?.historicalData,
      );
      // Filter to only show trades for the selected outcome
      return prepareData.filter((item) => item.type === props.selectedOutcome);
    }
    return [];
  }, [props.yesHistory, props.noHistory, props.selectedOutcome]);

  const openTrade = (type: "PMX" | "JUPITER") => {
    switch (type) {
      case "PMX":
        window.open(`https://pmx.trade/markets/${props.marketSlug}`, "_blank");
        break;
      case "JUPITER":
        // Use the correct token mint based on selected outcome
        const tokenMint =
          props.selectedOutcome === "Yes"
            ? props.yesTokenMint
            : props.noTokenMint;
        if (tokenMint) {
          window.open(`https://jup.ag/tokens/${tokenMint}`, "_blank");
        }
        break;
    }
  };
  return (
    <div
      ref={modalRef}
      className={cn(
        "bg-base-gray pointer-events-auto relative z-10 flex flex-col rounded-2xl text-amber-50 backdrop-blur-[100px]",
        {
          "min-w-[658px] gap-8 px-8 py-6": isDesktop,
          "w-full gap-4 p-3": isMobile,
        },
      )}
    >
      {isDesktop && (
        <div
          onClick={props.onClose}
          className="absolute top-3 right-3 m-auto size-6 cursor-pointer rounded-full text-center text-[15px]"
        >
          <CloseIcon />
        </div>
      )}

      <div className="flex min-h-60 flex-col gap-4">
        <div
          className={cn(
            "grid justify-start text-left text-[0.75rem] font-normal text-white/30",
            {
              "grid-cols-[repeat(2,1fr)_180px_minmax(70px,auto)]": isDesktop,
              "grid-cols-[repeat(2,1fr)_22vw_minmax(17vw,auto)]": isMobile,
            },
          )}
        >
          <div>Lastest</div>
          <div>Probability</div>
          <div>Price</div>
          <div>Time</div>
        </div>
        <div className="min-h-60">
          {activity.map((item, idx) => (
            <div
              key={idx}
              className={cn(
                "mb-2 grid justify-start text-left text-[0.75rem]",
                {
                  "grid-cols-[repeat(2,1fr)_180px_minmax(70px,auto)]":
                    isDesktop,
                  "grid-cols-[repeat(2,1fr)_22vw_minmax(17vw,auto)]": isMobile,
                },
              )}
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
      <div className="grid h-12 grid-cols-2 place-items-center gap-2 text-[0.75rem] text-nowrap">
        {/* <div
          onClick={() => openTrade("PMX")}
          className="bg-base-dark-gray flex h-full w-full cursor-pointer items-center justify-center gap-3.5 rounded-xl border-1 border-white/10"
        >
          <PmxIcon />
          Trade om PMX
        </div> */}
        <PlatformButton
          icon={<PmxIcon />}
          text="Trade on PMX"
          click={() => openTrade("PMX")}
          styles="bg-base-dark-gray"
        />
        <PlatformButton
          icon={<JupiterIcon />}
          text="Trade on Jupiter"
          click={() => openTrade("JUPITER")}
          styles="bg-base-blue border-white/10"
        />
      </div>
    </div>
  );
};

export default StatsTable;
