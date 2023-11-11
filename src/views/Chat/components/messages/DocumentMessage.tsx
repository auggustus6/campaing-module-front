import { Box } from '@mui/material';
import React from 'react';
import { getTime } from '../../../../utils/dateAndTimeUtils';
import { MessageType } from '../../../../models/message';
import {
  Download,
  DownloadDone,
  DownloadForOffline,
  DownloadRounded,
  PictureAsPdf,
} from '@mui/icons-material';
import { IconButton, Typography } from '@mui/joy';
import { theme } from '../../../../styles/theme';

type Props = {
  type: MessageType;
  srcUrl?: string;
  src64?: string;
  sentAt: string;
  fileName?: string;
};

export function DocumentMessage({
  type,
  srcUrl,
  sentAt,
  src64,
  fileName,
}: Props) {
  const documentSrc = src64 ? `data:application/pdf;base64,${src64}` : srcUrl;

  const fileNameFormatted = fileName || new Date().getTime() + '.pdf';

  return (
    <Box
      sx={{
        width: '300px',
        [theme.breakpoints.down('md')]: {
          width: '220px',
        },
        height: '70px',
        position: 'relative',
        borderRadius: 2,
        bgcolor: type === 'RECEIVED' ? 'white' : '#4b00df',
        border: '1px solid #dfdfdf',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 2,
          px: 2,
          py: 0.5,
          backgroundColor: '#f5f5f5',
          borderRadius: '5px',
        }}
      >
        <PictureAsPdf />
        <Box flex={1}>
          <Typography>{fileName || 'arquivo'}</Typography>
        </Box>
        <a
          href={documentSrc}
          download={fileName || fileNameFormatted}
          style={{ all: 'unset' }}
        >
          <IconButton>
            <DownloadForOffline />
          </IconButton>
        </a>
      </Box>
      <Box
        sx={{
          position: 'absolute',
          bottom: 2,
          right: 4,
          fontSize: '0.7rem',
          color: type === 'RECEIVED' ? '#8b8b8b' : 'white',
        }}
      >
        {getTime(sentAt)}
      </Box>
    </Box>
  );
}
