import React from 'react';

import { useToast } from '../../../context/ToastContext';
import { useNavigate } from 'react-router-dom';
import { CampaignSchemaType } from '../schemas/campaignSchema';
import { useMutation } from 'react-query';
import api from '../../../services/api';
import Swal from 'sweetalert2';

export default function useCreateCampaign({
  midiaBase64,
}: {
  midiaBase64?: string;
}) {
  const toast = useToast();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (values: CampaignSchemaType) => {
      console.log(midiaBase64);

      try {
        await api.post('/campaign', {
          title: values.title,
          message: values.message,
          scheduleDate: (values.scheduleDate as Date) || undefined,
          startTime: values.startTime,
          endTime: values.endTime,
          contacts: values.contacts,
          sendDelay: values.sendDelay,
          channel_id: values.session,
          midia: midiaBase64,
          midiaUrl: values.midiaUrl,
        });

        navigate('/campanhas');
        Swal.fire('Sucesso', 'Campanha criada com sucesso!', 'success');
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
