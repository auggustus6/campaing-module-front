import { useMutation } from 'react-query';
import api from '../../../services/api';
import { NewChatSchemaType } from '../schemas/newServiceSchema';
import { Chat } from '../../../models/call';
import { API_URLS } from '../../../utils/constants';
import { useChats } from './useChats';
import { useMessages } from './useMessages';
import { ContentType, Message } from '../../../models/message';

type ApiResponse = Message;

type MutationProps = {
  text: string;
  midia64?: string;
  type?: ContentType;
  fileName?: string;
};

export function useSendMessageMutation() {
  const { selectedChat, store: chatsStore } = useChats();
  const updateChat = chatsStore((state) => state.updateChat);
  const { store: messagesStore } = useMessages();
  const addMessage = messagesStore((state) => state.addMessage);
  const updateMessage = messagesStore((state) => state.updateMessage);

  return useMutation({
    mutationFn: async ({
      text,
      midia64,
      fileName,
      type = 'TEXT',
    }: MutationProps) => {
      const id = Math.random().toString();
      const formattedMidia = midia64 ? midia64.split(',')[1] : '';

      const msg: Message = {
        callId: selectedChat?.id || '',
        id: id,
        type: 'SENT',
        error: false,
        contentId: id,
        updatedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        sending: true,
        content: {
          id: id,
          type: type,
          message: text,
          fileName: fileName,
          midiaBase64: formattedMidia,
        },
      };

      console.log('message from useSendMessageMutation', msg);

      addMessage(msg);
      updateChat(selectedChat?.id || '', { lastMessage: msg });

      const result = await api.post<ApiResponse>(
        `${API_URLS.CALL.MESSAGES}/${selectedChat?.id}`,
        {
          text,
          midiaBase64: midia64,
          fileName,
        }
      );

      updateMessage(id, result.data);
      updateChat(selectedChat?.id || '', { lastMessage: result.data });

      return result.data;
    },
  });
}
