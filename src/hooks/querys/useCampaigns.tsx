import { useQuery } from 'react-query';
import api from '../../services/api';
import { API_URLS } from '../../utils/constants';
import { Campaign } from '../../models/campaign';

type Props = {
  page: number;
  showDeleted: boolean;
};

type Output = {
  total: number;
  result: Campaign[];
};

export default function useCampaigns({ page, showDeleted }: Props) {
  return useQuery<Output>(
    [API_URLS.CAMPAIGNS.BASE, page, showDeleted],
    async () => {
      const { data } = await api.get<Output>(
        `${API_URLS.CAMPAIGNS.BASE}?page=${page}&list_deleted=${showDeleted}`
      );
      return data;
    },
    {
      staleTime: 1000 * 20, // 20 seconds
    }
  );
}
