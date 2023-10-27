import { Box } from '@mui/material';
import React, { useEffect, useRef } from 'react';
import { useMessages } from '../logic/useMessages';
import { useChats } from '../logic/useChats';
import { TextMessage } from './messages/TextMessage';
import { StickerMessage } from './messages/StickerMessage';
import { AudioMessage } from './messages/AudioMessage';
import { ImageMessage } from './messages/ImageMessage';
import { VideoMessage } from './messages/VideoMessage';
import { DocumentMessage } from './messages/DocumentMessage';

export function Messages() {
  const scrollToRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { store } = useMessages();
  const messages = store((state) => state.messages);
  const { store: chatStore } = useChats();
  const selectedChatId = chatStore((state) => state.selectedChatId);

  // useEffect(() => {
  //   if (!scrollToRef.current || !selectedChatId) return;

  //   setTimeout(() => {
  //     if (containerRef.current && scrollToRef.current) {
  //       scrollToRef.current.scrollIntoView({
  //         behavior: 'smooth',
  //         block: 'end',
  //       });
  //       containerRef.current.scrollTop =
  //         containerRef.current?.scrollHeight || 0;
  //         setTimeout(() => {
  //           containerRef.current!.style.overflow = 'scroll';
  //           containerRef.current!.style.opacity = 1;
  //       }, 10);
  //     }
  //   }, 0);
  // }, [scrollToRef.current, selectedChatId]);

  console.log('messages', messages);

  return (
    <Box
      flex={1}
      display={'flex'}
      flexDirection={'column'}
      gap={2}
      px={4}
      py={2}
      overflow={'auto'}
      sx={{
        '&::-webkit-scrollbar-thumb': {
          borderRadius: 0,
        },
      }}
      ref={containerRef}
    >
      {messages.map((message, i) => {
        switch (message.content.type) {
          case 'STICKER':
            return (
              <StickerMessage
                key={message.id}
                src={message.content.midiaBase64}
                sentAt={message.updatedAt}
                type={message.type}
              />
            );
          case 'TEXT':
            return (
              <TextMessage
                key={message.id}
                type={message.type}
                sentAt={message.updatedAt}
                text={message.content.message}
                sending={message.sending}
              />
            );
          case 'AUDIO_BASE64':
          case 'AUDIO_URL':
            return (
              <AudioMessage
                key={message.id}
                sentAt={message.updatedAt}
                type={message.type}
                src64={message.content.midiaBase64}
                srcUrl={message.content.midiaUrl}
              />
            );
          case 'IMAGE_BASE64':
          case 'IMAGE_URL':
            return (
              <ImageMessage
                sentAt={message.updatedAt}
                type={message.type}
                src64={message.content.midiaBase64}
                srcUrl={message.content.midiaUrl}
                text={message.content.message}
              />
            );
          case 'VIDEO_BASE64':
          case 'VIDEO_URL':
            return (
              <VideoMessage
                sentAt={message.updatedAt}
                type={message.type}
                src64={message.content.midiaBase64}
                srcUrl={message.content.midiaUrl}
                text={message.content.message}
              />
            );
          case 'DOCUMENT_BASE64':
          case 'DOCUMENT_URL':
            return (
              <DocumentMessage
                sentAt={message.updatedAt}
                type={"SENT"}
                src64={message.content.midiaBase64}
                srcUrl={message.content.midiaUrl}
                fileName={message.content.fileName}
              />
            );
        }
      })}
      <div ref={scrollToRef} />
    </Box>
  );
}
