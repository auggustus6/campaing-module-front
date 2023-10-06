import { useQuery } from 'react-query';
import api from '../../services/api';
import { Channel } from '../../models/channel';
import { API_URLS } from '../../utils/constants';

export default function useChannels() {
  return useQuery<Channel[]>(
    API_URLS.CHANNELS.BASE,
    async () => {
      const { data } = await api.get<Channel[]>(API_URLS.CHANNELS.BASE);

      return data || [];
    },
    {
      staleTime: 1000 * 60, // 1 minute
      refetchOnWindowFocus: false,
    }
  );
}
