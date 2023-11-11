import {
  Box,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Typography,
} from '@mui/material';
import { ContentType, MessageType } from '../../../../models/message';
import Show from '../../../../components/MetaComponents/Show';
import {
  Audiotrack,
  DoneAll,
  FilePresent,
  Image,
  QueryBuilder,
  StickyNote2,
  Update,
  VideoLibrary,
} from '@mui/icons-material';
import {
  chatFormatDateTime,
  formatDateTime,
} from '../../../../utils/dateAndTimeUtils';
import { formatPhoneNumber } from '../../../../utils/phoneNumbers';
import { useChats } from '../../logic/useChats';
import { menuStateStore } from '../../logic/useMenus';

type Props = {
  id: string;
  type: MessageType;
  text: string;
  sentAt: string;
  number: string;
  author?: string;
  sending?: boolean;
  contentType: ContentType;
  picture?: string;
};

export function ChatItem({
  id,
  type,
  text,
  sentAt,
  number,
  author,
  sending = false,
  contentType,
  picture,
}: Props) {
  const { store } = useChats();
  const selectedChatId = store((state) => state.selectedChatId);
  const setSelectedChatId = store((state) => state.setSelectedChatId);
  const closeAside = menuStateStore((state) => state.closeAside);

  function handleChatClick(id: string) {
    closeAside();
    if (selectedChatId === id) return;
    const container = document.getElementById('containerMessagesRef');
    console.log('container', container);

    if (container) {
      container.style.setProperty('opacity', '0');
    }
    setSelectedChatId(id);
  }

  return (
    <ListItem
      onClick={() => handleChatClick(id)}
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
          src={
            picture ||
            'https://love.doghero.com.br/wp-content/uploads/2019/09/Corgi-1.jpg-1.jpg'
          }
        />
      </ListItemAvatar>
      <ListItemText
        primary={
          <Typography
            // style={{
            //   whiteSpace: 'nowrap',
            // }}
          >
            {author || number}
          </Typography>
        }
        secondary={
          <Typography
            display={'flex'}
            gap={1}
            fontSize={'0.85rem'}
            color={'GrayText'}
            alignItems={'center'}
            noWrap
          >
            <Show when={type === 'SENT'}>
              <Show when={sending}>
                <Update fontSize="small" />
              </Show>
              <Show when={!sending}>
                <DoneAll fontSize="small" />
              </Show>
            </Show>
            <Box
              component={'span'}
              display="flex"
              gap={0.3}
              alignItems={'center'}
            >
              <MessageType type={contentType} text={text} />
            </Box>
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

function MessageType({ type, text }: { type?: ContentType; text: string }) {
  switch (type) {
    case 'TEXT':
      return <Typography component={'span'}>{text}</Typography>;
    case 'STICKER':
      return (
        <>
          <StickyNote2 />
          <Typography component={'span'}>Figurinha</Typography>
        </>
      );
    case 'AUDIO_BASE64':
    case 'AUDIO_URL':
      return (
        <>
          <Audiotrack />
          <Typography component={'span'}>Audio</Typography>
        </>
      );
    case 'IMAGE_BASE64':
    case 'IMAGE_URL':
      return (
        <>
          <Image />
          <Typography component={'span'}>Imagem</Typography>
        </>
      );
    case 'VIDEO_BASE64':
    case 'VIDEO_URL':
      return (
        <>
          <VideoLibrary />
          <Typography component={'span'}>Video</Typography>
        </>
      );
    case 'DOCUMENT_BASE64':
    case 'DOCUMENT_URL':
      return (
        <>
          <FilePresent />
          <Typography component={'span'}>Anexo</Typography>
        </>
      );
  }
  return null;
}
