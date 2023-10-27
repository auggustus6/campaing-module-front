export interface Message {
  id: string;
  createdAt: string;
  updatedAt: string;
  error: boolean;
  type: MessageType;
  callId: string;
  contentId: string;
  content: {
    id: string;
    type: ContentType;
    message: string;
    midiaUrl?: string;
    midiaBase64?: string;
    fileName?: string;
  };

  // fields below are not returned by the API
  // they are used to show if the message was sent or not
  sending?: boolean;
  errorOnSending?: boolean;
}

export type MessageType = 'SENT' | 'RECEIVED';

export type ContentType =
  | 'TEXT'
  | 'IMAGE_BASE64'
  | 'IMAGE_URL'
  | 'VIDEO_BASE64'
  | 'VIDEO_URL'
  | 'AUDIO_BASE64'
  | 'AUDIO_URL'
  | 'DOCUMENT_BASE64'
  | 'DOCUMENT_URL'
  | 'STICKER';
