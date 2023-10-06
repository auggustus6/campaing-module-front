import { Box } from '@mui/material';

import ChatHeader from './components/ChatHeader';
import MessagesList from './components/MessagesList';
import SearchInput from './components/SearchInput';
import ContentHeader from './components/ContentHeader';
import Messages from './components/Messages';
import SendMessage from './components/SendMessage';
import NewServiceModal from './modals/NewServiceModal';
import { useChatModals } from './logic/useChatModals';
import Show from '../../components/MetaComponents/Show';

export default function ChatView() {
  const { chatModals, toggleCurrentChatModal } = useChatModals();

  return (
    <Box
      display={'grid'}
      gridTemplateColumns={'1fr 3fr'}
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
          height: '84vh',
          maxHeight: '84vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <ChatHeader />
        <SearchInput />
        <MessagesList />
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
        <ContentHeader />
        <Messages />
        <SendMessage />
      </Box>
    </Box>
  );
}
