import { useMutation } from 'react-query';
import api from '../../../services/api';
import { useToast } from '../../../context/ToastContext';
import { NewChatSchemaType } from '../schemas/newServiceSchema';
import { Chat } from '../../../models/call';
import { API_URLS } from '../../../utils/constants';

type Props = {
  onSuccess: (data: ApiResponse) => void;
  onError: (error: any) => void;
};

type ApiResponse = {
  alreadyExists: boolean;
  call: Chat;
};

export function useNewChatMutation({ onError, onSuccess }: Props) {
  const toast = useToast();

  return useMutation({
    onError: onError,
    onSuccess: onSuccess,
    mutationFn: async (values: NewChatSchemaType) => {
      const result = await api.post<ApiResponse>(API_URLS.CALL.BASE, {
        channelId: values.channel,
        phoneNumber: values.phone,
        message: values.message,
      });
      return result.data;
    },
  });
}
