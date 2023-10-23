import {
  Box,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Typography,
} from '@mui/material';
import { MessageType } from '../../../models/message';
import Show from '../../../components/MetaComponents/Show';
import { DoneAll, QueryBuilder } from '@mui/icons-material';
import {
  chatFormatDateTime,
  formatDateTime,
} from '../../../utils/dateAndTimeUtils';
import { formatPhoneNumber } from '../../../utils/phoneNumbers';
import { useChats } from '../logic/useChats';

type Props = {
  id: string;
  type: MessageType;
  text: string;
  sentAt: string;
  number: string;
  author?: string;
};

export function ChatItem({ id, type, text, sentAt, number, author }: Props) {
  const { store } = useChats();
  const selectedChatId = store((state) => state.selectedChatId);
  const setSelectedChatId = store((state) => state.setSelectedChatId);
  return (
    <ListItem
      onClick={() => setSelectedChatId(id)}
      alignItems="flex-start"
      sx={{
        '&+li': {
          borderTop: '1px solid #ececec',
        },
        '&:hover': {
          background: '#f3f3f3',
          cursor: 'pointer',
        },
        background: selectedChatId === id ? '#f3f3f3' : 'transparent',
        px: 2,
      }}
    >
      <ListItemAvatar>
        <Avatar
          alt="Remy Sharp"
          src="https://love.doghero.com.br/wp-content/uploads/2019/09/Corgi-1.jpg-1.jpg"
        />
      </ListItemAvatar>
      <ListItemText
        primary={<Typography>{author || formatPhoneNumber(number)}</Typography>}
        secondary={
          <Typography
            display={'flex'}
            gap={1}
            fontSize={'0.85rem'}
            color={'GrayText'}
          >
            <Show when={type === 'SENT'}>
              <DoneAll fontSize="small" />
            </Show>
            {text}
          </Typography>
        }
      />
      <Typography
        sx={{
          fontSize: '0.8rem',
          color: '#999999',
          textAlign: 'end',
          position: 'absolute',
          right: '1rem',
          top: '1rem',
        }}
      >
        {chatFormatDateTime(sentAt)}
      </Typography>
    </ListItem>
  );
}
