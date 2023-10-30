import { useEffect, useState } from 'react';
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
  updateChat: (id: string, chat: Partial<Chat>) => void;
  setSelectedChatId: (id: string) => void;
};

const chatsStore = create<State & Actions>((set, get) => ({
  chats: [],
  selectedChatId: null,
  setChats: (chats) => set({ chats }),
  addChat: (chat) => set((prev) => ({ chats: [chat, ...prev.chats] })),
  removeChat: (id) =>
    set((prev) => ({ chats: prev.chats.filter((chat) => chat.id !== id) })),
  updateChat: (id, chat) =>
    set((prev) => ({
      chats: prev.chats
        .map((oldChat) =>
          oldChat.id === id ? { ...oldChat, ...chat } : oldChat
        )
        .sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1)),
    })),
  setSelectedChatId: (id) => set({ selectedChatId: id }),
}));

export function useChats() {
  const setChats = chatsStore((state) => state.setChats);
  const chats = chatsStore((state) => state.chats);
  const selectedChatId = chatsStore((state) => state.selectedChatId);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);

  const query = useQuery(
    [API_URLS.CALL.BASE, 'GET'],
    async () => {
      return await api.get<Chat[]>(API_URLS.CALL.BASE);
      if (chats.length === 0) {
      }
    },
    {
      // refetchOnWindowFocus: false,
      refetchInterval: 2000,
    }
  );

  useEffect(() => {
    // if (query.data && !!query.data.data.length && !chats.length) {
    //   setChats(query.data.data);
    // }
    if(query.data){
      setChats(query.data.data)
    }
  }, [query.data]);

  useEffect(() => {
    setSelectedChat(chats.find((chat) => chat.id === selectedChatId) || null);
  }, [selectedChatId]);

  // function getSelectedChat() {
  //   return chats.find((chat) => chat.id === chatsStore.getState().selectedChatId);
  // }

  return {
    query: query,
    store: chatsStore,
    selectedChat: selectedChat,
  };
}
