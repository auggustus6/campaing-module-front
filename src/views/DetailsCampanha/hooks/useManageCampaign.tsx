import React from 'react';

import { useMutation } from 'react-query';
import api from '../../../services/api';
import { API_URLS } from '../../../utils/constants';

type Props = {
  data: any;
  action: keyof Omit<typeof API_URLS.CAMPAIGNS, 'BASE'>;
};

export function useManageCampaign() {
  return useMutation({
    mutationFn: async ({ data, action }: Props) => {
      return api.post(API_URLS.CAMPAIGNS[action], data);
    },
  });
}
