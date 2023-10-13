import { useEffect } from 'react';
import { useQuery } from 'react-query';
import { create } from 'zustand';
import { API_URLS } from '../../../utils/constants';
import api from '../../../services/api';
import { Chat } from '../../../models/call';

type State = {
  chats: Chat[];
  selectedChatId: string | null;
};

type Actions = {
  setChats: (chats: Chat[]) => void;
  addChat: (chat: Chat) => void;
  removeChat: (id: string) => void;
  updateChat: (id: string, chat: Chat) => void;
  setSelectedChatId: (id: string) => void;
};

const chatsStore = create<State & Actions>((set) => ({
  chats: [],
  selectedChatId: null,
  setChats: (chats) => set({ chats }),
  addChat: (chat) => set((prev) => ({ chats: [chat, ...prev.chats] })),
  removeChat: (id) =>
    set((prev) => ({ chats: prev.chats.filter((chat) => chat.id !== id) })),
  updateChat: (id, chat) =>
    set((prev) => ({
      chats: prev.chats
        .map((oldChat) => (oldChat.id === id ? chat : oldChat))
        .sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1)),
    })),
  setSelectedChatId: (id) => set({ selectedChatId: id }),
}));

export function useChats() {
  const setChats = chatsStore((state) => state.setChats);
  const chats = chatsStore((state) => state.chats);
  const query = useQuery(
    [API_URLS.CALL.BASE, 'GET'],
    async () => {
      if (chats.length === 0) {
        return await api.get<Chat[]>(API_URLS.CALL.BASE);
      }
    },
    {
      refetchOnWindowFocus: false,
      refetchInterval: false,
    }
  );

  useEffect(() => {
    if (query.data && !!query.data.data.length && !chats.length) {
      setChats(query.data.data);
    }
  }, [query.data]);

  return {
    query: query,
    store: chatsStore,
  };
}
