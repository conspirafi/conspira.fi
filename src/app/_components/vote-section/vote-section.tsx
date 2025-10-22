import { formatPriceToPercentFloor } from "~/app/utils/math";
import VoteBtn from "../buttons/vote-btn";
import { useViewport } from "~/app/providers/ViewportProvider";
import { cn } from "@sglara/cn";

interface VoteSectionProps {
  volume: number;
  percent: {
    yes: number;
    no: number;
  };
  setHistoryType: (type: "Yes" | "No") => void;
}

export default function VoteSection(props: VoteSectionProps) {
  const { isMobile, isDesktop } = useViewport();
  return (
    <div className="flex flex-col">
      <div
        className={cn("text-base-white pointer-events-auto flex items-start", {
          "gap-6": isDesktop,
          "gap-[19px]": isMobile,
        })}
      >
        <VoteBtn
          percent={`${formatPriceToPercentFloor(props.percent.yes)}%`}
          type="Yes"
          side="left"
          onClick={() => props.setHistoryType("Yes")}
        />
        {!isMobile && (
          <div className="flex flex-col items-center gap-2">
            <div className="flex flex-col gap-1.5 text-center">
              <span className="text-[17px] opacity-30">Volume</span>
              <span className="font-enhanced-led-board text-[32px]">
                ${props.volume}
              </span>
            </div>
            <a
              href="https://solo.to/agentmock"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[12px] opacity-20 duration-300 hover:opacity-100"
            >
              Powered by Agent $MOCK
            </a>
          </div>
        )}
        <VoteBtn
          percent={`${formatPriceToPercentFloor(props.percent.no)}%`}
          type="No"
          side="right"
          onClick={() => props.setHistoryType("No")}
        />
      </div>
      {isMobile && (
        <a
          href="https://solo.to/agentmock"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 mb-3 text-center text-[12px] opacity-30 duration-300 hover:opacity-100"
        >
          Powered by Agent $MOCK
        </a>
      )}
    </div>
  );
}
