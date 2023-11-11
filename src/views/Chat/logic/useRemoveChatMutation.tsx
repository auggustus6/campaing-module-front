import { useMutation } from 'react-query';
import { API_URLS } from '../../../utils/constants';
import { Chat } from '../../../models/call';
import api from '../../../services/api';
import { useToast } from '../../../context/ToastContext';
import { useChats } from './useChats';
import { queryClient } from '../../../main';

export function useRemoveChatMutation() {
  const toast = useToast();
  const { store } = useChats();
  const removeChat = store((state) => state.removeChat);
  const setSelectedChatId = store((state) => state.setSelectedChatId);

  console.log('chatsstore', store().chats);

  return useMutation({
    mutationKey: 'removeChat',
    onError: () => {
      toast.error('Erro ao remover chat!');
    },
    onSuccess: (data) => {
      toast.success('Chat removido com sucesso!');
      queryClient.invalidateQueries([API_URLS.CALL.BASE, 'GET',]);

      setSelectedChatId(null);
    },
    mutationFn: async (id: string) => {
      const result = await api.delete<Chat>(`${API_URLS.CALL.BASE}/${id}`);
      return result.data;
    },
  });
}
