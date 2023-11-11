import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { create } from 'zustand';
import { API_URLS } from '../../../utils/constants';
import api from '../../../services/api';
import { Chat } from '../../../models/call';
import { Channel } from '../../../models/channel';
import { AxiosResponse } from 'axios';

type State = {
  chats: Chat[];
  selectedChatId: string | null;
  selectedChannel: Channel | null;
};

type Actions = {
  setChats: (chats: Chat[]) => void;
  addChat: (chat: Chat) => void;
  removeChat: (id: string) => void;
  updateChat: (id: string, chat: Partial<Chat>) => void;
  setSelectedChatId: (id: string | null) => void;
  setSelectedChannel: (channel: Channel | null) => void;
};

const chatsStore = create<State & Actions>((set, get) => ({
  chats: [],
  selectedChatId: null,
  selectedChannel: null,
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
  setSelectedChannel: (channel) => set({ selectedChannel: channel }),
}));

export function useChats() {
  const setChats = chatsStore((state) => state.setChats);
  const chats = chatsStore((state) => state.chats);
  const selectedChatId = chatsStore((state) => state.selectedChatId);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const selectedChannel = chatsStore((state) => state.selectedChannel);

  const query = useQuery<AxiosResponse<Chat[]> | null>(
    [API_URLS.CALL.BASE, 'GET', selectedChannel?.id],
    async () => {
      if (!selectedChannel?.id) {
        return null;
      }
      return await api.get<Chat[]>(API_URLS.CALL.BASE, {
        params: {
          channelId: selectedChannel?.id,
        },
      });
    },
    {
      refetchOnWindowFocus: false,
      refetchInterval: false,
      // enabled: chats.length === 0 || !chats,
      // refetchOnMount: true,
    }
  );

  useEffect(() => {
    if (query.data) {
      setChats(query.data.data);
    }
  }, [query.data]);

  useEffect(() => {
    setSelectedChat(chats.find((chat) => chat.id === selectedChatId) || null);
  }, [selectedChatId]);

  return {
    query: query,
    store: chatsStore,
    selectedChat: selectedChat,
  };
}
