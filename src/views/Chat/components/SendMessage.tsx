import { Send } from '@mui/icons-material';
import { Box } from '@mui/material';
import { IconButton } from '@mui/joy';
import DefaultInput from '../../../components/Inputs/DefaultInput';
import { useState } from 'react';
import { useSendMessageMutation } from '../logic/useSendMessageMutation';

export function SendMessage() {
  const [text, setText] = useState('');
  const { mutate } = useSendMessageMutation();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    console.log(text);
    mutate({ text });
    setText('');
  }

  return (
    <Box p={4} component={'form'} onSubmit={handleSubmit}>
      <DefaultInput
        sx={{ p: 0, margin: 0, bgcolor: 'white' }}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Digite uma mensagem"
        InputProps={{
          endAdornment: (
            <IconButton type="submit">
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
