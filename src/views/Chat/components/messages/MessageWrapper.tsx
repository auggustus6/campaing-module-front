import React from 'react';
import { MessageType } from '../../../../models/message';
import { Box } from '@mui/material';
import Show from '../../../../components/MetaComponents/Show';
import { Error } from '@mui/icons-material';

type Props = {
  children: () => React.ReactNode;
  loading?: boolean;
  error?: boolean;
  type: MessageType;
  id: string;
};

export function MessageWrapper({
  children,
  loading = false,
  error = false,
  type,
  id
}: Props) {
  return (
    <Box
      display={'flex'}
      justifyContent={type === 'RECEIVED' ? 'start' : 'end'}
      sx={{
        position: 'relative',
      }}
      id={id}
    >
      <Box position={'relative'}>
        <Box
          sx={{
            opacity: loading || error ? 0.5 : 1,
          }}
        >
          {children()}
        </Box>
        <Show when={error}>
          <Error
            sx={{
              position: 'absolute',
              top: 4,
              right:  4,
              fontSize: '2rem',
              color: 'red',
            }}
          />
        </Show>
      </Box>
    </Box>
  );
}
