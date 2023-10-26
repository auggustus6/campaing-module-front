import { Box, List } from '@mui/material';
import { useChats } from '../logic/useChats';
import { ChatItem } from './ChatItem';

export function MessagesList() {
  const { store } = useChats();
  const chats = store((state) => state.chats);

  console.log(chats);

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
        {chats.map((chat) => (
          <ChatItem
            key={chat.id}
            id={chat.id}
            sentAt={chat.updatedAt}
            text={chat.lastMessage.content.message}
            type={chat.lastMessage.type}
            number={chat.number}
            author={chat.name}
          />
        ))}
      </List>
    </Box>
  );
}
