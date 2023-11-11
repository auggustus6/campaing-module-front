import { Box, List } from '@mui/material';
import { useChats } from '../../logic/useChats';
import { ChatItem } from './ChatItem';
import Show from '../../../../components/MetaComponents/Show';
import { CircularProgress, Stack } from '@mui/joy';
import { searchStore } from '../../logic/useSearchStore';
import useChannels from '../../../../hooks/querys/useChannels';

export function MessagesList() {
  const { store, query } = useChats();
  const chatSearch = searchStore((state) => state.chatSearch);

  const chats = store((state) => state.chats);
  const selectedChannel = store((state) => state.selectedChannel);

  const chatsFiltered = chats.filter((chat, i) => {
    console.log(`chat ${i}`, chat);
    
    if (!chatSearch) return true;
    return (
      chat.name?.toLowerCase().includes(chatSearch?.toLowerCase() || '') ||
      chat.number.toLowerCase().includes(chatSearch?.toLowerCase() || '')
    );
  });

  return (
    <Box
      sx={{
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
        height: '100%',
        overflowY: 'scroll',
        '&::-webkit-scrollbar-thumb': {
          borderRadius: 0,
        },
      }}
    >
      <List sx={{ width: '100%', py: 0, bgcolor: 'background.paper' }}>
        {chatsFiltered.map((chat) => (
          <ChatItem
            key={chat.id}
            id={chat.id}
            sentAt={chat.updatedAt}
            text={chat.lastMessage.content.message}
            type={chat.lastMessage.type}
            number={chat.number}
            author={chat.name}
            contentType={chat.lastMessage.content.type}
            sending={chat.lastMessage.sending}
            picture={chat.profilePictureUrl}
          />
        ))}
      </List>
      <Show when={query.isLoading || !selectedChannel}>
      <Box
        sx={{
          display: 'flex',
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
        }}
      >
        <CircularProgress size="lg" />
      </Box>
      </Show>
    </Box>
  );
}
