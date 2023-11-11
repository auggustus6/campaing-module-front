import { Box } from '@mui/material';
import { ChatHeader } from './ChatHeader';
import { SearchInput } from './SearchInput';
import { MessagesList } from './ChatsList';
import { theme } from '../../../../styles/theme';
import { menuStateStore } from '../../logic/useMenus';
import { createRef, useEffect } from 'react';
import { useOnClickOutside } from '../../../../hooks/useOnClickOutside';
import { Close } from '@mui/icons-material';
import { IconButton } from '@mui/joy';
import { useChats } from '../../logic/useChats';
import Show from '../../../../components/MetaComponents/Show';

export default function AsideChat() {
  const isAsideOpen = menuStateStore((state) => state.isAsideOpen);
  const closeAside = menuStateStore((state) => state.closeAside);
  const { selectedChat } = useChats();
  const ref = createRef<HTMLDivElement>();
  useOnClickOutside(ref, () => {
    if (!selectedChat) return;
    closeAside();
  });

  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 200ms ease-in-out',
        zIndex: 1,
        [theme.breakpoints.down('md')]: {
          position: 'absolute',
          top: '0px',
          left: isAsideOpen ? '0%' : '-100%',
          boxShadow: '0px 0px 5px 0px rgba(0,0,0,0.25)',
        },
        background: '#fff',
      }}
      ref={ref}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          p: 1,
          [theme.breakpoints.up('md')]: {
            display: 'none',
          },
        }}
      >
        <Show when={!!selectedChat}>
          <IconButton onClick={closeAside}>
            <Close />
          </IconButton>
        </Show>
      </Box>
      <ChatHeader />
      <SearchInput />
      <Box position={'relative'} flex={1}>
        <Box
          position={'absolute'}
          sx={{
            inset: 0,
          }}
        >
          <MessagesList />
        </Box>
      </Box>
    </Box>
  );
}
