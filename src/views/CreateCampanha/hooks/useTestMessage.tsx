import React from 'react';
import { useMutation } from 'react-query';
import { CampaignSchemaType } from '../schemas/campaignSchema';
import Swal from 'sweetalert2';
import api from '../../../services/api';

type Props = {
  messagePreview?: string;
  midiaBase64?: string;
};

export default function useTestMessage({ messagePreview, midiaBase64 }: Props) {
  return useMutation({
    mutationFn: async (values: CampaignSchemaType) => {
      // TODO - change to react portals and react components
      try {
        await Swal.fire({
          text: 'Digite o número para o qual deseja enviar a mensagem',
          input: 'text',
          inputPlaceholder: '55 11 9 9999-9999',
          inputAttributes: {
            inputmode: 'numeric',
          },
          showCancelButton: true,
          confirmButtonText: 'Enviar',
          cancelButtonText: 'Cancelar',
          showLoaderOnConfirm: true,
          preConfirm: async (number) => {
            try {
              const formattedNumber = number.replace(/\D/g, '');
              const result = await api.post('/message/send-test-message', {
                text: messagePreview,
                to: formattedNumber,
                midia: midiaBase64 || undefined,
                channelId: values.session,
              });

              Swal.fire('Sucesso', 'Mensagem enviada com sucesso!', 'success');
            } catch (error) {
              console.error(error);
              Swal.fire(
                'Erro',
                'Erro ao enviar mensagem, por favor tente novamente.',
                'error'
              );
            }
          },
        });
      } catch (error) {
        console.error(error);
        Swal.fire(
          'Erro',
          'Erro ao criar campanha, por favor tente novamente.',
          'error'
        );
      }
    },
  });
}
