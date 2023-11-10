import React from 'react';
import { create } from 'zustand';

type State = {
  chatSearch: string;
  messagesSearch: string;
};

type Actions = {
  setChatSearch: (search: string) => void;
  setMessagesSearch: (search: string) => void;
};

export const searchStore = create<State & Actions>((set) => ({
  chatSearch: '',
  messagesSearch: '',
  setChatSearch: (search) => set({ chatSearch: search }),
  setMessagesSearch: (search) => set({ messagesSearch: search }),
}));
