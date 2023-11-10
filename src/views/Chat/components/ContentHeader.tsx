import { DeleteForever, MoreVert, Remove, Search } from '@mui/icons-material';
import { Box, Avatar, Typography } from '@mui/material';
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

export function ContentHeader() {
  const { selectedChat } = useChats();
  const { mutate } = useRemoveChatMutation();

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
      p={4}
      height={'80px'}
    >
      <Box display={'flex'} alignItems={'center'}>
        <Avatar
          alt="Remy Sharp"
          src={
            selectedChat?.profilePictureUrl ||
            'https://love.doghero.com.br/wp-content/uploads/2019/09/Corgi-1.jpg-1.jpg'
          }
        />
        <Typography ml={2} fontWeight={'bold'}>
          {selectedChat?.name || formatPhoneNumber(selectedChat?.number || '')}
        </Typography>
      </Box>
      <Box display={'flex'} gap={2}>
        {/* <IconButton>
          <Search />
        </IconButton> */}
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
        {/* <IconButton>
          <MoreVert />
        </IconButton> */}
      </Box>
    </Box>
  );
}
