import { MoreVert, Search } from '@mui/icons-material';
import { Box, Avatar, Typography } from '@mui/material';
import { IconButton } from '@mui/joy';

export  function ContentHeader() {
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
          src="https://love.doghero.com.br/wp-content/uploads/2019/09/Corgi-1.jpg-1.jpg"
        />
        <Typography ml={2} fontWeight={'bold'}>
          Chris Coy
        </Typography>
      </Box>
      <Box display={'flex'} gap={2}>
        <IconButton>
          <Search />
        </IconButton>
        <IconButton>
          <MoreVert />
        </IconButton>
      </Box>
    </Box>
  );
}
