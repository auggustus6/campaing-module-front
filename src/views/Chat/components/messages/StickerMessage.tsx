import { Box } from '@mui/material';
import React, { useEffect, useRef } from 'react';
import { MessageType } from '../../../../models/message';
import { getTime } from '../../../../utils/dateAndTimeUtils';

type Props = {
  type: MessageType;
  src?: string;
  sentAt: string;
};

export function StickerMessage({ type, src, sentAt }: Props) {
  return (
    <Box
      display={'flex'}
      justifyContent={type === 'RECEIVED' ? 'start' : 'end'}
    >
      <Box
        display={'flex'}
        flexDirection={'column'}
        alignItems={'end'}
        gap={0.2}
        borderRadius={2}
        maxWidth={'500px'}
      >
        <img
          src={`data:image/jpeg;base64,${src}`}
          alt="sticker"
          style={{
            maxWidth: '200px',
            maxHeight: '200px',
          }}
        />
        <Box
          sx={{
            fontSize: '0.7rem',
            color: type === 'RECEIVED' ? '#8b8b8b' : '#4b00df',
            bgcolor: type === 'RECEIVED' ? 'white' : '#4b00df',
            border: type === 'RECEIVED' ? '1px solid #d3d3d3' : 'none',
            px: 0.7,
            py: 0.3,
            borderRadius: 2,
          }}
        >
          {getTime(sentAt)}
        </Box>
      </Box>
    </Box>
  );
}
