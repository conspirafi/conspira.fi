"use client";
import React from "react";
import { motion, AnimatePresence, type Easing } from "framer-motion";

import TwitterIcon from "../../icons/TwitterIcon";
import TelegramIcon from "../../icons/TelegramIcon";
import OverlaySocialBtn from "../../buttons/overlay-social-btn";

import "./Overlay.scss";

import { Borders } from "./Border";
import EventTimer from "../EventTimer/EventTimer";
import EventDetails from "../EventDetails/EventDetails";
import VideoTimeline from "../VideoTimeline/VideoTimeline";
import OverlaySoundBtn from "../../buttons/overlay-sound-btn";
import { useEventCasesStore } from "~/app/store/useEventStore";
import EqualizerStereo from "../../equalizer-stereo/equalizer-stereo";
import VideoPlayerWithEQ from "../../equalizer-stereo/video-player-with-eq";
import EventSwitcherControls from "../EventSwitcherControls/EventSwitcherControls";
import { CrossIcon } from "./BordersSvg";
import type { IPMXGetPresaleMarketDetails } from "~/server/schemas";

const contentVariants = {
  hidden: { opacity: 0, y: 0 },
  visible: { opacity: 1, y: 0 },
};

// const contentVariants_1 = {
//   hidden: { opacity: 1, y: 0 },
//   visible: { opacity: 1, y: 0 },
// };

const transition = {
  duration: 0.5,
  ease: [0.43, 0.13, 0.23, 0.96] as Easing,
};

interface OverlayProps {
  children: React.ReactNode;
  data: IPMXGetPresaleMarketDetails | undefined;
}

const Overlay: React.FC<OverlayProps> = (props) => {
  const activeEventCase = useEventCasesStore((state) => state.activeEventCase);
  return (
    <div className="overlay pointer-events-none relative z-0 flex h-screen w-screen items-center justify-center p-[15px]">
      <Borders />

      <div className="pointer-events-none fixed inset-0 z-10 flex h-full w-full flex-col p-[15px]">
        <div className="flex h-auto w-full flex-1 pt-9 pr-[42px] pl-6">
          <div className="relative z-0 flex h-auto w-full flex-2">
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
                  <EventDetails
                    title={activeEventCase.title}
                    spec={activeEventCase.spec}
                    link={activeEventCase.link}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className="flex h-auto w-full flex-1 flex-col items-center justify-start">
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
                  <h1 className="font-inter text-center text-[21px] opacity-30">
                    Terminal
                  </h1>
                  <p className="font-inter text-[21px]">
                    {activeEventCase?.name}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className="flex h-auto w-full flex-2 justify-end">
            <AnimatePresence mode="wait">
              {props.data?.end_date && (
                <motion.div
                  key={activeEventCase?.name}
                  variants={contentVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  transition={transition}
                >
                  <EventTimer targetDateString={props.data.end_date} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="flex h-auto w-full flex-1 flex-row items-end justify-between pr-[42px] pb-6 pl-6">
          <div className="pointer-events-auto flex flex-row gap-2">
            {/* <OverlaySocialBtn icon={<TelegramIcon />} href="#" /> */}
            <OverlaySocialBtn
              icon={<TwitterIcon />}
              href="https://x.com/agent_mock"
            />
          </div>
          <div className="pointer-events-auto flex flex-row gap-8">
            <OverlaySoundBtn className="self-end" />
            <EqualizerStereo barCount={12} />
          </div>
        </div>
      </div>
      <div className="fixed top-1/2 left-1/2 z-20 flex h-[412px] w-[661px] -translate-x-1/2 -translate-y-1/2 items-end justify-center">
        <div className="absolute top-0 left-0">
          <CrossIcon />
        </div>
        <div className="absolute top-0 right-0">
          <CrossIcon />
        </div>

        <div className="absolute bottom-0 left-0">
          <CrossIcon />
        </div>
        <div className="absolute right-0 bottom-0">
          <CrossIcon />
        </div>
        <div>
          <p className="font-enhanced-led-board mb-20 text-xl">
            Scroll & Discover
          </p>
        </div>
      </div>
      <div className="fixed top-1/2 z-20 flex h-auto w-full -translate-y-1/2 items-center justify-between pr-[42px] pl-6">
        <div className="pointer-events-none flex h-auto w-full flex-1 items-center justify-start">
          <VideoTimeline />
        </div>
        <div className="pointer-events-none flex h-auto w-full flex-1 items-center justify-end">
          {/* <EventSwitcherControls /> */}
        </div>
      </div>

      <div className="fixed top-1/2 left-1/2 -z-10 h-[80svh] w-[80svw] -translate-x-1/2 -translate-y-1/2">
        <VideoPlayerWithEQ />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeEventCase?.name || "initial"}
          // variants={contentVariants_1}
          // initial="hidden"
          // animate="visible"
          // exit="hidden"
          // transition={transition}
          className="pointer-events-auto relative flex flex-col"
        >
          {props.children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Overlay;
