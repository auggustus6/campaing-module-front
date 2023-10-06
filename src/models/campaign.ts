import { Contact } from "./Contact";
import { Channel } from "./channel";

export interface Campaign {
  id: string;
  channel_id: string;
  companyId: string;

  title: string;
  message: string;
  midiaType: MidiaType;
  midiaUrl?: string;
  midia?: string;
  scheduleDate: string;
  sendDelay: string;
  sentContactsCount: number;
  status: Status;
  isDeleted: boolean;

  startTime: number;
  endTime: number;
  startDate?: string;
  endDate?: string;

  contacts: Contact[];
  channel: Channel;

  _count: {
    contacts: number;
  };
}

type Status =
  | 'CANCELADO'
  | 'PAUSADO'
  | 'EM_PROGRESSO'
  | 'CONCLUIDO'
  | 'INICIAR'
  | 'PAUSE_AUTOMATIC'
  | 'ERRO'
  | 'CHANNEL_DISCONNECTED';

type MidiaType =
  | 'TEXT'
  | 'IMAGE_BASE64'
  | 'IMAGE_URL'
  | 'VIDEO_BASE64'
  | 'VIDEO_URL'
  | 'AUDIO_BASE64'
  | 'AUDIO_URL'
  | 'DOCUMENT_BASE64'
  | 'DOCUMENT_URL';
