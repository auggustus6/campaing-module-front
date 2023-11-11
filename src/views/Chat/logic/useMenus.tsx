import { create } from "zustand";

type State = {
  isAsideOpen: boolean;
};

type Actions = {
  openAside: () => void;
  closeAside: () => void;
  toggleAside: () => void;
};

export const menuStateStore = create<State & Actions>((set, get) => ({
  isAsideOpen: true,
  openAside: () => set({ isAsideOpen: true }),
  closeAside: () => set({ isAsideOpen: false }),
  toggleAside: () => set((prev) => ({ isAsideOpen: !prev.isAsideOpen })),
}));