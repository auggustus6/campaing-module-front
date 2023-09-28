import {
  Box,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
} from '@mui/material';


export default function MessagesList() {
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
          <ListItem
            alignItems="flex-start"
            key={i}
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
              secondary={
                <>{"I'll be in your neighborhood doing errands this…"}</>
              }
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
