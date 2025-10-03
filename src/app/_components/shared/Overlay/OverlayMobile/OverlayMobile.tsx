import { AnimatePresence, motion, type Easing } from "framer-motion";

import { useEventCasesStore } from "~/app/store/useEventStore";

import type { OverlayProps } from "~/app/interfaces/overlay-interfaces";

import EventDetails from "../../EventDetails/EventDetails";
import TwitterIcon from "~/app/_components/icons/TwitterIcon";
import DiscoverElement from "../../DiscoverElement/DiscoverElement";
import OverlaySoundBtn from "~/app/_components/buttons/overlay-sound-btn";
import OverlaySocialBtn from "~/app/_components/buttons/overlay-social-btn";
import VideoPlayerWithEQ from "~/app/_components/equalizer-stereo/video-player-with-eq";
import MobileEventDetails from "./MobileEventDetails/MobileEventDetails";

const contentVariants = {
  hidden: { opacity: 0, y: 0 },
  visible: { opacity: 1, y: 0 },
};

const transition = {
  duration: 0.5,
  ease: [0.43, 0.13, 0.23, 0.96] as Easing,
};

const OverlayMobile: React.FC<OverlayProps> = (props) => {
  const activeEventCase = useEventCasesStore((state) => state.activeEventCase);

  return (
    <>
      <div className="pointer-events-none fixed inset-0 z-10 flex h-full w-full flex-col p-[15px]">
        <div className="flex w-full flex-row items-center justify-between border-b border-white/20 pb-4">
          <div className="pointer-events-auto flex flex-col items-start">
            <h1 className="font-inter text-center text-[21px] opacity-30">
              Terminal
            </h1>
            <p className="font-inter text-[21px]">{activeEventCase?.name}</p>
          </div>
          <div className="pointer-events-auto flex items-start justify-start gap-1">
            <OverlaySoundBtn className="self-end" />
            <OverlaySocialBtn
              icon={<TwitterIcon />}
              href="https://x.com/agent_mock"
            />
          </div>
        </div>
        <div className="flex h-auto w-full flex-1 flex-col gap-5 pt-4 pl-1.5">
          <div className="relative z-0 flex h-auto w-full">
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
          <div className="flex">
            <MobileEventDetails
              data={props.data}
              activeEventCase={activeEventCase}
            />
          </div>
        </div>

        <DiscoverElement />
      </div>

      <div className="fixed top-1/2 left-1/2 -z-10 h-[80svh] w-[80svw] -translate-x-1/2 -translate-y-1/2">
        <VideoPlayerWithEQ />
      </div>
    </>
  );
};

export default OverlayMobile;
