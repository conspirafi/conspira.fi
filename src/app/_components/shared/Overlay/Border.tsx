import { useOnboardingStore } from "~/app/store/onboardingStore";
import {
  BottomLeftBorder,
  BottomRightBorder,
  TopLeftBorder,
  TopRightBorder,
} from "./BordersSvg";

export const Borders = () => {
  const { isOnboarding } = useOnboardingStore();

  return (
    <div className="pointer-events-none fixed top-0 left-0 z-10 flex h-full w-full">
      <div className="pointer-events-none fixed top-[15px] left-[15px]">
        <TopLeftBorder />
      </div>
      <div className="pointer-events-none fixed top-[15px] right-[15px]">
        <TopRightBorder />
      </div>
      <div className="pointer-events-none fixed bottom-[15px] left-[15px] flex items-end gap-3">
        <BottomLeftBorder />
        {!isOnboarding && (
          <p className="relative top-[4px] text-xs opacity-30">
            Every movement needs a signal.
          </p>
        )}
      </div>
      <div className="pointer-events-none fixed right-[15px] bottom-[15px] flex items-end gap-3">
        {!isOnboarding && (
          <a
            className="pointer-events-auto relative top-[4px] z-50 text-[12px] opacity-30 duration-300 hover:opacity-100"
            href="https://fantik.studio"
            target="_blank"
          >
            Design by Fantik Studio
          </a>
        )}
        <BottomRightBorder />
      </div>
    </div>
  );
};
