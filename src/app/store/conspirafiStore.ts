import { create } from "zustand";

type ConspirafiStore = {
  isVisible: boolean;
  toggleVisibility: () => void;
  setVisibility: (isVisible: boolean) => void;
};

export const useConspirafiStore = create<ConspirafiStore>((set) => ({
  isVisible: false,

  toggleVisibility: () => set((state) => ({ isVisible: !state.isVisible })),

  setVisibility: (isVisible) => set({ isVisible }),
}));
