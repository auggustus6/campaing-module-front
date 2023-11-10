import { Box } from '@mui/material';

import { ChatHeader } from './components/ChatHeader';
import { MessagesList } from './components/ChatsList';
import { SearchInput } from './components/SearchInput';
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

export default function ChatView() {
  const { chatModals, toggleCurrentChatModal } = useChatModals();
  const { store, query } = useChats();
  const chats = store((state) => state.chats);
  const selectedChatId = store((state) => state.selectedChatId);
  const setSelectedChatId = store((state) => state.setSelectedChatId);
  let [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (!selectedChatId) return;
    setSearchParams({ id: selectedChatId });
  }, [selectedChatId]);

  // i dont know why i cant just set the chat after is loaded, but this work...
  useEffect(() => {
    if (!query.isFetched) return;
    const chatId = searchParams.get('id');
    if (!chatId) return;
    setTimeout(() => {
      setSelectedChatId(chatId);
    }, 1000);
  }, [query.isFetched]);

  return (
    <Box
      display={'grid'}
      gridTemplateColumns={'1fr 3fr'}
      maxHeight={'84vh'}
      height={'100%'}
      borderRadius={1}
      overflow={'hidden'}
      boxShadow={'0px 0px 10px rgba(0,0,0,0.1)'}
    >
      {/* MODALS */}
      <>
        <Show when={chatModals === 'newService'}>
          <NewServiceModal onClose={toggleCurrentChatModal} />
        </Show>
      </>
      <Box
        sx={{
          height: '100%',
          // maxHeight: '84vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
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
      <Box
        sx={{
          background: '#f7f7f7',
          display: 'flex',
          flexDirection: 'column',
          height: '84vh',
          maxHeight: '84vh',
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
