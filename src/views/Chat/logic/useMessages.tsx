import { useEffect } from 'react';
import { useQuery } from 'react-query';
import { create } from 'zustand';
import { API_URLS } from '../../../utils/constants';
import api from '../../../services/api';
import { Message } from '../../../models/message';
import { useChats } from './useChats';
import { useToast } from '../../../context/ToastContext';

type State = {
  messages: Message[];
};

type Actions = {
  setMessages: (messages: Message[]) => void;
  addMessage: (message: Message) => void;
  removeMessage: (id: string) => void;
  updateMessage: (id: string, message: Message) => void;
};

const store = create<State & Actions>((set) => ({
  messages: [],
  setMessages: (messages) => set({ messages }),
  addMessage: (message) =>
    set((prev) => ({ messages: [...prev.messages, message] })),
  removeMessage: (id) =>
    set((prev) => ({
      messages: prev.messages.filter((message) => message.id !== id),
    })),
  updateMessage: (id, message) =>
    set((prev) => ({
      messages: prev.messages.map((oldMessage) =>
        oldMessage.id === id ? message : oldMessage
      ),
    })),
}));

export function useMessages() {
  const setMessages = store((state) => state.setMessages);

  const toast = useToast();

  const { store: chatStore } = useChats();
  const selectedChatId = chatStore((state) => state.selectedChatId);

  const query = useQuery(
    [API_URLS.CALL.MESSAGES, 'GET', selectedChatId],
    async () => {
      return await api.get<Message[]>(
        `${API_URLS.CALL.MESSAGES}/${selectedChatId}`
      );
    },
    {
      enabled: !!selectedChatId,
      refetchOnWindowFocus: false,
      refetchInterval: false,
      // refetchInterval: 2000,
      onError: (error) => {
        toast.error('Erro ao carregar mensagens!');
      },
    }
  );

  useEffect(() => {
    if (query.data && !!query.data.data.length) {
      setMessages(query.data.data);
    }
  }, [query.data]);

  return {
    query: query,
    store: store,
  };
}
