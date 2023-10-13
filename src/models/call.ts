import { Message } from './message';

export interface Chat {
  id: string;
  name: string;
  number: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;

  companyId: string;
  channelId: string;

  lastMessage: Message;
}
