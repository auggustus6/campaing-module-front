import { Send } from '@mui/icons-material';
import { Box } from '@mui/material';
import { IconButton } from '@mui/joy';
import DefaultInput from '../../../components/Inputs/DefaultInput';

export  function SendMessage() {
  return (
    <Box p={4}>
      <DefaultInput
        sx={{ p: 0, margin: 0, bgcolor: 'white' }}
        // variant="standard"
        placeholder="Digite uma mensagem"
        InputProps={{
          endAdornment: (
            <IconButton>
              <Send />
            </IconButton>
          ),
          sx: {
            py: 1,
            px: 2,
            '&:hover': {
              outline: 'none',
              border: 'none',
            },
          },
        }}
      />
    </Box>
  );
}
