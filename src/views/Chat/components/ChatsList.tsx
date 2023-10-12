import {
  Box,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
} from '@mui/material';
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
        flexDirection: 'column',
        height: '100%',
        overflowY: 'scroll',
        '&::-webkit-scrollbar-thumb': {
          borderRadius: 0,
        },
      }}
    >
      <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
        {new Array(30).fill(0).map((_, i) => (
          <ChatItem />
        ))}
      </List>
    </Box>
  );
}
