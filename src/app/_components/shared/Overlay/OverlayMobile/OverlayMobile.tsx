"use client";

import { AnimatePresence, motion, type Easing } from "framer-motion";
import { useEventCasesStore } from "~/app/store/useEventStore";
import { useOnboardingStore } from "~/app/store/onboardingStore";
import type { OverlayProps } from "~/app/interfaces/overlay-interfaces";

import TwitterIcon from "~/app/_components/icons/TwitterIcon";
import OverlaySoundBtn from "~/app/_components/buttons/overlay-sound-btn";
import OverlaySocialBtn from "~/app/_components/buttons/overlay-social-btn";
import VideoPlayerWithEQ from "~/app/_components/equalizer-stereo/video-player-with-eq";
import { useViewport } from "~/app/providers/ViewportProvider";
import SkipIntroHint from "../SkipIntroHint";
import { useEffect } from "react";
import MobileEventDetails from "./MobileEventDetails/MobileEventDetails";
import EventSwitcherControls from "../../EventSwitcherControls/EventSwitcherControls";
import VideoTimeline from "../../VideoTimeline/VideoTimeline";
import DiscoverElement from "../../DiscoverElement/DiscoverElement";

const contentVariants = {
  hidden: { opacity: 0, y: 0 },
  visible: { opacity: 1, y: 0 },
};

const transition = {
  duration: 0.5,
  ease: [0.43, 0.13, 0.23, 0.96] as Easing,
};

const OverlayMobile: React.FC<OverlayProps> = ({ data, marketFees }) => {
  const activeEventCase = useEventCasesStore((state) => state.activeEventCase);
  const { isMobile } = useViewport();

  const isOnboarding = useOnboardingStore((s) => s.isOnboarding);
  const needsOnboarding = useOnboardingStore((s) => s.needsOnboarding);
  const hideUI = isOnboarding && needsOnboarding;

  useEffect(() => {
    console.log(activeEventCase);
  });

  return (
    <>
      <div className="pointer-events-none fixed inset-0 z-10 flex h-full w-full flex-col p-2.5">
        <div className="flex w-full flex-row items-center justify-between border-b border-white/20 pb-[15px]">
          <div className="pointer-events-auto flex flex-col items-start">
            <h1 className="font-inter text-center text-[17px] opacity-30">
              Terminal
            </h1>
            <p className="font-inter text-[17px]">Conspiracy</p>
          </div>
          <div className="pointer-events-auto flex items-start justify-start gap-1">
            <OverlaySoundBtn className="h-10 w-10 self-end" />
            {!isOnboarding && (
              <OverlaySocialBtn
                icon={<TwitterIcon size={isMobile ? 12 : 20} />}
                href="https://x.com/agent_mock"
                className="h-10 w-10 self-end"
              />
            )}
          </div>
        </div>

        {!hideUI && (
          <AnimatePresence mode="wait">
            {activeEventCase && (
              <motion.div
                key={activeEventCase.name}
                variants={contentVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                transition={transition}
              >
                <MobileEventDetails
                  activeEventCase={activeEventCase}
                  data={data}
                  marketFees={marketFees}
                />
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>

      {!isOnboarding && (
        <div className="fixed top-1/2 z-20 flex h-auto w-full -translate-y-1/2 items-center justify-between pr-[42px] pl-6">
          <div className="pointer-events-none flex h-auto w-full flex-1 items-center justify-start">
            <VideoTimeline />
          </div>
          <div className="pointer-events-none flex h-auto w-full flex-1 items-center justify-end">
            <EventSwitcherControls />
          </div>
          <DiscoverElement />
        </div>
      )}
      {isOnboarding && <SkipIntroHint />}

      <div className="fixed top-1/2 left-1/2 -z-10 h-[40svh] w-[100svw] -translate-x-1/2 -translate-y-1/2">
        <VideoPlayerWithEQ />
      </div>
    </>
  );
};

export default OverlayMobile;
