import { Add, Circle, PlusOne } from '@mui/icons-material';
import { IconButton } from '@mui/joy';
import { Box, Typography } from '@mui/material';
import React from 'react';
import { useChatModals } from '../logic/useChatModals';
import { useChats } from '../logic/useChats';

export  function ChatHeader() {
  const { openChatModal } = useChatModals();
  return (
    <Box
      sx={{
        background: 'linear-gradient(180deg, #8e2ce1 0%, #4b00df 100%)',
        p: '1rem',
        height: '80px',
      }}
      display={'flex'}
      gap={'1rem'}
      color={'white'}
      alignItems={'center'}
    >
      <Box
        sx={{
          background: '#e51c3f',
          height: '3rem',
          width: '3rem',
          borderRadius: '5px',
          display: 'grid',
          placeItems: 'center',
          fontSize: '1rem',
          fontWeight: 'bold',
        }}
      >
        ID
      </Box>
      <Box
        display={'flex'}
        flex={1}
        flexDirection={'column'}
        justifyContent={'center'}
      >
        <p>Idw Soluções</p>
        <Typography display={'flex'} alignItems={'center'} gap={1}>
          online <Circle color="success" fontSize={'small'} />
        </Typography>
      </Box>
      <Box height={40}>
        <IconButton
          sx={{ bgcolor: 'white' }}
          onClick={() => openChatModal('newService')}
        >
          <Add />
        </IconButton>
      </Box>
    </Box>
  );
}
