export interface Contact {
  id: string;
  contact: string;
  campaignId: string;
  variables: string;
  campaign: string;
  updatedAt: string;
  apiMessageId: string;
  status: Status;
}

export type Status = 'ENVIADO' | 'NAO_ENVIADO' | 'ERRO';
