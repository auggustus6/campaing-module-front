import { useQuery } from 'react-query';
import api from '../../services/api';
import { API_URLS } from '../../utils/constants';
import { Campaign } from '../../models/campaign';

type Props = {
  id: string;
  options?: {
    staleTime?: number;
    refetchOnWindowFocus?: boolean;
  };
  additionalQueryArgs?: any[];
};

export default function useGetCampaign({
  id,
  options,
  additionalQueryArgs = [],
}: Props) {
  return useQuery<Campaign>(
    [API_URLS.CAMPAIGNS.BASE, 'get', id, ...additionalQueryArgs],
    async () => {
      const { data } = await api.get<Campaign>(
        `${API_URLS.CAMPAIGNS.BASE}/${id}`
      );
      return data;
    },
    {
      staleTime: Infinity, // 20 seconds
      refetchOnWindowFocus: false,
      ...options,
    }
  );
}
