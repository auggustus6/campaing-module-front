import { Box, Paper } from '@mui/material';
import { theme } from '../../styles/theme';
import { Typography } from '@mui/joy';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';

interface PreviewWppMessageProps {
  messagePreview?: string;
  imgSrc?: string;
}

export default function PreviewWppMessage({
  messagePreview,
  imgSrc,
}: PreviewWppMessageProps) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [maxWidth, setMaxWidth] = useState(0);

  // const maxWidth = imgRef.current?.clientWidth;

  return (
    <Paper
      sx={{
        backgroundImage: `url(/wpp_background.png)`,
        p: 4,
        px: 10,
        outline: `1px solid ${theme.palette.primary.main}`,
        whiteSpace: 'pre-wrap',
      }}
      variant={'outlined'}
    >
      <Box
        sx={{
          background: 'white',
          display: 'inline-block',
          p: 0.5,
          color: '#111b21',
          borderRadius: 2,
          width: 'auto',
          // maxWidth: '340px',

          boxShadow: '0px 0px 2px -0.5px rgba(0,0,0,0.5)',
          whiteSpace: 'pre-wrap',
          wordWrap: 'break-word',
        }}
      >
        {imgSrc && (
          <img
            ref={imgRef}
            src={imgSrc}
            style={{
              borderRadius: '8px',
              // width: '100%',
              maxHeight: '300px',
              maxWidth: '340px',
              objectFit: 'contain',
              objectPosition: 'center',
            }}
          />
        )}
        <Box width={"340px"}>
          <Typography sx={{ fontSize: '0.95rem', marginX: '0.5rem' }}>
            {messagePreview || 'Preview da mensagem...'}
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
}
