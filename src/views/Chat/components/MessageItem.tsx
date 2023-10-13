import { Box } from '@mui/material';
import React from 'react';
import { MessageType } from '../../../models/message';

type Props = {
  type: MessageType;
  text: string;
  sentAt: string;
};

export  function MessageItem({ type, text, sentAt }: Props) {
  return (
    <Box display={'flex'} justifyContent={type === "RECEIVED" ? 'start' : 'end'}>
      <Box
        bgcolor={type === "RECEIVED" ? 'white' : '#4b00df'}
        pl={2}
        pr={6}
        borderRadius={2}
        py={2}
        textAlign={'start'}
        // boxShadow={'0px 0px 3px rgba(0,0,0,0.1)'}
        border={'1px solid #dfdfdf'}
        maxWidth={'50%'}
        color={type === "RECEIVED" ? '#333333' : 'white'}
      >
        {text}
      </Box>
    </Box>
  );
}
