import { Box, Typography } from '@mui/material';
import { MessageType } from '../../../../models/message';
import React, { useEffect, useState } from 'react';
import { getTime } from '../../../../utils/dateAndTimeUtils';
import Show from '../../../../components/MetaComponents/Show';
import MidiaModal from '../../modals/MidiaModal';

type Props = {
  type: MessageType;
  srcUrl?: string;
  src64?: string;
  sentAt: string;
  text?: string;
};

export function ImageMessage({ type, srcUrl, text, sentAt, src64 }: Props) {
  const imageRef = React.createRef<HTMLImageElement>();
  const imageSrc = src64 ? `data:audio/ogg;base64,${src64}` : srcUrl;
  const maxWidth = 330;
  const [imageWidth, setImageWidth] = useState<number>(maxWidth);

  const [isImageOpen, setIsImageOpen] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = imageSrc!;
    img.onload = () => {
      if (img.width <= maxWidth) {
        setImageWidth(maxWidth);
        return;
      }

      const aspectRatio = img.width / img.height;
      setImageWidth(Math.floor(aspectRatio * maxWidth));
    };
  }, []);

  return (
    <Box
      display={'flex'}
      justifyContent={type === 'RECEIVED' ? 'start' : 'end'}
    >
      <Show when={isImageOpen}>
        <MidiaModal
          onClose={() => setIsImageOpen(false)}
          text={text}
          content={
            <img
              src={imageSrc}
              style={{
                maxWidth: '80vw',
                maxHeight: '80vh',
              }}
            />
          }
        />
      </Show>
      <Box
        display={'flex'}
        flexDirection={'column'}
        borderRadius={2}
        overflow={'hidden'}
        position={'relative'}
        p={0.3}
        bgcolor={type === 'RECEIVED' ? 'white' : '#4b00df'}
        border="1px solid #dfdfdf"
        maxWidth={imageWidth}
        width={'100%'}
      >
        {/* IMAGE */}
        <Box
          onClick={() => setIsImageOpen(true)}
          component={'img'}
          ref={imageRef}
          draggable={false}
          src={imageSrc}
          sx={{
            maxWidth: `${maxWidth}px`,
            width: '100%',
            maxHeight: '500px',
            borderRadius: '6px',
            objectFit: 'contain',
            cursor: 'pointer',
            ['&:hover']: {
              opacity: 0.9,
            },
          }}
        />
        <Show when={!!text}>
          <Typography
            p={1}
            pr={3}
            color={type === 'RECEIVED' ? 'initial' : 'white'}
          >
            {text}
          </Typography>
        </Show>
        <Box
          sx={{
            position: 'absolute',
            bottom: 2,
            right: 4,
            fontSize: '0.7rem',
            color: type === 'RECEIVED' && !!text ? '#8b8b8b' : '#f0f0f0',
          }}
        >
          {getTime(sentAt)}
        </Box>
      </Box>
    </Box>
  );
}
