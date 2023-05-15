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
  const [maxWidth, setMaxWidth] = useState(0);

  const maxContainerWidth = 340;
  const maxContainerHeight = 300;

  useEffect(() => {
    if (!!imgSrc) {
      const img = new Image();
      img.src = imgSrc;
      img.onload = function () {
        const aspectRatio = img.width / img.height;
        let h = img.height;
        if (h > maxContainerHeight) {
          h = maxContainerHeight;
        }
        setMaxWidth(h * aspectRatio);
      };
    }
  }, [imgSrc]);

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
            src={imgSrc}
            style={{
              borderRadius: '8px',
              width: '100%',
              maxHeight: maxContainerHeight,
              // maxWidth: maxContainerWidth,
              objectFit: 'contain',
              objectPosition: 'center',
            }}
          />
        )}
        <Box
          width={maxWidth > maxContainerWidth ? maxWidth : maxContainerWidth}
        >
          <Typography sx={{ fontSize: '0.95rem', marginX: '0.5rem' }}>
            {messagePreview || 'Preview da mensagem...'}
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
}
