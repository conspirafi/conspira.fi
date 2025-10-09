import React from "react";

import { useViewport } from "~/app/providers/ViewportProvider";
import type { EventDetailsProps } from "~/app/interfaces/overlay-interfaces";
import LinkIcon from "../../icons/LinkIcon";

const InfoRow: React.FC<{
  label: string;
  children: React.ReactNode;
  isDesktop?: true;
}> = ({ label, children, isDesktop }) => (
  <div className="flex max-w-[500px] items-start gap-x-4">
    {isDesktop ? (
      <div className="flex w-20 flex-shrink-0 items-center gap-x-2 pt-1">
        <span className="h-1.5 w-1.5 bg-white opacity-30"></span>
        <p className="text-sm opacity-30">{label}</p>
      </div>
    ) : (
      <div className="flex flex-shrink-0 items-center gap-x-2 pt-1">
        <span className="h-1 w-1 bg-white opacity-30"></span>
      </div>
    )}

    <div className="flex-1">{children}</div>
  </div>
);

const EventDetails: React.FC<EventDetailsProps> = ({ title, spec, link }) => {
  const { isMobile, isDesktop } = useViewport();
  const pmxLink = `https://pmx.trade/markets/presale/${link}`;

  return (
    <div className="flex max-w-2xl flex-col gap-y-8 text-white">
      {isMobile && (
        <>
          <InfoRow label="Signal">
            <h1 className="text-2xl leading-[140%]">{title}</h1>
          </InfoRow>
        </>
      )}
      {isDesktop && (
        <>
          <InfoRow label="Signal">
            <h1 className="text-[42px] leading-[100%]">{title}</h1>
          </InfoRow>

          <InfoRow label="Context">
            <p className="text-xs text-white">{spec}</p>
          </InfoRow>

          <InfoRow label="Link">
            <a
              href={pmxLink}
              target="_blank"
              rel="noopener noreferrer"
              className="group pointer-events-auto inline-flex items-center gap-x-2 border-b border-gray-500 pb-1 text-lg text-white transition-colors hover:border-white"
            >
              Prediciton market on PMX
              <LinkIcon />
            </a>
          </InfoRow>
        </>
      )}
    </div>
  );
};

export default EventDetails;
