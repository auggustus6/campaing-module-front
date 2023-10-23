import { Box } from '@mui/material';
import React from 'react';
import { MessageType } from '../../../../models/message';
import { getTime } from '../../../../utils/dateAndTimeUtils';

type Props = {
  type: MessageType;
  text: string;
  sentAt: string;
  sending?: boolean;
};

export function TextMessage({ type, text, sentAt, sending }: Props) {
  return (
    <Box
      display={'flex'}
      justifyContent={type === 'RECEIVED' ? 'start' : 'end'}
    >
      <Box
        bgcolor={type === 'RECEIVED' ? 'white' : '#4b00df'}
        pl={1.5}
        pr={8}
        borderRadius={2}
        py={1}
        textAlign={'start'}
        // boxShadow={'0px 0px 3px rgba(0,0,0,0.1)'}
        position={'relative'}
        border={'1px solid #dfdfdf'}
        maxWidth={'50%'}
        color={type === 'RECEIVED' ? '#333333' : 'white'}
        sx={{ opacity: sending ? 0.5 : 1 }}
      >
        {text}
        <Box
          sx={{
            position: 'absolute',
            bottom: 2,
            right: 4,
            fontSize: '0.7rem',
            color: type === 'RECEIVED' ? '#8b8b8b' : '#f0f0f0',
          }}
        >
          {getTime(sentAt)}
        </Box>
      </Box>
    </Box>
  );
}
