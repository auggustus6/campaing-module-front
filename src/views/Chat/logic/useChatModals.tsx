import React, { useState } from 'react';
import { create } from 'zustand';

type ChatModals = 'newService';

type State = {
  chatModals: ChatModals | null;
}

type Actions = {
  openChatModal: (modal: ChatModals) => void;
  closeChatModal: () => void;
  toggleCurrentChatModal: () => void;
}


export const useChatModals = create<State & Actions>((set) => ({
  chatModals: null,
  openChatModal: (modal: ChatModals) => set({ chatModals: modal }),
  closeChatModal: () => set({ chatModals: null }),
  toggleCurrentChatModal: () =>
    set((prev) => {
      if (prev.chatModals) return { chatModals: null };
      return prev;
    }),
}))