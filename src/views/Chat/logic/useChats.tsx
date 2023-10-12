import { useEffect } from 'react';
import { useQuery } from 'react-query';
import { create } from 'zustand';
import { API_URLS } from '../../../utils/constants';
import api from '../../../services/api';

type State = {
  // TODO - create model for chat
  chats: {
    id: string;
    lastMessage: string;
    [key: string]: any;
  }[];
  selectedChatId: string | null;
};

type ApiResult = {
  id: string;
  [key: string]: any;
};

type Actions = {
  setChats: (chats: any[]) => void;
  addChat: (chat: any) => void;
  removeChat: (id: string) => void;
  updateChat: (id: string, chat: any) => void;
  selectChat: (id: string) => void;
};

const chatsStore = create<State & Actions>((set) => ({
  chats: [],
  selectedChatId: null,
  setChats: (chats) => set({ chats }),
  addChat: (chat) => set((prev) => ({ chats: [...prev.chats, chat] })),
  removeChat: (id) =>
    set((prev) => ({ chats: prev.chats.filter((chat) => chat.id !== id) })),
  updateChat: (id, chat) =>
    set((prev) => ({
      chats: prev.chats.map((oldChat) => (oldChat.id === id ? chat : chat)),
    })),
  selectChat: (id) => set({ selectedChatId: id }),
}));

export function useChats() {
  const query = useQuery(
    API_URLS.CALL.BASE,
    async () => {
      return await api.get<ApiResult[]>(API_URLS.CALL.BASE);
    },
    {
      refetchOnWindowFocus: false,
      refetchInterval: false,
    }
  );

  const setChats = chatsStore((state) => state.setChats);

  useEffect(() => {
    if (query.data) {
      setChats(query.data.data);
    }
  }, [query]);

  return {
    query: query,
    store: chatsStore,
  };
}
