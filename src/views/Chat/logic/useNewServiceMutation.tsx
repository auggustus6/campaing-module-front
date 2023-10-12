import { useMutation } from 'react-query';
import api from '../../../services/api';
import { NewServiceSchemaType } from '../schemas/newServiceSchema';
import { useToast } from '../../../context/ToastContext';

export function useNewServiceMutation() {
  const toast = useToast();

  return useMutation({
    mutationFn: async (values: NewServiceSchemaType) => {
      try {
        return await api.post('/call', {
          channelId: values.channel,
          phoneNumber: values.phone,
          message: values.message,
        });
      } catch (error) {
        toast.error('Erro ao iniciar atendimento!');
        console.error(error);
        throw error;
      }
    },
  });
}
