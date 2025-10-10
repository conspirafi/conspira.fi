import { create } from "zustand";
import { persist } from "zustand/middleware";

type OnboardingStore = {
  isOnboarding: boolean;
  needsOnboarding: boolean;
  startOnboarding: () => void;
  finishOnboarding: () => void;
  resetOnboarding: () => void;
};

export const useOnboardingStore = create<OnboardingStore>()(
  // persist(
  (set) => ({
    isOnboarding: false,
    needsOnboarding: true,

    startOnboarding: () =>
      set({
        isOnboarding: true,
      }),

    finishOnboarding: () =>
      set({
        isOnboarding: false,
        needsOnboarding: false,
      }),

    resetOnboarding: () =>
      set({
        isOnboarding: false,
        needsOnboarding: true,
      }),
  }),
  //   {
  //     name: "onboarding-storage",
  //     partialize: (state) => ({
  //       needsOnboarding: state.needsOnboarding,
  //     }),
  //   },
  // ),
);
