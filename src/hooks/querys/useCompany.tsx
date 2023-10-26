import { useQuery } from 'react-query';
import api from '../../services/api';
import { Company } from '../../models/company';
import { API_URLS } from '../../utils/constants';


export default function useCompany() {
  return useQuery<Company>([API_URLS.COMPANY.BASE], async () => {
    const { data } = await api.get<Company>(API_URLS.COMPANY.BASE);
    return data;
  },     {
    staleTime: 1000 * 60, // 1 minute
    refetchOnWindowFocus: false,
  });
}
