import React from 'react'
import { useQuery } from 'react-query';
import api from '../../../services/api';
import { useToast } from '../../../context/ToastContext';
import { useNavigate } from 'react-router-dom';

// TODO  - create a shared folder for this interface
interface Company {
  id: string;
  name: string;
  channel: {
    id: string;
    instanceName: string;
  }[];
}

export default function useFetchCompany() {
  const toast = useToast();
  const navigate = useNavigate();
  return useQuery<Company>('company', async () => {
    const { data } = await api.get<Company>('/companies');

    if (data.channel.length === 0) {
      toast.error(
        'Você não possui canais conectados, crie ou conecte um canal para poder criar uma campanha.'
      );
      navigate('/campanhas');
    }
    return data;
  });
}
