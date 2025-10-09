import { create } from "zustand";
import type { IEventSchema } from "~/server/events";

type EventCasesStore = {
  eventCases: IEventSchema[];
  activeEventCase: IEventSchema | null;
  isEventCasePageOpen: boolean;

  setEventCases: (events: IEventSchema[]) => void;
  setActiveEventCase: (eventCase: IEventSchema | null) => void;
  toggleEventCasePage: () => void;
  goToNextEvent: () => void;
  goToPrevEvent: () => void;
};

export const useEventCasesStore = create<EventCasesStore>((set) => ({
  eventCases: [],
  activeEventCase: null,
  isEventCasePageOpen: false,

  setEventCases: (events) => set({ eventCases: events }),

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
      if (currentIndex === -1) {
        return { activeEventCase: state.eventCases[0] ?? null };
      }
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
      if (currentIndex === -1) {
        return {
          activeEventCase:
            state.eventCases[state.eventCases.length - 1] ?? null,
        };
      }
      const prevIndex =
        (currentIndex - 1 + state.eventCases.length) % state.eventCases.length;
      return { activeEventCase: state.eventCases[prevIndex] };
    }),
}));
