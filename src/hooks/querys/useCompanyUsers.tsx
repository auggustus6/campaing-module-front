import { useQuery } from 'react-query';
import api from '../../services/api';
import { Company } from '../../models/company';
import { API_URLS } from '../../utils/constants';
import { User } from '../../models/user';

export default function useCompanyUsers() {
  return useQuery<Company>(API_URLS.COMPANY.USERS, async () => {
    const { data } = await api.get<User>(API_URLS.COMPANY.USERS);
    return data;
  });
}