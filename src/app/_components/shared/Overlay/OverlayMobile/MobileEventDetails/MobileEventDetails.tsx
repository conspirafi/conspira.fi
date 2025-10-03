import React, { useMemo } from "react";

import { useViewport } from "~/app/providers/ViewportProvider";

import EventTimer from "../../../EventTimer/EventTimer";

import { roundToTwoDecimals } from "~/app/utils/math";
import type {
  VolumeElementProps,
  MobileEventDetailsProps,
} from "~/app/interfaces/overlay-interfaces";
import LinkIcon from "~/app/_components/icons/LinkIcon";

const Marketlink = ({ link = "" }) => {
  return (
    <div className="flex flex-col items-start justify-center gap-3">
      <span className="text-sm opacity-30">Market Link</span>
      <div className="flex items-center justify-center gap-x-2">
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="font-enhanced-led-board group transition-colorsborder-white pointer-events-auto inline-flex items-center justify-center gap-x-2 text-xl text-white underline underline-offset-2"
        >
          Full
        </a>
        <div className="mb-1.5">
          <LinkIcon height={10} width={10} />
        </div>
      </div>
    </div>
  );
};

const VolumeElement: React.FC<VolumeElementProps> = ({ marketFees }) => {
  const volume = useMemo(() => {
    if (
      marketFees &&
      marketFees.totalFees &&
      typeof marketFees.totalFees.total === "number"
    ) {
      return roundToTwoDecimals(marketFees.totalFees.total * 25);
    }
    return 0;
  }, [marketFees]);

  if (volume === 0) {
    return;
  }

  return (
    <div className="flex flex-col items-start justify-center gap-3">
      <span className="text-sm opacity-30">Volume</span>
      <span className="font-enhanced-led-board text-xl">${volume}</span>
    </div>
  );
};

const MobileEventDetails: React.FC<MobileEventDetailsProps> = (props) => {
  const { isDesktop } = useViewport();

  return (
    <div className="flex w-full items-center justify-between text-white">
      <EventTimer
        targetDateString={props?.data?.end_date || undefined}
        isDesktop={isDesktop}
      />
      <VolumeElement marketFees={props.marketFees || undefined} />
      <Marketlink link="https://pmx.trade/markets/presale/will-comet-3iatlas-show-evidence-of-alien-technology-20250926084948" />
    </div>
  );
};

export default MobileEventDetails;
