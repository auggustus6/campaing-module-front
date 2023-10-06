import { Typography } from '@mui/material';
import React from 'react';
import Show from '../MetaComponents/Show';

type Props = {
  children?: React.ReactNode;
};

export default function ErrorLabel({ children }: Props) {
  return (
    <Show when={!!children}>
      <Typography
        sx={{
          color: '#d32f2f',
          marginLeft: '0.875rem',
          fontSize: '0.75rem',
          marginTop: '3px',
          ml: 0,
        }}
      >
        {children}
      </Typography>
    </Show>
  );
}
