import {
  Box,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
} from '@mui/material';

type Props = {
  // type: "sent" | "received";
  text?: string;
  // sentAt: Date;
} 

export function ChatItem({text}:Props) {
  return (
    <ListItem
      alignItems="flex-start"
      sx={{
        '&+&': {
          borderTop: '1px solid #ececec',
        },
        '&:hover': {
          background: '#f3f3f3',
          cursor: 'pointer',
        },
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
        primary="Chris coy"
        secondary={<>{text}</>}
      />
    </ListItem>
  );
}
