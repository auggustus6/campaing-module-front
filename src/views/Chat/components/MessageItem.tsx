import { Box } from '@mui/material';
import React from 'react';

type Props = {
  type: "sent" | "received";
  text: string;
  sentAt: Date;
};

export default function MessageItem({ type, text, sentAt }: Props) {
  return (
    <Box display={'flex'} justifyContent={type === "sent" ? 'start' : 'end'}>
      <Box
        bgcolor={type === "sent" ? 'white' : '#4b00df'}
        pl={2}
        pr={6}
        borderRadius={2}
        py={2}
        textAlign={'start'}
        // boxShadow={'0px 0px 3px rgba(0,0,0,0.1)'}
        border={'1px solid #dfdfdf'}
        maxWidth={'50%'}
        color={type === "sent" ? '#333333' : 'white'}
      >
        {text}
      </Box>
    </Box>
  );
}
