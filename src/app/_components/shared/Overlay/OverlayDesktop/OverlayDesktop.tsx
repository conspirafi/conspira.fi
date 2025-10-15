import { AnimatePresence, motion, type Easing } from "framer-motion";
import { useEventCasesStore } from "~/app/store/useEventStore";
import { useOnboardingStore } from "~/app/store/onboardingStore";
import type { OverlayProps } from "~/app/interfaces/overlay-interfaces";
import { Borders } from "../Border";
import EventTimer from "../../EventTimer/EventTimer";
import EventDetails from "../../EventDetails/EventDetails";
import TwitterIcon from "~/app/_components/icons/TwitterIcon";
import VideoTimeline from "../../VideoTimeline/VideoTimeline";
import DiscoverElement from "../../DiscoverElement/DiscoverElement";
import OverlaySoundBtn from "~/app/_components/buttons/overlay-sound-btn";
import OverlaySocialBtn from "~/app/_components/buttons/overlay-social-btn";
import EqualizerStereo from "~/app/_components/equalizer-stereo/equalizer-stereo";
import VideoPlayerWithEQ from "~/app/_components/equalizer-stereo/video-player-with-eq";
import EventSwitcherControls from "../../EventSwitcherControls/EventSwitcherControls";
import SkipIntroHint from "../SkipIntroHint";

const contentVariants = {
  hidden: { opacity: 0, y: 0 },
  visible: { opacity: 1, y: 0 },
};

const transition = {
  duration: 0.5,
  ease: [0.43, 0.13, 0.23, 0.96] as Easing,
};

const OverlayDesktop: React.FC<OverlayProps> = (props) => {
  const activeEventCase = useEventCasesStore((state) => state.activeEventCase);
  const isOnboarding = useOnboardingStore((state) => state.isOnboarding);

  return (
    <>
      <Borders />

      <div className="pointer-events-none fixed inset-0 z-10 flex h-full w-full flex-col p-[15px]">
        <div className="flex h-auto w-full flex-1 pt-9 pr-[42px] pl-6">
          {!isOnboarding ? (
            <>
              <div className="relative z-0 flex h-auto w-full flex-2">
                <AnimatePresence mode="wait">
                  {activeEventCase && (
                    <motion.div
                      key={activeEventCase?.name}
                      variants={contentVariants}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      transition={transition}
                    >
                      <EventDetails
                        title={activeEventCase.eventTitle || "CONSPIRA.FI"}
                        spec={activeEventCase.eventDescription}
                        link={activeEventCase.marketSlug}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex h-auto w-full flex-1 flex-col items-center justify-start">
                <AnimatePresence mode="wait">
                  {activeEventCase && (
                    <motion.div
                      key={activeEventCase?.name}
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
            </>
          ) : (
            <div className="flex h-auto w-full flex-1 flex-col items-center justify-start">
              <h1 className="font-inter text-center text-[21px] opacity-30">
                Terminal
              </h1>
              <p className="font-inter text-[21px]">CONSPIRA.FI</p>
            </div>
          )}
        </div>

        <DiscoverElement />

        <div className="flex h-auto w-full flex-1 flex-row items-end justify-between pr-[42px] pb-6 pl-6">
          <div className="pointer-events-auto flex flex-row gap-2">
            {!isOnboarding && (
              <OverlaySocialBtn
                icon={<TwitterIcon />}
                href="https://x.com/agent_mock"
                className="h-[52px] w-[52px]"
              />
            )}
          </div>
          <div className="pointer-events-auto flex flex-row gap-8">
            <OverlaySoundBtn className="h-[52px] w-[52px]" />
            <EqualizerStereo barCount={12} />
          </div>
        </div>
      </div>

      {!isOnboarding && (
        <div className="fixed top-1/2 z-20 flex h-auto w-full -translate-y-1/2 items-center justify-between pr-[42px] pl-6">
          <div className="pointer-events-none flex h-auto w-full flex-1 items-center justify-start">
            <VideoTimeline />
          </div>
          <div className="pointer-events-none flex h-auto w-full flex-1 items-center justify-end">
            <EventSwitcherControls />
          </div>
        </div>
      )}

      {isOnboarding && <SkipIntroHint />}

      <div className="fixed top-1/2 left-1/2 -z-10 h-[80svh] w-[80svw] -translate-x-1/2 -translate-y-1/2">
        <VideoPlayerWithEQ />
      </div>
    </>
  );
};

export default OverlayDesktop;
