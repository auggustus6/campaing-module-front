import { useMutation } from 'react-query';
import api from '../../../services/api';
import { NewChatSchemaType } from '../schemas/newServiceSchema';
import { Chat } from '../../../models/call';
import { API_URLS } from '../../../utils/constants';
import { useChats } from './useChats';
import { useMessages } from './useMessages';
import { Message } from '../../../models/message';


type ApiResponse = Message;

type MutationProps = {
  text: string;
};

export function useSendMessageMutation() {
  const { selectedChat } = useChats();
  const {store} = useMessages();
  const addMessage = store(state => state.addMessage);
  const updateMessage = store(state => state.updateMessage);
  // const addChat = store(state => state.addChat);
  // const updateChat = store(state => state.updateChat);

  return useMutation({
    mutationFn: async ({ text }: MutationProps) => {
      const id = Math.random().toString();
      addMessage({
        callId: selectedChat?.id,
        id: id,
        type: "SENT",
        updatedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        sending: true,
        content: {
          type: "TEXT",
          message: text,
        }
      } as any);
      const result = await api.post<ApiResponse>(
        `${API_URLS.CALL.MESSAGES}/${selectedChat?.id}`,
        {
          text,
        }
      );

      updateMessage(id, result.data);

      return result.data;
    },
  });
}
