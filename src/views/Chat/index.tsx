import { Box } from '@mui/material';

import { ChatHeader } from './components/AsideChat/ChatHeader';
import { MessagesList } from './components/AsideChat/ChatsList';
import { SearchInput } from './components/AsideChat/SearchInput';
import { ContentHeader } from './components/ContentHeader';
import { Messages } from './components/Messages';
import { SendMessage } from './components/SendMessage';
import NewServiceModal from './modals/NewServiceModal';
import { useChatModals } from './logic/useChatModals';
import Show from '../../components/MetaComponents/Show';
import { useChats } from './logic/useChats';
import { useEffect } from 'react';
import { ChatBubbleOutline } from '@mui/icons-material';
import { Typography } from '@mui/joy';
import { useSearchParams } from 'react-router-dom';
import AsideChat from './components/AsideChat';
import { theme } from '../../styles/theme';
import { menuStateStore } from './logic/useMenus';

export default function ChatView() {
  const { chatModals, toggleCurrentChatModal } = useChatModals();
  const { store, query } = useChats();
  const chats = store((state) => state.chats);
  const selectedChatId = store((state) => state.selectedChatId);
  const setSelectedChatId = store((state) => state.setSelectedChatId);
  let [searchParams, setSearchParams] = useSearchParams();
  const closeAside = menuStateStore((state) => state.closeAside);

  useEffect(() => {
    if (!selectedChatId) return;
    setSearchParams({ id: selectedChatId });
  }, [selectedChatId]);

  useEffect(() => {
    if (!query.data || query.data.data.length === 0 || !chats.length) return;

    const chatId = searchParams.get('id');
    if (!chatId) return;

    if (!chats.find((chat) => chat.id === chatId)) {
      closeAside();
      return setSearchParams(undefined, { replace: true });
    }

    setSelectedChatId(chatId);
    closeAside()
  }, [query.isFetched, chats]);

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: '1fr 3fr',
        maxHeight: '84vh',
        height: '100%',
        borderRadius: 1,
        overflow: 'hidden',
        position: "relative",
        boxShadow: '0px 0px 10px rgba(0,0,0,0.1)',
        [theme.breakpoints.down('md')]: {
          display: 'flex',
        },
      }}
    >
      {/* MODALS */}
      <>
        <Show when={chatModals === 'newService'}>
          <NewServiceModal onClose={toggleCurrentChatModal} />
        </Show>
      </>
      <AsideChat />
      <Box
        sx={{
          background: '#f7f7f7',
          display: 'flex',
          flexDirection: 'column',
          height: '84vh',
          maxHeight: '84vh',
          width: '100%',
        }}
      >
        <Show when={!selectedChatId}>
          <Box
            display={'flex'}
            flexDirection={'column'}
            alignItems={'center'}
            justifyContent={'center'}
            flex={1}
            gap={4}
          >
            <ChatBubbleOutline sx={{ fontSize: '10rem', color: '#4b00df' }} />
            <Typography color="neutral" fontSize={'1.5rem'} fontWeight={'300'}>
              Selecione um atendimento
            </Typography>
          </Box>
        </Show>
        <Show when={!!selectedChatId}>
          <ContentHeader />
          <Messages />
          <SendMessage />
        </Show>
      </Box>
    </Box>
  );
}
