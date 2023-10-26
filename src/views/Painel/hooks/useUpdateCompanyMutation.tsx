import React from 'react'
import { useMutation } from 'react-query'
import api from '../../../services/api';
import { API_URLS } from '../../../utils/constants';
import { Company } from '../../../models/company';

type Values = {
  name: string;
}

type Props = {
  onSuccess: (data: Company, values: Values) => void;
  onError: () => void;
}

export  function useUpdateCompanyMutation({ onSuccess, onError }: Props) {
  return useMutation({
    onError,
    onSuccess,
    mutationFn: async (values: Values) => {
     const result= await api.patch<Company>(API_URLS.COMPANY.BASE, values);
      return result.data;
    },
  })
}
