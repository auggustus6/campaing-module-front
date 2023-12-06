import { useQuery } from 'react-query';
import api from '../../../services/api';


export default function useChannels() {
  return useQuery(
    ["/channels", "GET"],
    async () => {
      const { data } = await api.get("/channels");

      return data || [];
    },
    {
      staleTime: 1000 * 60, // 1 minute
      refetchOnWindowFocus: false,
    }
  );
}
