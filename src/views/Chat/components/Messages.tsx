import { Box } from '@mui/material';
import React, { useEffect, useRef } from 'react';
import { useMessages } from '../logic/useMessages';
import { useChats } from '../logic/useChats';
import { TextMessage } from './messages/TextMessage';
import { StickerMessage } from './messages/StickerMessage';

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
      overflow={'scroll'}
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
                image={message.content.midiaBase64!}
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
        }
      })}
      <div ref={scrollToRef} />
    </Box>
  );
}
