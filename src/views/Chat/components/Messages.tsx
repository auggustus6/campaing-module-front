import { Box } from '@mui/material';
import React, { useEffect, useRef } from 'react';
import { MessageItem } from './MessageItem';
import { useMessages } from '../logic/useMessages';
import { useChats } from '../logic/useChats';

export function Messages() {
  const container = useRef<HTMLDivElement>(null);
  const { store } = useMessages();
  const messages = store((state) => state.messages);
  const { store: chatStore } = useChats();
  const selectedChatId = chatStore((state) => state.selectedChatId);

  useEffect(() => {
    if (!container.current || !selectedChatId) return;

    setTimeout(() => {
      if (container.current) {
        container.current.scrollTop = container.current?.scrollHeight || 0;
        container.current.style.overflow = 'scroll';
      }
    }, 0);
  }, [container.current, selectedChatId]);

  return (
    <Box
      flex={1}
      display={'flex'}
      flexDirection={'column'}
      gap={2}
      px={4}
      py={2}
      overflow={'hidden'}
      sx={{
        '&::-webkit-scrollbar-thumb': {
          borderRadius: 0,
        },
      }}
      ref={container}
    >
      {messages.map((message, i) => (
        <MessageItem
          key={message.id}
          type={message.type}
          sentAt={message.createdAt}
          text={message.content.message}
        />
      ))}
    </Box>
  );
}
