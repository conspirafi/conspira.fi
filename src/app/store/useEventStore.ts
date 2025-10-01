// stores/eventCasesStore.ts

import { create } from "zustand";
import { EventCaseData, type EventCase } from "./eventData";

type EventCasesStore = {
  eventCases: EventCase[];
  activeEventCase: EventCase | null;
  isEventCasePageOpen: boolean;

  setActiveEventCase: (eventCase: EventCase | null) => void;
  toggleEventCasePage: () => void;
  goToNextEvent: () => void;
  goToPrevEvent: () => void;
};

export const useEventCasesStore = create<EventCasesStore>((set) => ({
  eventCases: EventCaseData,
  activeEventCase: EventCaseData[0] ?? null,
  isEventCasePageOpen: false,

  setActiveEventCase: (eventCase) => set({ activeEventCase: eventCase }),

  toggleEventCasePage: () =>
    set((state) => ({ isEventCasePageOpen: !state.isEventCasePageOpen })),

  goToNextEvent: () =>
    set((state) => {
      if (!state.activeEventCase) {
        return { activeEventCase: state.eventCases[0] ?? null };
      }
      const currentIndex = state.eventCases.findIndex(
        (e) => e.name === state.activeEventCase?.name,
      );
      const nextIndex = (currentIndex + 1) % state.eventCases.length;
      return { activeEventCase: state.eventCases[nextIndex] };
    }),

  goToPrevEvent: () =>
    set((state) => {
      if (!state.activeEventCase) {
        return {
          activeEventCase:
            state.eventCases[state.eventCases.length - 1] ?? null,
        };
      }
      const currentIndex = state.eventCases.findIndex(
        (e) => e.name === state.activeEventCase?.name,
      );
      const prevIndex =
        (currentIndex - 1 + state.eventCases.length) % state.eventCases.length;
      return { activeEventCase: state.eventCases[prevIndex] };
    }),
}));
