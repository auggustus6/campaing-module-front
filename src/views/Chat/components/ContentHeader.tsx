import {
  DeleteForever,
  Menu as MenuIcon,
  MoreVert,
  Remove,
  Search,
} from '@mui/icons-material';
import { Box, Avatar, Typography, Divider } from '@mui/material';
import {
  Dropdown,
  IconButton,
  ListItemDecorator,
  Menu,
  MenuButton,
  MenuItem,
} from '@mui/joy';
import { useChats } from '../logic/useChats';
import { formatPhoneNumber } from '../../../utils/phoneNumbers';
import { useRemoveChatMutation } from '../logic/useRemoveChatMutation';
import { theme } from '../../../styles/theme';
import { menuStateStore } from '../logic/useMenus';

export function ContentHeader() {
  const { selectedChat } = useChats();
  const { mutate } = useRemoveChatMutation();
  const openAside = menuStateStore((state) => state.openAside);

  function handleRemoveCall() {
    if (!selectedChat) return;
    mutate(selectedChat.id);
  }

  return (
    <Box
      display={'flex'}
      justifyContent={'space-between'}
      alignItems={'center'}
      bgcolor={'white'}
      borderBottom={'1px solid #dfdfdf'}
      height={'80px'}
      sx={{
        p: 4,
        [theme.breakpoints.down('md')]: {
          px: 1.8,
        },
      }}
    >
      <Box display={'flex'} alignItems={'center'}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            pr: 3,
            [theme.breakpoints.up('md')]: {
              display: 'none',
            },
          }}
        >
          <IconButton onClick={openAside}>
            <MenuIcon />
          </IconButton>
          <Box sx={{width: "1px", height: "40px", background: "#dfdfdf"}}/>
        </Box>

        <Avatar
          alt="Remy Sharp"
          src={
            selectedChat?.profilePictureUrl ||
            'https://love.doghero.com.br/wp-content/uploads/2019/09/Corgi-1.jpg-1.jpg'
          }
        />
        <Typography ml={2} fontWeight={'bold'}>
          {selectedChat?.name || selectedChat?.number}
        </Typography>
      </Box>
      <Box display={'flex'} gap={2}>
        <Dropdown>
          <MenuButton slots={{ root: IconButton }}>
            <MoreVert />
          </MenuButton>
          <Menu placement="bottom-end">
            <MenuItem onClick={handleRemoveCall}>
              <ListItemDecorator>
                <DeleteForever sx={{ color: '#f7485f' }} />
              </ListItemDecorator>
              Remover atendimento
            </MenuItem>
          </Menu>
        </Dropdown>
      </Box>
    </Box>
  );
}
