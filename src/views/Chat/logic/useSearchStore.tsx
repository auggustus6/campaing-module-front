import React from 'react';
import { create } from 'zustand';

type State = {
  chatSearch: string | null;
  messagesSearch: string | null;
};

type Actions = {
  setChatSearch: (search: string | null) => void;
  setMessagesSearch: (search: string | null) => void;
};

export const searchStore = create<State & Actions>((set) => ({
  chatSearch: null,
  messagesSearch: null,
  setChatSearch: (search) => set({ chatSearch: search }),
  setMessagesSearch: (search) => set({ messagesSearch: search }),
}));
